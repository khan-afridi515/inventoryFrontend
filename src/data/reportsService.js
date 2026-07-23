import { config } from '../config/env';
import {
  mockReportSummary,
  mockSalesChart,
  mockProfitChart,
  mockSalesTable,
} from './mockReportsData';

// Same pattern as dashboardService.js: this is the ONLY module that
// knows whether report data comes from mocks or a real API. Every
// component/hook calls reportsService — never mockReportsData or
// fetch() directly.

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

export const reportsService = {
  /** @param {'daily' | 'weekly' | 'monthly'} period @param {string} date */
  async getSummary(period, date) {
    if (config.useMockData) return mockReportSummary;
    return request(`/reports/${period}/summary?date=${date}`);
  },

  async getSalesChart(period, date) {
    if (config.useMockData) return mockSalesChart;
    return request(`/reports/${period}/sales-chart?date=${date}`);
  },

  async getProfitChart(period, date) {
    if (config.useMockData) return mockProfitChart;
    return request(`/reports/${period}/profit-chart?date=${date}`);
  },

  async getSalesTable(period, date) {
    if (config.useMockData) return mockSalesTable;
    return request(`/reports/${period}/sales-table?date=${date}`);
  },
};
