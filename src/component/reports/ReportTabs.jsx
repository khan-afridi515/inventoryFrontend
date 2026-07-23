import { REPORT_TABS } from '../../constants/reports.constants';

/**
 * @param {{ activePeriod: string, onChange: (period: string) => void }} props
 */
export function ReportTabs({ activePeriod, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Report period"
      className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1 sm:inline-flex sm:w-auto"
    >
      {REPORT_TABS.map((tab) => {
        const isActive = tab.id === activePeriod;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              isActive
                ? 'bg-primary-light text-primary'
                : 'text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
