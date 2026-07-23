import { formatCurrency, formatNumber } from '../../utils/formatCurrency';

const TONE_CLASSES = {
  positive: 'text-positive',
  negative: 'text-negative',
  neutral: 'text-text',
};

/**
 * @param {{
 *   label: string,
 *   value: number,
 *   type?: 'count' | 'currency',
 *   tone?: 'positive' | 'negative' | 'neutral',
 * }} props
 */
export function ReportStatCard({ label, value, type = 'currency', tone = 'neutral' }) {
  const displayValue = type === 'currency' ? formatCurrency(value) : formatNumber(value);

  return (
    <div className="min-w-0 rounded-md border border-border bg-surface p-4">
      <p className="m-0 mb-1.5 text-[13px] text-muted">{label}</p>
      <p className={`m-0 text-xl font-bold ${TONE_CLASSES[tone]}`}>{displayValue}</p>
    </div>
  );
}
