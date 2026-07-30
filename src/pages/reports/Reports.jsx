import { useState } from 'react';
import { TopBar } from '../../component/reports/layout/TopBar';
import { ReportsHeader } from '../../component/reports/ReportsHeader';
import { ReportTabs } from '../../component/reports/ReportTabs';
import { ReportStatsGrid } from '../../component/reports/ReportStatsGrid';
import { DateFilter } from '../../component/reports/DateFilter';
import MonthSelector from '../../component/reports/MonthSelector';
import { SalesChart } from '../../component/reports/SalesChart';
import { ProfitChart } from '../../component/reports/ProfitChart';
import { SalesTable } from '../../component/reports/SalesTable';
import { useReportsData } from '../../hooks/useReportsData';
import { REPORT_PERIODS } from '../../constants/reports.constants';
import { ebayAuth } from '../../context/ebayContext';
import { buildReportData } from '../../data/reportsService';
import { useEffect, useMemo } from 'react';

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
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const { ebayData, getEbayOrders } = ebayAuth();
  
  useEffect(() => {
    getEbayOrders();
  }, []);

  const { data: apiData, loading: apiLoading, error: apiError, refetch } = useReportsData(period, date);

  const enrichedEbayData = useMemo(() => {
    if (!ebayData) return null;
    return ebayData.map(item => {
      const totalCost = Number(item.qtySold || 0) * Number(item.unitPurchase || 0);
      const totalRevenue = Number(item.qtySold || 0) * Number(item.unitSelling || 0);
      const profitLoss = totalRevenue - totalCost;
      return { ...item, totalCost, totalRevenue, profitLoss };
    });
  }, [ebayData]);

  const data = useMemo(() => {
    if (enrichedEbayData && enrichedEbayData.length > 0) {
      return buildReportData(period, date, enrichedEbayData);
    }
    return apiData;
  }, [period, date, enrichedEbayData, apiData]);

  const loading = (!enrichedEbayData && apiLoading) || (!apiData && !enrichedEbayData);
  const error = !enrichedEbayData ? apiError : null;

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
            {period === REPORT_PERIODS.MONTHLY ? (
              <MonthSelector value={date} onChange={setDate} />
            ) : (
              <DateFilter value={date} onChange={setDate} />
            )}

            <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SalesChart data={data.salesChart} period={period} />
              <ProfitChart data={data.profitChart} period={period} />
            </div>

            <SalesTable table={data.salesTable} period={period} />
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
