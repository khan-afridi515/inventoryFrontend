import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Panel } from '../../addProduct/common/Panel';
import { CHART_COLORS } from '../../../constants/dashboard.constants';
import { formatCurrency } from '../../../utils/formatCurrency';

/**
 * @param {{ data: Array<{ month: string, revenue: number }> }} props
 */
export function MonthlyRevenueLine({ data }) {
  return (
    <Panel title="Monthly Revenue">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#8A93A3' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.primary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );
}
