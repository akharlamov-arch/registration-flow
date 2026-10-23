// Gets a picked file ready to cross whatever connection the customer is on.
//
// A portal customer on a weak cellular uplink could not attach a driver-licence
// photo (2026-10-09): nginx saw six POSTs begin and none finish, so Phoenix
// logged only the preflight. A licence photo straight off a phone camera is
// 3–12 MB; the same photo at 2200 px is a few hundred KB, which is the
// difference between finishing and stalling on a bad signal. Two things happen
// here, both before the first byte is sent:
//
//   1. The file is read into memory. A file the browser cannot read (a
//      Drive/iCloud placeholder, a camera file still being written) fails HERE,
//      at pick time and with a specific error — not after the preflight, where
//      fetch can only say "Failed to fetch".
//   2. A large image is re-encoded as a smaller JPEG.
//
// Re-encoding is an optimisation and never a gate: if the browser cannot decode
// the image, the original goes up untouched and the server decides.

// A licence photographed at this width stays legible with room to spare.
const MAX_EDGE = 2200
// Leave a JPEG this small alone — re-encoding it costs quality for no gain.
const SKIP_BELOW_BYTES = 1024 * 1024
const TARGET_BYTES = 1.5 * 1024 * 1024
const JPEG_QUALITIES = [0.82, 0.72, 0.6]

// A phone's full-resolution photo can be 20+ MB and is fine to shrink; this only
// stops us reading something absurd (a video) into memory before refusing it.
export const RAW_LIMIT_BYTES = 40 * 1024 * 1024

// Some Android pickers hand over a file with no MIME type.
const TYPE_BY_EXTENSION = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

function typeOf(file) {
  if (file.type) return file.type
  const extension = file.name.split('.').pop().toLowerCase()
  return TYPE_BY_EXTENSION[extension] ?? ''
}

// FileReader rather than Blob#arrayBuffer: the latter needs Safari 14.1.
function readBytes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error ?? new Error('unreadable file'))
    reader.readAsArrayBuffer(file)
  })
}

function loadImage(file) {
  const url = URL.createObjectURL(file)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('undecodable image'))
    }
    img.src = url
  })
}

function toJpeg(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

// Resolves to a smaller JPEG Blob, or null when there is nothing smaller to send.
async function shrink(file) {
  const { img, url } = await loadImage(file)
  try {
    // Browsers apply the photo's EXIF rotation when decoding, so natural* is
    // already the upright size.
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)

    const ctx = canvas.getContext('2d')
    // JPEG has no alpha: a PNG's transparent pixels would come out black.
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    let smallest = null
    for (const quality of JPEG_QUALITIES) {
      const blob = await toJpeg(canvas, quality)
      if (!blob) break
      if (!smallest || blob.size < smallest.size) smallest = blob
      if (blob.size <= TARGET_BYTES) break
    }
    return smallest && smallest.size < file.size ? smallest : null
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Resolves to an in-memory `File` ready to upload. Rejects only when the file
 * itself cannot be read — the caller says so; every other failure falls back to
 * the file as picked.
 */
export async function prepareUpload(file) {
  const type = typeOf(file)
  const original = new File([await readBytes(file)], file.name, {
    type,
    lastModified: file.lastModified,
  })

  // A GIF may be animated, and re-encoding would flatten it.
  const shrinkable = type.startsWith('image/') && type !== 'image/gif'
  if (!shrinkable || original.size <= SKIP_BELOW_BYTES) return original

  try {
    const blob = await shrink(original)
    if (!blob) return original
    const name = original.name.replace(/\.[^.]*$/, '') || 'photo'
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg' })
  } catch {
    return original
  }
}
