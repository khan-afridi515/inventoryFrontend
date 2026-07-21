import { useEffect } from 'react';
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

// Removed internal padding here so it inherits perfectly from the parent wrapper
function DashboardSkeleton() {
  return (
    <div className="text-[#64748B] font-outfit">
      Loading dashboard…
    </div>
  );
}

// Removed internal padding here so it inherits perfectly from the parent wrapper
function DashboardError({ message, onRetry }) {
  return (
    <div className="font-outfit">
      <p className="font-semibold text-[#EF4444]">
        Couldn't load the dashboard: {message}
      </p>
      <button 
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-[#3B82F6] text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition"
      >
        Retry
      </button>
    </div>
  );
}

function Dashboard({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('dashboard');
  }, [setActiveTab]);

  const { data, loading, error, refetch } = useDashboardData();

  // Return a single wrapper to ensure layout alignment is always preserved
  return (
    <div className="dashboard-page-container font-outfit px-6 lg:px-8 py-5 -ml-5 -mt-5">
      
      {/* Show Skeleton if Loading */}
      {loading && <DashboardSkeleton />}
      
      {/* Show Error if there's an issue */}
      {error && !loading && <DashboardError message={error} onRetry={refetch} />}

      {/* Show Dashboard when data is successfully loaded */}
      {!loading && !error && data && (
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
      )}
      
    </div>
  );
}

export default Dashboard;