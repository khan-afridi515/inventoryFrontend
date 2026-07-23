import {
  LineChart,
  Line,
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
export function ProfitChart({ data }) {
  return (
    <Panel title="Profit Chart">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#8A93A3' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={CHART_COLORS.positive}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.positive }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );
}
