// Static/mock data for the Reports page. Only reportsService.js should
// import from here — components and hooks must go through the service.

export const mockReportSummary = {
  date: '2026-07-15',
  totalProductsSold: 37,
  purchaseValue: 244.3,
  sellingValue: 669.63,
  profit: 425.33,
  loss: 0.0,
  netRevenue: 425.33,
};

export const mockSalesChart = [
  { day: 'Thu', amount: 620 },
  { day: 'Fri', amount: 480 },
  { day: 'Sat', amount: 460 },
  { day: 'Sun', amount: 720 },
  { day: 'Mon', amount: 430 },
  { day: 'Tue', amount: 700 },
  { day: 'Wed', amount: 610 },
];

export const mockProfitChart = [
  { day: 'Thu', amount: 400 },
  { day: 'Fri', amount: 310 },
  { day: 'Sat', amount: 340 },
  { day: 'Sun', amount: 430 },
  { day: 'Mon', amount: 310 },
  { day: 'Tue', amount: 450 },
  { day: 'Wed', amount: 405 },
];

export const mockSalesTable = {
  date: '2026-07-15',
  rows: [
    { id: 'wireless-mouse-mx2', product: 'Wireless Mouse MX2', qty: 6, revenue: 119.94, profit: 68.94 },
    { id: 'cotton-crew-tshirt', product: 'Cotton Crew T-Shirt', qty: 14, revenue: 181.86, profit: 123.06 },
    { id: 'ceramic-coffee-mug-set', product: 'Ceramic Coffee Mug Set', qty: 9, revenue: 152.91, profit: 98.91 },
    { id: 'yoga-mat-premium', product: 'Yoga Mat Premium', qty: 5, revenue: 124.95, profit: 77.45 },
    { id: 'hydrating-face-serum', product: 'Hydrating Face Serum', qty: 3, revenue: 89.97, profit: 56.97 },
  ],
  overallProfitLoss: 425.33,
};
