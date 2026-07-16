import {
  Grid2x2,
  ClipboardList,
  TrendingUp,
  BarChart2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import { useKpiTrend } from '../../../hooks/useKpiTrend';

const ICONS = {
  grid: Grid2x2,
  clipboard: ClipboardList,
  'trending-up': TrendingUp,
  'bar-chart': BarChart2,
  'alert-triangle': AlertTriangle,
  clock: Clock,
};

// Tone → Tailwind text-color class. Kept as a lookup object (not inline
// ternaries in JSX) so adding a new tone later is a one-line change.
const TREND_TONE_CLASSES = {
  positive: 'text-positive',
  negative: 'text-negative',
  neutral: 'text-muted',
};

const STATUS_TONE_CLASSES = {
  warning: 'text-warning',
  negative: 'text-negative',
};

/**
 * @param {{
 *   label: string,
 *   value: number,
 *   type: 'count' | 'currency',
 *   icon: keyof typeof ICONS,
 *   trend?: { value: number, direction: 'up'|'down', label: string },
 *   status?: { label: string, tone: 'warning' | 'negative' }
 * }} props
 */
export function KpiCard({ label, value, type, icon, trend, status }) {
  const Icon = ICONS[icon] ?? Grid2x2;
  const trendInfo = useKpiTrend(trend);
  const displayValue = type === 'currency' ? formatCurrency(value) : formatNumber(value);

  return (
    <div className="min-w-0 rounded-md border border-border bg-surface p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="truncate text-[13px] font-medium text-muted">{label}</span>
        <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-sm bg-primary-light text-primary">
          <Icon size={16} strokeWidth={2} />
        </span>
      </div>

      <div className="text-[22px] leading-tight font-bold text-text">{displayValue}</div>

      {trendInfo && (
        <div className={`mt-1.5 text-xs font-semibold ${TREND_TONE_CLASSES[trendInfo.tone]}`}>
          <span aria-hidden="true">{trendInfo.arrow}</span> {trendInfo.text}
        </div>
      )}

      {status && (
        <div className={`mt-1.5 text-xs font-semibold ${STATUS_TONE_CLASSES[status.tone]}`}>
          {status.label}
        </div>
      )}
    </div>
  );
}
