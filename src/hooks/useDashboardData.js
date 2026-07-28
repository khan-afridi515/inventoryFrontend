import { useEffect, useState, useCallback } from 'react';
import { dashboardService } from '../data/dashboardService';
import { getProducts } from '../services/productServices';
import { dummyData } from '../data/dummyData';

const initialState = {
  user: null,
  kpis: [],
  dailySalesTrend: [],
  topSellingProducts: [],
  weeklyRevenue: [],
  monthlyRevenue: [],
  recentActivity: [],
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Returns 'YYYY-MM-DD' for any Date object in local time */
function toLocalISODate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Short weekday label e.g. 'Mon', 'Tue' */
function weekdayLabel(isoDate) {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

/** Short month label e.g. 'Jan', 'Feb' */
function monthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short' });
}

/** Short date range label e.g. 'Jul 21-27' */
function weekRangeLabel(startISO, endISO) {
  const fmt = (iso) =>
    new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(startISO)}-${fmt(endISO).split(' ')[1]}`;
}

// ─── Chart data builders (all from sale records) ──────────────────────────────

/**
 * Daily Sales Trend — last 7 days ending today.
 * Shape: Array<{ day: string, units: number }>
 */
function buildDailySalesTrend(salesRecords) {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(toLocalISODate(d));
  }

  const grouped = salesRecords.reduce((acc, r) => {
    acc[r.date] = (acc[r.date] || 0) + (r.qtySold ?? 0);
    return acc;
  }, {});

  return days.map((iso) => ({
    day: weekdayLabel(iso),
    units: grouped[iso] || 0,
  }));
}

/**
 * Top Selling Products — top 5 products by total qtySold across all time.
 * Shape: Array<{ id: string, name: string, unitsSold: number }>
 */
function buildTopSellingProducts(salesRecords) {
  const totals = salesRecords.reduce((acc, r) => {
    const key = r.product ?? 'Unknown';
    acc[key] = (acc[key] || 0) + (r.qtySold ?? 0);
    return acc;
  }, {});

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, unitsSold]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      unitsSold,
    }));
}

/**
 * Weekly Revenue — last 5 complete weeks ending today.
 * Shape: Array<{ week: string, revenue: number }>
 */
function buildWeeklyRevenue(salesRecords) {
  const today = new Date();
  const weeks = [];

  for (let i = 4; i >= 0; i--) {
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const startISO = toLocalISODate(weekStart);
    const endISO = toLocalISODate(weekEnd);

    const revenue = salesRecords.reduce((acc, r) => {
      if (r.date >= startISO && r.date <= endISO) acc += r.totalRevenue ?? 0;
      return acc;
    }, 0);

    weeks.push({ week: weekRangeLabel(startISO, endISO), revenue });
  }

  return weeks;
}

/**
 * Monthly Revenue — last 6 months ending the current month.
 * Shape: Array<{ month: string, revenue: number }>
 */
function buildMonthlyRevenue(salesRecords) {
  const today = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const m = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const startISO = toLocalISODate(new Date(m.getFullYear(), m.getMonth(), 1));
    const endISO = toLocalISODate(new Date(m.getFullYear(), m.getMonth() + 1, 0));

    const revenue = salesRecords.reduce((acc, r) => {
      if (r.date >= startISO && r.date <= endISO) acc += r.totalRevenue ?? 0;
      return acc;
    }, 0);

    months.push({ month: monthLabel(m.getFullYear(), m.getMonth()), revenue });
  }

  return months;
}

/**
 * Recent Activity — last 10 sale records sorted newest-first.
 * Shape: Array<{ id: string, text: string, timestamp: string, amount: number }>
 */
function buildRecentActivity(salesRecords) {
  return [...salesRecords]
    .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0))
    .slice(0, 10)
    .map((r, idx) => ({
      id: `act-${idx}-${r.product}`,
      text: `${r.qtySold}× ${r.product} sold`,
      timestamp: `${r.date}T00:00:00Z`,
      amount: r.totalRevenue ?? 0,
    }));
}

// ─── Sales-based KPI helpers ──────────────────────────────────────────────────

function buildSaleKpis(salesRecords) {
  const today = toLocalISODate(new Date());

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekAgoStr = toLocalISODate(weekAgo);

  const now = new Date();
  const monthStart = toLocalISODate(new Date(now.getFullYear(), now.getMonth(), 1));

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalISODate(yesterday);

  const todayRecords = salesRecords.filter((r) => r.date === today);
  const yesterdayRecords = salesRecords.filter((r) => r.date === yesterdayStr);
  const weekRecords = salesRecords.filter((r) => r.date >= weekAgoStr && r.date <= today);
  const monthRecords = salesRecords.filter((r) => r.date >= monthStart && r.date <= today);

  const sum = (arr, key) => arr.reduce((acc, r) => acc + (r[key] ?? 0), 0);

  const soldToday = sum(todayRecords, 'qtySold');
  const soldYesterday = sum(yesterdayRecords, 'qtySold');
  const revenueToday = sum(todayRecords, 'totalRevenue');
  const revenueYesterday = sum(yesterdayRecords, 'totalRevenue');
  const profitToday = sum(todayRecords, 'profitLoss');
  const profitYesterday = sum(yesterdayRecords, 'profitLoss');
  const weeklyProfit = sum(weekRecords, 'profitLoss');
  const monthlyProfit = sum(monthRecords, 'profitLoss');

  const pctChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.abs(((current - previous) / previous) * 100);
  };
  const direction = (current, previous) => (current >= previous ? 'up' : 'down');

  return {
    soldToday, revenueToday, profitToday,
    weeklyProfit, monthlyProfit,
    pctSoldToday: pctChange(soldToday, soldYesterday),
    dirSoldToday: direction(soldToday, soldYesterday),
    pctRevenueToday: pctChange(revenueToday, revenueYesterday),
    dirRevenueToday: direction(revenueToday, revenueYesterday),
    pctProfitToday: pctChange(profitToday, profitYesterday),
    dirProfitToday: direction(profitToday, profitYesterday),
  };
}

// ─── Product-based KPI helpers ────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 20;
const UNSOLD_DAYS = 14;

function buildProductKpis(apiProducts, salesRecords) {
  const totalProducts = apiProducts.length;
  // Support both `qty` and `quantity` field names from the backend
  const totalStock = apiProducts.reduce((acc, p) => acc + (Number(p.qty ?? p.quantity) || 0), 0);

  const lowStock = apiProducts.filter((p) => {
    const qty = Number(p.qty ?? p.quantity) || 0;
    return qty > 0 && qty <= LOW_STOCK_THRESHOLD;
  }).length;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - UNSOLD_DAYS);
  const cutoffStr = toLocalISODate(cutoff);

  const soldProductNames = new Set(
    salesRecords
      .filter((r) => r.date >= cutoffStr)
      .map((r) => (r.product ?? '').toLowerCase())
  );

  const unsold = apiProducts.filter((p) => {
    const name = (p.productName ?? '').toLowerCase();
    return !soldProductNames.has(name);
  }).length;

  return { totalProducts, totalStock, lowStock, unsold };
}

// ─── KPI array builder ────────────────────────────────────────────────────────

function buildKpiArray(productKpis, saleKpis) {
  return [
    { id: 'total-products', label: 'Total Products', value: productKpis.totalProducts, icon: 'grid', type: 'count' },
    { id: 'total-stock', label: 'Total Stock', value: productKpis.totalStock, icon: 'grid', type: 'count' },
    {
      id: 'sold-today', label: 'Sold Today', value: saleKpis.soldToday, icon: 'clipboard', type: 'count',
      trend: { value: saleKpis.pctSoldToday, direction: saleKpis.dirSoldToday, label: 'vs yesterday' },
    },
    {
      id: 'todays-revenue', label: "Today's Revenue", value: saleKpis.revenueToday, icon: 'trending-up', type: 'currency',
      trend: { value: saleKpis.pctRevenueToday, direction: saleKpis.dirRevenueToday, label: 'vs yesterday' },
    },
    {
      id: 'todays-profit', label: "Today's Profit", value: saleKpis.profitToday, icon: 'trending-up', type: 'currency',
      trend: { value: saleKpis.pctProfitToday, direction: saleKpis.dirProfitToday, label: 'vs yesterday' },
    },
    { id: 'weekly-profit', label: 'Weekly Profit', value: saleKpis.weeklyProfit, icon: 'bar-chart', type: 'currency' },
    { id: 'monthly-profit', label: 'Monthly Profit', value: saleKpis.monthlyProfit, icon: 'bar-chart', type: 'currency' },
    {
      id: 'low-stock', label: 'Low Stock Products', value: productKpis.lowStock, icon: 'alert-triangle', type: 'count',
      status: { label: 'Needs reorder', tone: 'warning' },
    },
    {
      id: 'unsold', label: 'Unsold Products', value: productKpis.unsold, icon: 'clock', type: 'count',
      status: { label: `No sales, ${UNSOLD_DAYS} days`, tone: 'negative' },
    },
  ];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Loads every dataset the dashboard needs.
 *
 * Data sourcing:
 *  - Total Products & Total Stock       → live product API
 *  - Low Stock & Unsold Products        → live product API × sale records
 *  - All other KPIs & ALL charts        → dummyData (sale records)
 */
export function useDashboardData() {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [user, productsResponse] = await Promise.all([
        dashboardService.getUser(),
        // Attempt real product API; fall back gracefully on failure
        getProducts().catch(() => null),
      ]);

      // Normalise the product API response into a flat array
      const rawProducts = Array.isArray(productsResponse)
        ? productsResponse
        : Array.isArray(productsResponse?.data)
        ? productsResponse.data
        : Array.isArray(productsResponse?.products)
        ? productsResponse.products
        : [];

      // All chart & KPI data computed from dummyData (sale records)
      const salesRecords = dummyData;

      const productKpis = buildProductKpis(rawProducts, salesRecords);
      const saleKpis = buildSaleKpis(salesRecords);

      setData({
        user,
        kpis: buildKpiArray(productKpis, saleKpis),
        dailySalesTrend: buildDailySalesTrend(salesRecords),
        topSellingProducts: buildTopSellingProducts(salesRecords),
        weeklyRevenue: buildWeeklyRevenue(salesRecords),
        monthlyRevenue: buildMonthlyRevenue(salesRecords),
        recentActivity: buildRecentActivity(salesRecords),
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
