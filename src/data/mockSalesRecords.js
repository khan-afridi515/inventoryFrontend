// Generates ~3 months of deterministic daily sales records, shared by
// any feature that reports on sales over time (currently: Reports;
// eventually: a Sales page, per the product's Redux-state diagram).
//
// This lives in shared/data/ rather than features/reports/data/
// specifically because more than one feature consumes it — the same
// rule we've applied everywhere else (see shared/components/common/Panel
// for the same reasoning).
//
// Data is deterministic (seeded PRNG, not Math.random()) so the app
// renders identical numbers on every load/build — useful for demos,
// and for anyone writing tests against this data later.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// The mock "today" used across this app's other mock data (Dashboard's
// Recent Activity, Reports' original single-day mock) — kept in sync so
// all mock data agrees on what "today" is.
export const MOCK_TODAY = '2026-07-15';
const DATASET_LENGTH_DAYS = 92; // ~3 months

export const PRODUCTS = [
  { id: 'cotton-crew-tshirt', name: 'Cotton Crew T-Shirt', unitPrice: 12.99, unitCost: 4.2, baseQty: 12 },
  { id: 'wireless-mouse-mx2', name: 'Wireless Mouse MX2', unitPrice: 19.99, unitCost: 8.5, baseQty: 5 },
  { id: 'ceramic-coffee-mug-set', name: 'Ceramic Coffee Mug Set', unitPrice: 16.99, unitCost: 6.0, baseQty: 8 },
  { id: 'yoga-mat-premium', name: 'Yoga Mat Premium', unitPrice: 24.99, unitCost: 9.5, baseQty: 4 },
  { id: 'hydrating-face-serum', name: 'Hydrating Face Serum', unitPrice: 29.99, unitCost: 11.0, baseQty: 3 },
];

// Small deterministic PRNG (mulberry32) so "random" daily variation is
// reproducible across reloads instead of changing every render.
function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Builds one day's record: per-product quantities (with weekend/seasonal
 * variation) plus the day's totals.
 */
function buildDayRecord(date, dayIndex) {
  const random = mulberry32(dayIndex * 9301 + 49297);
  const dayOfWeek = date.getUTCDay(); // 0 = Sunday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  // Mild upward trend over the 3 months + weekend bump, so charts have
  // a believable shape rather than pure noise.
  const trendMultiplier = 1 + (dayIndex / DATASET_LENGTH_DAYS) * 0.3;
  const weekendMultiplier = isWeekend ? 1.25 : 1;

  const products = PRODUCTS.map((p) => {
    const noise = 0.6 + random() * 0.8; // 0.6x–1.4x daily variance
    const qty = Math.max(0, Math.round(p.baseQty * trendMultiplier * weekendMultiplier * noise));
    const revenue = Number((qty * p.unitPrice).toFixed(2));
    const cost = Number((qty * p.unitCost).toFixed(2));
    const profit = Number((revenue - cost).toFixed(2));
    return { id: p.id, product: p.name, qty, revenue, cost, profit };
  });

  const totals = products.reduce(
    (acc, p) => ({
      unitsSold: acc.unitsSold + p.qty,
      purchaseValue: acc.purchaseValue + p.cost,
      sellingValue: acc.sellingValue + p.revenue,
      profit: acc.profit + p.profit,
    }),
    { unitsSold: 0, purchaseValue: 0, sellingValue: 0, profit: 0 }
  );

  return {
    date: toIsoDate(date),
    products,
    unitsSold: totals.unitsSold,
    purchaseValue: Number(totals.purchaseValue.toFixed(2)),
    sellingValue: Number(totals.sellingValue.toFixed(2)),
    profit: Number(totals.profit.toFixed(2)),
    loss: 0, // no loss scenarios modeled in mock data yet
  };
}

function generateDailyRecords() {
  const end = new Date(`${MOCK_TODAY}T00:00:00Z`);
  const records = [];
  for (let i = DATASET_LENGTH_DAYS - 1; i >= 0; i -= 1) {
    const date = new Date(end.getTime() - i * MS_PER_DAY);
    records.push(buildDayRecord(date, DATASET_LENGTH_DAYS - 1 - i));
  }
  return records;
}

/**
 * ~92 days of daily sales records, oldest first, ending at MOCK_TODAY.
 * Each record: { date, products[], unitsSold, purchaseValue, sellingValue, profit, loss }
 */
export const mockSalesRecords = generateDailyRecords();
