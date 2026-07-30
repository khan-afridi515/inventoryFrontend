import { useCallback, useEffect, useState } from 'react';
import { salesService } from '../data/salesService';

/**
 * Loads every sale line item once. Search/sort/filter stay client-side
 * in the Sales page itself (same as before) — this hook's only job is
 * getting the raw rows in, with proper loading/error states.
 */
export function useSalesData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await salesService.getSalesLineItems();
      setData(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
