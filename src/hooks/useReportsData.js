import { useCallback, useEffect, useState } from 'react';
import { reportsService } from '../data/reportsService';

const initialState = {
  summary: null,
  salesChart: [],
  profitChart: [],
  salesTable: null,
};

/**
 * Loads every dataset the Reports page needs for a given period/date,
 * re-fetching whenever either changes.
 * @param {'daily'|'weekly'|'monthly'} period
 * @param {string} date ISO date string
 */
export function useReportsData(period, date) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summary, salesChart, profitChart, salesTable] = await Promise.all([
        reportsService.getSummary(period, date),
        reportsService.getSalesChart(period, date),
        reportsService.getProfitChart(period, date),
        reportsService.getSalesTable(period, date),
      ]);
      setData({ summary, salesChart, profitChart, salesTable });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [period, date]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}
