import { useDashboardData } from '../../hooks/useDashboardData';
import { config } from '../../config/env';
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

  const handleConnectEbay = () => {
    const { clientId, redirectUri } = config;
    const scope = [
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
    ].join(' ');

    const state = crypto.randomUUID();
    sessionStorage.setItem("ebay_state", state);

    const url =
      `https://auth.sandbox.ebay.com/oauth2/authorize` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;

    window.location.assign(url);
  };

  return (

    <div>
      <button
        onClick={handleConnectEbay}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#e53238",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600"
        }}


      >
        Connect eBay
      </button>

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
    </div>
  );
}

export default Dashboard;