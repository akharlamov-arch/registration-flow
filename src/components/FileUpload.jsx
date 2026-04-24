import { useRef, useState } from 'react'
import { useI18n } from '../context/I18nContext'

/**
 * FileUpload — drag-and-drop + click-to-upload widget
 *
 * Props:
 *   id       — unique id for the hidden input
 *   accept   — file accept string (e.g. ".pdf,.jpg")
 *   multiple — allow multiple files
 *   onChange — callback(files: FileList)
 */
export default function FileUpload({ id, accept, multiple = false, onChange }) {
  const { t } = useI18n()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleFiles = (files) => {
    if (!files?.length) return
    setFileName(
      files.length === 1
        ? files[0].name
        : `${files.length} ${t('common.fileSelected').toLowerCase()}`
    )
    onChange?.(files)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl
        cursor-pointer transition-colors duration-200
        ${dragging
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:border-primary/50 bg-gray-50 hover:bg-primary/5'
        }
      `}
      role="button"
      tabIndex={0}
      aria-label={t('common.uploadBtn')}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      {/* Upload icon */}
      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12
             3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>

      <div className="text-center">
        <span className="text-sm font-medium text-primary">{t('common.uploadBtn')}</span>
        <span className="text-sm text-slate-400"> {t('common.uploadDrag')}</span>
      </div>

      {fileName ? (
        <p className="text-xs text-slate-600 font-medium">{fileName}</p>
      ) : (
        <p className="text-xs text-slate-400">{t('common.noFile')}</p>
      )}

      {/* Hidden native input */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        tabIndex={-1}
      />
    </div>
  )
}
