import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Panel } from '../common/Panel';
import { CHART_COLORS } from '../../../constants/dashboard.constants';
import { formatCurrency } from '../../../utils/formatCurrency';

/**
 * @param {{ data: Array<{ week: string, revenue: number }> }} props
 */
export function WeeklyRevenueBar({ data }) {
  return (
    <Panel title="Weekly Revenue">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#8A93A3' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Bar dataKey="revenue" fill={CHART_COLORS.bar} radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}
