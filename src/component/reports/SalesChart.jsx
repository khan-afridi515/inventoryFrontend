import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Panel } from '../../component/addProduct/common/Panel';
import { CHART_COLORS } from '../../constants/dashboard.constants';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * @param {{ data: Array<{ day: string, amount: number }> }} props
 */
export function SalesChart({ data }) {
  return (
    <Panel title="Sales Chart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#8A93A3' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Bar dataKey="amount" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}
