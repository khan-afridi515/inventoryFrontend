import { useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { Panel } from '../common/Panel';

/**
 * @param {{
 *   imagePreviewUrl: string | null,
 *   error: string | null,
 *   onImageChange: (file: File) => void,
 * }} props
 */
export function ProductImagePanel({ imagePreviewUrl, error, onImageChange }) {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) onImageChange(file);
    // Allow re-selecting the same file later (e.g. after Reset).
    e.target.value = '';
  };

  return (
    <Panel title="Product Image">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-bg">
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Product preview" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={22} className="text-slate-300" strokeWidth={1.5} />
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-text hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <Upload size={14} />
            Upload Image
          </button>
          <p className="mt-1.5 text-xs text-muted">PNG or JPG, up to 5MB</p>
          {error && <p className="mt-1 text-xs text-negative">{error}</p>}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload product image"
          />
        </div>
      </div>
    </Panel>
  );
}
