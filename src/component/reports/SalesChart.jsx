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
import { formatCurrency } from '../../shared/utils/formatCurrency';

/**
 * @param {{ data: Array<{ day: string, amount: number }> }} props
 */
function CustomTick({ x, y, payload, multiline }) {
  const label = String(payload.value || '');
  let lines = [label];
  if (multiline) {
    // split on en-dash or hyphen ranges like "Jun 15 - Jun 21" or "Jun 15–21"
    if (label.includes(' - ')) lines = label.split(' - ');
    else if (label.includes('–')) lines = label.split('–');
    else if (label.length > 12) {
      // fallback: split roughly in half
      const mid = Math.floor(label.length / 2);
      const idx = label.indexOf(' ', mid) || mid;
      lines = [label.slice(0, idx).trim(), label.slice(idx).trim()];
    }
  }

  return (
    <g transform={`translate(${x}, ${y + 10})`}>
      {lines.map((line, i) => (
        <text key={i} x={0} y={i * 12} textAnchor="middle" fontSize={12} fill="#8A93A3">
          <tspan x={0}>{line}</tspan>
        </text>
      ))}
    </g>
  );
}

export function SalesChart({ data, period }) {
  const multiline = period === 'weekly' || period === 'monthly';
  return (
    <Panel title="Sales Chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: multiline ? 40 : 10 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={<CustomTick multiline={multiline} />}
          />
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
