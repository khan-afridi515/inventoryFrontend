import { useEffect, useState, useCallback } from 'react';
import { dashboardService } from '../data/dashboardService';

const initialState = {
  user: null,
  kpis: [],
  dailySalesTrend: [],
  topSellingProducts: [],
  weeklyRevenue: [],
  monthlyRevenue: [],
  recentActivity: [],
};

/**
 * Loads every dataset the dashboard needs in parallel and exposes a
 * single { data, loading, error, refetch } shape. Building this now
 * (even against static mock data) means the loading/error UI is
 * already correct on day one of a real backend existing.
 */
export function useDashboardData() {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        user,
        kpis,
        dailySalesTrend,
        topSellingProducts,
        weeklyRevenue,
        monthlyRevenue,
        recentActivity,
      ] = await Promise.all([
        dashboardService.getUser(),
        dashboardService.getKpis(),
        dashboardService.getDailySalesTrend(),
        dashboardService.getTopSellingProducts(),
        dashboardService.getWeeklyRevenue(),
        dashboardService.getMonthlyRevenue(),
        dashboardService.getRecentActivity(),
      ]);
      setData({
        user,
        kpis,
        dailySalesTrend,
        topSellingProducts,
        weeklyRevenue,
        monthlyRevenue,
        recentActivity,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}
