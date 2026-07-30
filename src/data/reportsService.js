import { config } from '../config/env';
import { mockSalesRecords } from '../data/mockSalesRecords';
import {
  getDateRangeForPeriod,
  getTrailingWeekRange,
  filterRecordsInRange,
  summarizeRecords,
  aggregateProductTotals,
  buildChartSeries,
  formatRangeLabel,
} from '../shared/utils/aggregateSalesData';

// Same pattern as dashboardService.js: this is the ONLY module that
// knows whether report data comes from mocks or a real API. Every
// component/hook calls reportsService — never mockSalesRecords,
// aggregateSalesData, or fetch() directly.
//
// The mock branch below computes real daily/weekly/monthly aggregates
// from the shared 3-month dataset (shared/data/mockSalesRecords.js),
// rather than returning the same flat numbers regardless of period —
// so the Daily/Weekly/Monthly tabs actually show different data.

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
      const { records } = getRecordsForPeriod(period, date);
      return summarizeRecords(records);
    }
    return request(`/reports/${period}/summary?date=${date}`);
  },

  async getSalesChart(period, date) {
    if (config.useMockData) {
      // Daily tab shows a trailing 7-day trend, not a single point.
      const records =
        period === 'daily'
          ? (() => {
              const { start, end } = getTrailingWeekRange(date);
              return filterRecordsInRange(mockSalesRecords, start, end);
            })()
          : getRecordsForPeriod(period, date).records;
      return buildChartSeries(records, period).map((r) => ({ day: r.label, amount: r.sellingValue }));
    }
    return request(`/reports/${period}/sales-chart?date=${date}`);
  },

  async getProfitChart(period, date) {
    if (config.useMockData) {
      const records =
        period === 'daily'
          ? (() => {
              const { start, end } = getTrailingWeekRange(date);
              return filterRecordsInRange(mockSalesRecords, start, end);
            })()
          : getRecordsForPeriod(period, date).records;
      return buildChartSeries(records, period).map((r) => ({ day: r.label, amount: r.profit }));
    }
    return request(`/reports/${period}/profit-chart?date=${date}`);
  },

  async getSalesTable(period, date) {
    if (config.useMockData) {
      const { records, start, end } = getRecordsForPeriod(period, date);
      const productTotals = aggregateProductTotals(records);
      const summary = summarizeRecords(records);
      return {
        label: formatRangeLabel(period, start, end),
        rows: productTotals,
        overallProfitLoss: summary.netRevenue,
      };
    }
    return request(`/reports/${period}/sales-table?date=${date}`);
  },
};
