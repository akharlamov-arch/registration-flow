// File attachment control, replicating the one the registration flow uses for
// the driver licence and the void check (src/pages/OtpVerification.jsx:1665-1710
// and 2551-2612): a dashed drop panel that turns into a green-ticked filename
// with "Click to change file" once something is attached.
//
// Unlike the portal-demo original this was copied from — which just reported
// the picked file's name and never actually uploaded anything — this one
// really uploads: the same two-step presignUpload + uploadToS3 flow
// src/pages/PortalPage.jsx's own change-request file picker already uses
// (src/api/portal.js). The value the field carries once uploaded is the S3
// key (`driver_license_file_name` in the real contract payload), while the
// picked file's own name is what stays on screen — nobody wants to proof-read
// an opaque key.
//
// Note this is NOT components/FileUpload.jsx — that widget belongs to the old
// PortalPage and is used nowhere in the registration flow.

import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { presignUpload, uploadToS3 } from '../../api/portal'

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.heic,.doc,.docx'

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

export default function Attachment({ value, onChange, invalid, token }) {
  const { t } = useI18n()
  const [pickedName, setPickedName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handlePick = async (file) => {
    if (!file || uploading) return
    setPickedName(file.name)
    setUploadError('')
    setUploading(true)

    const presigned = await presignUpload(token, file.name, file.type)
    if (!presigned.ok || !presigned.data?.success) {
      setUploading(false)
      setUploadError(t('portal.change.errorUpload'))
      return
    }

    const stored = await uploadToS3(presigned.data.url, file)
    setUploading(false)

    if (!stored) {
      setUploadError(t('portal.change.errorUpload'))
      return
    }

    onChange(presigned.data.key)
  }

  const displayName = pickedName || value
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
          onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
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
