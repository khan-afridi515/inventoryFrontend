import { ChevronDown } from 'lucide-react';

/**
 * @param {{
 *   id: string,
 *   label: string,
 *   value: string,
 *   onChange: (value: string) => void,
 *   options: Array<{ value: string, label: string }>,
 *   required?: boolean,
 *   error?: string,
 * }} props
 */
export function SelectField({ id, label, value, onChange, options, required = false, error }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-negative"> *</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full appearance-none rounded-md border bg-surface px-3 py-2 pr-9 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            error ? 'border-negative' : 'border-border'
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute inset-y-0 right-3 my-auto text-muted"
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
