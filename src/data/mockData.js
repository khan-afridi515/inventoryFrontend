// All static/mock data lives in this single file.
// dashboardService.js is the ONLY file that should import from here —
// components and hooks must never import mockData directly.

export const mockUser = {
  name: 'Amara',
};

export const mockKpis = [
  { id: 'total-products', label: 'Total Products', value: 14, icon: 'grid', type: 'count' },
  { id: 'total-stock', label: 'Total Stock', value: 1075, icon: 'grid', type: 'count' },
  { id: 'sold-today', label: 'Sold Today', value: 37, icon: 'clipboard', type: 'count', trend: { value: 12.4, direction: 'up', label: 'vs yesterday' } },
  { id: 'todays-revenue', label: "Today's Revenue", value: 934.82, icon: 'trending-up', type: 'currency', trend: { value: 8.1, direction: 'up', label: 'vs yesterday' } },
  { id: 'todays-profit', label: "Today's Profit", value: 318.12, icon: 'trending-up', type: 'currency', trend: { value: 6.7, direction: 'up', label: 'vs yesterday' } },
  { id: 'weekly-profit', label: 'Weekly Profit', value: 15580.0, icon: 'bar-chart', type: 'currency' },
  { id: 'monthly-profit', label: 'Monthly Profit', value: 22770.0, icon: 'bar-chart', type: 'currency' },
  { id: 'low-stock', label: 'Low Stock Products', value: 5, icon: 'alert-triangle', type: 'count', status: { label: 'Needs reorder', tone: 'warning' } },
  { id: 'unsold', label: 'Unsold Products', value: 0, icon: 'clock', type: 'count', status: { label: 'No sales, 14 days', tone: 'negative' } },
];

export const mockDailySalesTrend = [
  { day: 'Thu', units: 28 },
  { day: 'Fri', units: 19 },
  { day: 'Sat', units: 27 },
  { day: 'Sun', units: 33 },
  { day: 'Mon', units: 21 },
  { day: 'Tue', units: 26 },
  { day: 'Wed', units: 38 },
];

export const mockTopSellingProducts = [
  { id: 'cotton-crew-tshirt', name: 'Cotton Crew T-Shirt', unitsSold: 95 },
  { id: 'wireless-mouse-mx2', name: 'Wireless Mouse MX2', unitsSold: 68 },
  { id: 'ceramic-coffee-mug-set', name: 'Ceramic Coffee Mug Set', unitsSold: 60 },
  { id: 'yoga-mat-premium', name: 'Yoga Mat Premium', unitsSold: 45 },
  { id: 'hydrating-face-serum', name: 'Hydrating Face Serum', unitsSold: 27 },
];

export const mockWeeklyRevenue = [
  { week: 'Jun 15-21', revenue: 9800 },
  { week: 'Jun 22-28', revenue: 10600 },
  { week: 'Jun 29-Jul 5', revenue: 9200 },
  { week: 'Jul 6-12', revenue: 11400 },
  { week: 'Jul 13-15', revenue: 4900 },
];

export const mockMonthlyRevenue = [
  { month: 'Feb', revenue: 38500 },
  { month: 'Mar', revenue: 41000 },
  { month: 'Apr', revenue: 40200 },
  { month: 'May', revenue: 42800 },
  { month: 'Jun', revenue: 44100 },
  { month: 'Jul', revenue: 20500 },
];

export const mockRecentActivity = [
  { id: 'act-1', text: '3× Hydrating Face Serum sold', timestamp: '2026-07-15T00:00:00Z', amount: 89.97 },
  { id: 'act-2', text: '5× Yoga Mat Premium sold', timestamp: '2026-07-15T00:00:00Z', amount: 124.95 },
  { id: 'act-3', text: '9× Ceramic Coffee Mug Set sold', timestamp: '2026-07-15T00:00:00Z', amount: 152.91 },
  { id: 'act-4', text: '14× Cotton Crew T-Shirt sold', timestamp: '2026-07-15T00:00:00Z', amount: 181.86 },
  { id: 'act-5', text: '6× Wireless Mouse MX2 sold', timestamp: '2026-07-15T00:00:00Z', amount: 119.94 },
];
