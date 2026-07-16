import { config } from '../config/env';
import {
  mockUser,
  mockKpis,
  mockDailySalesTrend,
  mockTopSellingProducts,
  mockWeeklyRevenue,
  mockMonthlyRevenue,
  mockRecentActivity,
} from './mockData';

// This is the ONLY module that knows whether data comes from mock
// objects or a real API. Every component/hook calls dashboardService —
// never mockData or fetch() directly. When a backend exists, delete
// the mock branch below (or flip VITE_USE_MOCK_DATA=false) and point
// each method at `${config.apiBaseUrl}/...`; nothing else in the app
// needs to change.

async function request(path) {
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin', // avoid sending cookies cross-origin by default
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

export const dashboardService = {
  async getUser() {
    if (config.useMockData) return mockUser;
    return request('/user');
  },

  async getKpis() {
    if (config.useMockData) return mockKpis;
    return request('/kpis');
  },

  async getDailySalesTrend() {
    if (config.useMockData) return mockDailySalesTrend;
    return request('/sales/daily-trend');
  },

  async getTopSellingProducts() {
    if (config.useMockData) return mockTopSellingProducts;
    return request('/products/top-selling');
  },

  async getWeeklyRevenue() {
    if (config.useMockData) return mockWeeklyRevenue;
    return request('/revenue/weekly');
  },

  async getMonthlyRevenue() {
    if (config.useMockData) return mockMonthlyRevenue;
    return request('/revenue/monthly');
  },

  async getRecentActivity() {
    if (config.useMockData) return mockRecentActivity;
    return request('/activity/recent');
  },
};
