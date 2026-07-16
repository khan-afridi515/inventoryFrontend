/**
 * Generic labeled text/number input. Kept form-agnostic (no product
 * knowledge) so it's reusable across any form in the app, not just
 * Add Product.
 *
 * @param {{
 *   id: string,
 *   label: string,
 *   value: string,
 *   onChange: (value: string) => void,
 *   type?: string,
 *   placeholder?: string,
 *   required?: boolean,
 *   error?: string,
 *   prefix?: string,
 * }} props
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  prefix,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-negative"> *</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-md border bg-surface px-3 py-2 text-sm text-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            prefix ? 'pl-7' : ''
          } ${error ? 'border-negative' : 'border-border'}`}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
