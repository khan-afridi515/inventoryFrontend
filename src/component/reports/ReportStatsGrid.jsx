import { ReportStatCard } from './ReportStatCard';

/**
 * @param {{ summary: object }} props
 */
export function ReportStatsGrid({ summary }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ReportStatCard label="Total Products Sold" value={summary.totalProductsSold} type="count" />
      <ReportStatCard label="Purchase Value" value={summary.purchaseValue} />
      <ReportStatCard label="Selling Value" value={summary.sellingValue} />
      <ReportStatCard label="Profit" value={summary.profit} tone="positive" />
      <ReportStatCard label="Loss" value={summary.loss} tone="negative" />
      <ReportStatCard label="Net Revenue" value={summary.netRevenue} />
    </div>
  );
}
