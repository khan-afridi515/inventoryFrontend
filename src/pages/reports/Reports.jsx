import { useState } from 'react';
import { TopBar } from '../../component/reports/layout/TopBar';
import { ReportsHeader } from '../../component/reports/ReportsHeader';
import { ReportTabs } from '../../component/reports/ReportTabs';
import { ReportStatsGrid } from '../../component/reports/ReportStatsGrid';
import { DateFilter } from '../../component/reports/DateFilter';
import { SalesChart } from '../../component/reports/SalesChart';
import { ProfitChart } from '../../component/reports/ProfitChart';
import { SalesTable } from '../../component/reports/SalesTable';
import { useReportsData } from '../../hooks/useReportsData';
import { REPORT_PERIODS } from '../../constants/reports.constants';

function ReportsSkeleton() {
  return <div className="p-6 text-muted">Loading report…</div>;
}

function ReportsError({ message, onRetry }) {
  return (
    <div className="p-6">
      <p className="font-semibold text-negative">Couldn't load the report: {message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

/**
 * Handles Print/Export actions. Placeholder for now — swap for real
 * PDF/Excel generation or window.print() once that's wired up.
 */
function handleReportAction(actionId) {
  if (actionId === 'print') {
    window.print();
    return;
  }
  // eslint-disable-next-line no-console
  console.log('Report action:', actionId);
}

function Reports() {
  const [period, setPeriod] = useState(REPORT_PERIODS.DAILY);
  const [date, setDate] = useState('2026-07-15');
  const { data, loading, error, refetch } = useReportsData(period, date);

  return (
    <div>

      <div className="mx-auto max-w-6xl p-6">
        <ReportsHeader onAction={handleReportAction} />
        <ReportTabs activePeriod={period} onChange={setPeriod} />

        {loading && <ReportsSkeleton />}
        {error && <ReportsError message={error} onRetry={refetch} />}

        {!loading && !error && (
          <>
            <ReportStatsGrid summary={data.summary} />
            <DateFilter value={date} onChange={setDate} />

            <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SalesChart data={data.salesChart} />
              <ProfitChart data={data.profitChart} />
            </div>

            <SalesTable table={data.salesTable} />
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
