import { useEffect, useMemo } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ebayAuth } from '../../context/ebayContext';
import { useAuth } from '../../context/authContext';
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
    <div className="text-muted font-outfit">
      Loading dashboard…
    </div>
  );
}

// Removed internal padding here so it inherits perfectly from the parent wrapper
function DashboardError({ message, onRetry }) {
  return (
    <div className="font-outfit">
      <p className="font-semibold text-negative">
        Couldn't load the dashboard: {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition"
      >
        Retry
      </button>
    </div>
  );
}

function Dashboard({ setActiveTab }) {
  const { user } = useAuth();

  const { ebayData, getEbayOrders } = ebayAuth();

  useEffect(() => {
    if (setActiveTab) setActiveTab('dashboard');
  }, [setActiveTab]);

  useEffect(() => {
    getEbayOrders();
  }, []);

  const enrichedEbayData = useMemo(() => {
    if (!ebayData) return null;
    return ebayData.map(item => {
      const totalCost = Number(item.qtySold || 0) * Number(item.unitPurchase || 0);
      const totalRevenue = Number(item.qtySold || 0) * Number(item.unitSelling || 0);
      const profitLoss = totalRevenue - totalCost;
      // Extract standard YYYY-MM-DD date if present, otherwise default to today (or handle accordingly)
      let standardDate = item.date;
      if (standardDate && standardDate.includes('T')) {
         standardDate = standardDate.split('T')[0];
      } else if (!standardDate) {
         // Fallback to today's date if no date is provided by API so it appears in 'Sold Today'
         standardDate = new Date().toISOString().split('T')[0];
      }
      return { ...item, totalCost, totalRevenue, profitLoss, date: standardDate };
    });
  }, [ebayData]);

  const { data, loading, error, refetch } = useDashboardData(enrichedEbayData);

  const handleEbay = () => {
    const { clientId, ruName } = config;


    //check both scopes for production
    const scopes = [
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
    ];

    const scope = scopes.join(' ');
    const state = crypto.randomUUID();

    // handleEbay
    localStorage.setItem('ebay_state', state);

    // changing https url, client id, redirect(ruName), check state
    const url =
      `https://auth.sandbox.ebay.com/oauth2/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(ruName)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;

    window.location.href = url;

  }


  // Return a single wrapper to ensure layout alignment is always preserved
  return (
    <div className="dashboard-page-container font-outfit px-6 lg:px-8 py-5 -ml-5 -mt-5">
      <button className='px-4 py-2 bg-red-500 text-white text-sm rounded-md ml-4 font-bold' onClick={handleEbay}>Connect Ebay</button>

      {/* Show Skeleton if Loading */}
      {loading && <DashboardSkeleton />}

      {/* Show Error if there's an issue */}
      {error && !loading && <DashboardError message={error} onRetry={refetch} />}

      {/* Show Dashboard when data is successfully loaded */}
      {!loading && !error && data && (
        <DashboardLayout
          header={<DashboardHeader userName={user?.name ?? data.user?.name ?? ''} />}
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