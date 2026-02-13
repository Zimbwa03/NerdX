import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Video } from 'lucide-react';

interface FileUploaderProps {
  accept: string;
  label: string;
  hint?: string;
  maxSizeMB?: number;
  onFile: (file: File | null) => void;
  currentFile?: File | null;
  previewUrl?: string | null;
}

export function FileUploader({
  accept,
  label,
  hint,
  maxSizeMB = 10,
  onFile,
  currentFile,
  previewUrl,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes('image');
  const isVideo = accept.includes('video');

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null);
      if (!file) {
        onFile(null);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum ${maxSizeMB}MB.`);
        return;
      }
      onFile(file);
    },
    [maxSizeMB, onFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      handleFile(file);
    },
    [handleFile],
  );

  const preview = currentFile
    ? URL.createObjectURL(currentFile)
    : previewUrl;

  const Icon = isVideo ? Video : isImage ? Image : FileText;

  return (
    <div className="file-uploader">
      <label className="file-uploader__label">{label}</label>

      {!currentFile && !previewUrl ? (
        <div
          className={`file-uploader__dropzone${dragOver ? ' file-uploader__dropzone--active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <Upload size={28} className="file-uploader__icon" />
          <span className="file-uploader__text">
            Drag & drop or <strong>click to browse</strong>
          </span>
          {hint && <span className="file-uploader__hint">{hint}</span>}
        </div>
      ) : (
        <div className="file-uploader__preview">
          {isImage && preview && (
            <img src={preview} alt="Preview" className="file-uploader__preview-img" />
          )}
          {isVideo && preview && (
            <video src={preview} className="file-uploader__preview-video" controls />
          )}
          {!isImage && !isVideo && (
            <div className="file-uploader__preview-file">
              <Icon size={24} />
              <span>{currentFile?.name || 'Uploaded file'}</span>
            </div>
          )}
          <button
            type="button"
            className="file-uploader__remove"
            onClick={() => {
              onFile(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="file-uploader__input"
        hidden
      />

      {error && <span className="file-uploader__error">{error}</span>}
    </div>
  );
}
