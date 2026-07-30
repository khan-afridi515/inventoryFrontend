import { config } from '../config/env';
import { dummyData } from './dummyData';
import { formatShortDate, formatWeekdayShort } from '../shared/utils/formatDate';

// Same pattern as dashboardService.js: this is the ONLY module that
// knows whether report data comes from mocks or a real API. Every
// component/hook calls reportsService — never dummyData or fetch()
// directly.

function parseISODate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${isoDate}`);
  }
  return date;
}

function getPeriodBounds(period, isoDate) {
  const end = parseISODate(isoDate);
  if (period === 'daily') {
    // last 7 days ending at isoDate
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    return { start, end };
  }

  if (period === 'weekly') {
    // previous 5 weeks ending at isoDate (includes current week)
    const start = new Date(end);
    start.setDate(end.getDate() - (7 * 5 - 1));
    return { start, end };
  }

  // monthly: previous 5 months ending with the month of isoDate
  const start = new Date(end.getFullYear(), end.getMonth() - 4, 1);
  const endOfMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0);
  return { start, end: endOfMonth };
}

function isWithinBounds(itemDate, bounds) {
  const date = parseISODate(itemDate);
  return date >= bounds.start && date <= bounds.end;
}

function normalizeId(value) {
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatPeriodLabel(period, isoDate) {
  const date = parseISODate(isoDate);
  if (period === 'weekly') {
    return `Week ending ${formatShortDate(isoDate)}`;
  }
  if (period === 'monthly') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
  return formatShortDate(isoDate);
}

function formatChartLabel(period, isoDate) {
  if (period === 'daily') return formatWeekdayShort(isoDate);
  const date = parseISODate(isoDate);
  return String(date.getDate());
}

function generateDateRange(start, end) {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function buildSummary(records, period, date) {
  let targetRecords = records;
  if (period === 'daily') {
    targetRecords = records.filter(r => r.date === date);
  } else if (period === 'weekly') {
    const end = parseISODate(date);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const startIso = start.toISOString().split('T')[0];
    const endIso = end.toISOString().split('T')[0];
    targetRecords = records.filter(r => r.date >= startIso && r.date <= endIso);
  } else if (period === 'monthly') {
    const end = parseISODate(date);
    const monthStartIso = new Date(end.getFullYear(), end.getMonth(), 1).toISOString().split('T')[0];
    const monthEndIso = new Date(end.getFullYear(), end.getMonth() + 1, 0).toISOString().split('T')[0];
    targetRecords = records.filter(r => r.date >= monthStartIso && r.date <= monthEndIso);
  }

  const totalProductsSold = targetRecords.reduce((sum, item) => sum + item.qtySold, 0);
  const purchaseValue = targetRecords.reduce((sum, item) => sum + item.totalCost, 0);
  const sellingValue = targetRecords.reduce((sum, item) => sum + item.totalRevenue, 0);
  const profit = targetRecords.reduce((sum, item) => sum + Math.max(item.profitLoss, 0), 0);
  const loss = targetRecords.reduce((sum, item) => sum + Math.max(-item.profitLoss, 0), 0);

  return {
    date: formatPeriodLabel(period, date),
    totalProductsSold,
    purchaseValue,
    sellingValue,
    profit,
    loss,
    netRevenue: profit - loss,
  };
}

function buildChart(records, period, valueKey, date) {
  // daily: return 7 daily buckets
  if (period === 'daily') {
    const bounds = getPeriodBounds(period, date);
    const periodDates = generateDateRange(bounds.start, bounds.end);
    const grouped = records.reduce((acc, item) => {
      acc[item.date] = (acc[item.date] || 0) + item[valueKey];
      return acc;
    }, {});
    return periodDates.map((d) => ({ day: formatWeekdayShort(d), amount: grouped[d] || 0 }));
  }

  // weekly: create 5 week buckets (7-day ranges) ending on `date`
  if (period === 'weekly') {
    const end = parseISODate(date);
    const weeks = [];
    // build 5 buckets: from oldest to newest
    for (let i = 4; i >= 0; i--) {
      const weekEnd = new Date(end);
      weekEnd.setDate(end.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      const startIso = weekStart.toISOString().split('T')[0];
      const endIso = weekEnd.toISOString().split('T')[0];
      weeks.push({ startIso, endIso, label: `${formatShortDate(startIso)} - ${formatShortDate(endIso)}` });
    }

    return weeks.map((w) => {
      const amount = records.reduce((sum, r) => {
        if (r.date >= w.startIso && r.date <= w.endIso) return sum + r[valueKey];
        return sum;
      }, 0);
      return { day: w.label, amount };
    });
  }

  // monthly: last 5 months ending with the month of `date`.
  if (period === 'monthly') {
    const end = parseISODate(date);
    const months = [];
    for (let i = 4; i >= 0; i--) {
      const m = new Date(end.getFullYear(), end.getMonth() - i, 1);
      const monthStartIso = new Date(m.getFullYear(), m.getMonth(), 1).toISOString().split('T')[0];
      const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);
      const monthEndIso = monthEnd.toISOString().split('T')[0];
      months.push({ startIso: monthStartIso, endIso: monthEndIso, label: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(m) });
    }

    return months.map((m) => {
      const amount = records.reduce((sum, r) => {
        if (r.date >= m.startIso && r.date <= m.endIso) return sum + r[valueKey];
        return sum;
      }, 0);
      return { day: m.label, amount };
    });
  }

  return [];
}

function buildSalesTable(records, period, date) {
  let targetRecords = records;
  if (period === 'daily') {
    targetRecords = records.filter(r => r.date === date);
  } else if (period === 'weekly') {
    const end = parseISODate(date);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const startIso = start.toISOString().split('T')[0];
    const endIso = end.toISOString().split('T')[0];
    targetRecords = records.filter(r => r.date >= startIso && r.date <= endIso);
  } else if (period === 'monthly') {
    const end = parseISODate(date);
    const monthStartIso = new Date(end.getFullYear(), end.getMonth(), 1).toISOString().split('T')[0];
    const monthEndIso = new Date(end.getFullYear(), end.getMonth() + 1, 0).toISOString().split('T')[0];
    targetRecords = records.filter(r => r.date >= monthStartIso && r.date <= monthEndIso);
  }

  const rowsByProduct = targetRecords.reduce((acc, item) => {
    const key = item.product;
    if (!acc[key]) {
      acc[key] = {
        id: normalizeId(key),
        product: item.product,
        qty: 0,
        revenue: 0,
        profit: 0,
      };
    }
    acc[key].qty += item.qtySold;
    acc[key].revenue += item.totalRevenue;
    acc[key].profit += item.profitLoss;
    return acc;
  }, {});

  const rows = Object.values(rowsByProduct).sort((a, b) => b.revenue - a.revenue);
  const overallProfitLoss = rows.reduce((sum, row) => sum + row.profit, 0);

  return {
    date: formatPeriodLabel(period, date),
    rows,
    overallProfitLoss,
  };
}

export function buildReportData(period, date, sourceData = dummyData) {
  const bounds = getPeriodBounds(period, date);
  const records = sourceData.filter((item) => item.date && isWithinBounds(item.date, bounds));

  return {
    summary: buildSummary(records, period, date),
    salesChart: buildChart(records, period, 'totalRevenue', date),
    profitChart: buildChart(records, period, 'profitLoss', date),
    salesTable: buildSalesTable(records, period, date),
  };
}

async function request(path) {
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

/** Records for the given period+date, computed once and reused by every method below. */
function getRecordsForPeriod(period, date) {
  const { start, end } = getDateRangeForPeriod(period, date);
  return { records: filterRecordsInRange(mockSalesRecords, start, end), start, end };
}

export const reportsService = {
  /** @param {'daily' | 'weekly' | 'monthly'} period @param {string} date */
  async getSummary(period, date) {
    if (config.useMockData) {
      return buildReportData(period, date).summary;
    }
    return request(`/reports/${period}/summary?date=${date}`);
  },

  async getSalesChart(period, date) {
    if (config.useMockData) {
      return buildReportData(period, date).salesChart;
    }
    return request(`/reports/${period}/sales-chart?date=${date}`);
  },

  async getProfitChart(period, date) {
    if (config.useMockData) {
      return buildReportData(period, date).profitChart;
    }
    return request(`/reports/${period}/profit-chart?date=${date}`);
  },

  async getSalesTable(period, date) {
    if (config.useMockData) {
      return buildReportData(period, date).salesTable;
    }
    return request(`/reports/${period}/sales-table?date=${date}`);
  },
};
