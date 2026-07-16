import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Panel } from '../common/Panel';
import { CHART_COLORS } from '../../../constants/dashboard.constants';

/**
 * @param {{ data: Array<{ day: string, units: number }> }} props
 */
export function DailySalesTrend({ data }) {
  return (
    <Panel title="Daily Sales Trend">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="units"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            fill="url(#salesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}
