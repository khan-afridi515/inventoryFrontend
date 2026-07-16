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

/**
 * @param {{ data: Array<{ id: string, name: string, unitsSold: number }> }} props
 */
export function TopSellingProducts({ data }) {
  return (
    <Panel title="Top Selling Products">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 12, fill: '#3B4252' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Bar dataKey="unitsSold" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}
