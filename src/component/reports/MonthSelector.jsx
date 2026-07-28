import React from 'react';

function monthOptions(referenceDate = new Date(), count = 5) {
  const opts = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const iso = `${year}-${month}-01`;
    const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    opts.push({ value: iso, label });
  }
  return opts;
}

export function MonthSelector({ value, onChange }) {
  const opts = monthOptions(new Date(), 5);
  return (
    <div className="mb-4">
      <label className="sr-only">Select month</label>
      <div className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-transparent text-sm font-medium outline-none"
        >
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default MonthSelector;
