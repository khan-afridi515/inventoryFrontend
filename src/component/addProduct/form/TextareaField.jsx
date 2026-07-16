/**
 * @param {{
 *   id: string,
 *   label: string,
 *   value: string,
 *   onChange: (value: string) => void,
 *   placeholder?: string,
 *   rows?: number,
 *   error?: string,
 * }} props
 */
export function TextareaField({ id, label, value, onChange, placeholder, rows = 4, error }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full resize-y rounded-md border bg-surface px-3 py-2 text-sm text-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          error ? 'border-negative' : 'border-border'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
