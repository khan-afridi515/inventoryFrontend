import { useDashboardData } from '../../hooks/useDashboardData';
import { DashboardHeader } from '../../component/dashboard/layout/DashboardHeader';
import { DashboardLayout } from '../../component/dashboard/layout/DashboardLayout';
import { KpiGrid } from '../../component/dashboard/kpi/KpiGrid';
import { DailySalesTrend } from '../../component/dashboard/charts/DailySalesTrend';
import { TopSellingProducts } from '../../component/dashboard/charts/TopSellingProducts';
import { WeeklyRevenueBar } from '../../component/dashboard/charts/WeeklyRevenueBar';
import { MonthlyRevenueLine } from '../../component/dashboard/charts/MonthlyRevenueLine';
import { RecentActivityFeed } from '../../component/dashboard/activity/RecentActivityFeed';

function DashboardSkeleton() {
  return <div className="p-6 text-muted">Loading dashboard…</div>;
}

function DashboardError({ message, onRetry }) {
  return (
    <div className="p-6">
      <p className="font-semibold text-negative">Couldn't load the dashboard: {message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

function Dashboard() {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error} onRetry={refetch} />;

  return (
    <DashboardLayout
      header={<DashboardHeader userName={data.user?.name ?? ''} />}
      kpis={<KpiGrid kpis={data.kpis} />}
      charts={
        <>
          <DailySalesTrend data={data.dailySalesTrend} />
          <TopSellingProducts data={data.topSellingProducts} />
        </>
      }
      secondary={
        <>
          <WeeklyRevenueBar data={data.weeklyRevenue} />
          <MonthlyRevenueLine data={data.monthlyRevenue} />
          <RecentActivityFeed activity={data.recentActivity} />
        </>
      }
    />
  );
}

export default Dashboard;