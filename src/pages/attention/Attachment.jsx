// File attachment control, replicating the one the registration flow uses for
// the driver licence and the void check (src/pages/OtpVerification.jsx:1665-1710
// and 2551-2612): a dashed drop panel that turns into a green-ticked filename
// with "Click to change file" once something is attached.
//
// How the picked file is uploaded is the caller's `upload(file)`, which
// resolves to { ok, key, code }. The contract form passes the recording
// endpoint (api/portal.js uploadDriverLicense, PORTAL-UPLOAD-01): the server
// stores the file AND records it on the customer before answering, so the
// attachment survives a reload before signing. Without `upload` the control
// keeps its old presign + PUT (defaultUpload below) — the bank tab's
// MoovFallback still relies on that until PORTAL-MOOV-03 wires it.
//
// The value the field carries once uploaded is the S3 key
// (`driver_license_file_name` in the real contract payload). The picked file's
// own name is what stays on screen; after a reload only the key is left, so
// the key's readable tail is shown instead (readableName).
//
// Note this is NOT components/FileUpload.jsx — that widget belongs to the old
// PortalPage and is used nowhere in the registration flow.

import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { presignUpload, uploadToS3 } from '../../api/portal'
import { validateUploadFile } from '../../api/leadMappers'

// What the server accepts (Pijb.Storage.DocumentUpload: PDF, JPEG, PNG, WebP,
// GIF). Offering HEIC/DOC here only to refuse them after the upload would be
// worse; iOS converts a HEIC photo to JPEG when HEIC is not listed.
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.gif'

// Server refusal codes → the lead flow's own messages.
const ERROR_KEYS = {
  FILE_TOO_LARGE: 'common.fileTooLarge',
  FILE_TYPE_INVALID: 'common.fileTypeInvalid',
}

async function defaultUpload(token, file) {
  const presigned = await presignUpload(token, file.name, file.type)
  if (!presigned.ok || !presigned.data?.success) return { ok: false }

  const stored = await uploadToS3(presigned.data.url, file)
  return stored ? { ok: true, key: presigned.data.key } : { ok: false }
}

// Stored keys end in the original filename made path-safe, after a
// `_<YYYYMMDD>_<HHMMSS>_<6-char random>_` segment — the shape
// Pijb.Storage.DocumentUpload.object_key/2 gives lead and portal uploads alike.
// Anything else (an older key, a name typed in the CRM) is shown as-is.
export function readableName(value) {
  const match = /_\d{8}_\d{6}_[A-Za-z0-9_-]{6}_(.+)$/.exec(String(value || ''))
  return match ? match[1] : value
}

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}

export default function Attachment({ value, onChange, invalid, token, upload }) {
  const { t } = useI18n()
  const [pickedName, setPickedName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handlePick = async (file) => {
    if (!file || uploading) return
    setUploadError('')

    // The registration flow's own pre-check (10 MB, PDF or image) — the server
    // still decides.
    const check = validateUploadFile(file)
    if (!check.ok) {
      setUploadError(t(check.reason === 'size' ? 'common.fileTooLarge' : 'common.fileTypeInvalid'))
      return
    }

    setPickedName(file.name)
    setUploading(true)

    let result
    try {
      result = upload ? await upload(file) : await defaultUpload(token, file)
    } catch {
      result = { ok: false }
    }
    setUploading(false)

    if (!result?.ok || !result.key) {
      setPickedName('')
      setUploadError(t(ERROR_KEYS[result?.code] || 'portal.change.errorUpload'))
      return
    }

    onChange(result.key)
  }

  const displayName = pickedName || readableName(value)
  const invalidOrFailed = invalid || !!uploadError

  const boxCls = [
    'flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed',
    'cursor-pointer transition-colors duration-ds-normal text-center',
    invalidOrFailed
      ? 'border-red-300 bg-red-50'
      : value
        ? 'border-gray-400 bg-gray-50'
        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
  ].join(' ')

  return (
    <div>
      <label className={boxCls}>
        <input
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            handlePick(e.target.files?.[0] ?? null)
            // Picking the same file again after a refusal must fire onChange.
            e.target.value = ''
          }}
        />
        {uploading ? (
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        ) : value ? (
          <>
            <CheckIcon />
            <p className="text-sm font-medium text-gray-700 break-all">{displayName}</p>
            <p className="text-xs text-gray-400">{t('personalInfo.tapToChange')}</p>
          </>
        ) : (
          <>
            <UploadIcon />
            <p className="text-sm font-medium text-gray-700">{t('personalInfo.uploadBtn')}</p>
            <p className="text-xs text-gray-400">{t('personalInfo.uploadHint')}</p>
          </>
        )}
      </label>
      {uploadError && <p className="mt-1.5 text-xs text-red-600">{uploadError}</p>}
    </div>
  )
}
