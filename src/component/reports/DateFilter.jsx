import { Calendar } from 'lucide-react';

/**
 * @param {{ value: string, onChange: (date: string) => void }} props
 */
export function DateFilter({ value, onChange }) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
      <Calendar size={16} className="text-muted" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Report date"
        className="bg-transparent text-sm text-text focus:outline-none"
      />
    </div>
  );
}
