import { Panel } from '../../component/addProduct/common/Panel';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { sanitizeText } from '../../utils/sanitize';

/**
 * @param {{ table: { date: string, rows: Array<object>, overallProfitLoss: number } }} props
 */
export function SalesTable({ table }) {
  return (
    <Panel title={`Sales for ${table.date}`}>
      {/* Horizontal scroll on narrow screens so the 4 columns never
          get crushed or wrap awkwardly on mobile. */}
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold text-muted">
              <th className="py-2 pr-4 font-semibold">Product</th>
              <th className="py-2 pr-4 text-right font-semibold">Qty</th>
              <th className="py-2 pr-4 text-right font-semibold">Revenue</th>
              <th className="py-2 pl-4 text-right font-semibold">Profit</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr
                key={row.id}
                className={i % 2 === 1 ? 'bg-bg/60' : ''}
              >
                <td className="py-2.5 pr-4 font-medium text-text">{sanitizeText(row.product)}</td>
                <td className="py-2.5 pr-4 text-right text-text">{formatNumber(row.qty)}</td>
                <td className="py-2.5 pr-4 text-right text-text">{formatCurrency(row.revenue)}</td>
                <td className="py-2.5 pl-4 text-right font-semibold text-positive">
                  {formatCurrency(row.profit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 -mx-4 -mb-4 flex flex-col gap-1 rounded-b-md bg-primary-light px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-semibold text-text">Overall Daily Profit / Loss</span>
        <span className="text-xl font-bold text-positive">
          {formatCurrency(table.overallProfitLoss)}
        </span>
      </div>
    </Panel>
  );
}
