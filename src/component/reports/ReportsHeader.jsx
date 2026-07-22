import { Printer, FileText, FileSpreadsheet } from 'lucide-react';

const ACTIONS = [
  { id: 'print', label: 'Print', icon: Printer },
  { id: 'export-pdf', label: 'Export PDF', icon: FileText },
  { id: 'export-excel', label: 'Export Excel', icon: FileSpreadsheet },
];

/**
 * @param {{ onAction: (actionId: string) => void }} props
 */
export function ReportsHeader({ onAction }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="m-0 mb-1 text-2xl font-bold text-text">Reports</h1>
        <p className="m-0 text-sm text-muted">
          Track performance across daily, weekly, and monthly cycles.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onAction?.(id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-text hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
