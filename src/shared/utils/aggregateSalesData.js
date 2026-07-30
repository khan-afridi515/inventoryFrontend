// Pure functions for slicing/aggregating the daily sales dataset into
// whatever a given report period needs. No React, no fetching — these
// take data in and return data out, so they're trivially unit-testable.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseIsoDate(iso) {
  return new Date(`${iso}T00:00:00Z`);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/**
 * Returns the inclusive [start, end] ISO-date range for a given period,
 * anchored on referenceDateIso.
 *  - 'daily'   → that single day
 *  - 'weekly'  → the Mon–Sun week containing that day
 *  - 'monthly' → the calendar month containing that day
 * @param {'daily'|'weekly'|'monthly'} period
 * @param {string} referenceDateIso
 */
export function getDateRangeForPeriod(period, referenceDateIso) {
  const ref = parseIsoDate(referenceDateIso);

  if (period === 'weekly') {
    const dayOfWeek = ref.getUTCDay(); // 0 = Sunday
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    const start = addDays(ref, -daysSinceMonday);
    const end = addDays(start, 6);
    return { start: toIsoDate(start), end: toIsoDate(end) };
  }

  if (period === 'monthly') {
    const start = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1));
    const end = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() + 1, 0));
    return { start: toIsoDate(start), end: toIsoDate(end) };
  }

  // daily
  return { start: referenceDateIso, end: referenceDateIso };
}

/**
 * Returns the inclusive [start, end] range for the 7 days ending on
 * referenceDateIso — used for the Daily tab's trailing trend chart.
 */
export function getTrailingWeekRange(referenceDateIso) {
  const ref = parseIsoDate(referenceDateIso);
  const start = addDays(ref, -6);
  return { start: toIsoDate(start), end: referenceDateIso };
}

/** Filters records to those with date within [start, end], inclusive. */
export function filterRecordsInRange(records, start, end) {
  return records.filter((r) => r.date >= start && r.date <= end);
}

/**
 * Sums a set of daily records into the KPI-style summary shape used by
 * ReportStatsGrid.
 */
export function summarizeRecords(records) {
  const totals = records.reduce(
    (acc, r) => ({
      totalProductsSold: acc.totalProductsSold + r.unitsSold,
      purchaseValue: acc.purchaseValue + r.purchaseValue,
      sellingValue: acc.sellingValue + r.sellingValue,
      profit: acc.profit + r.profit,
      loss: acc.loss + r.loss,
    }),
    { totalProductsSold: 0, purchaseValue: 0, sellingValue: 0, profit: 0, loss: 0 }
  );

  const round2 = (n) => Number(n.toFixed(2));
  return {
    totalProductsSold: totals.totalProductsSold,
    purchaseValue: round2(totals.purchaseValue),
    sellingValue: round2(totals.sellingValue),
    profit: round2(totals.profit),
    loss: round2(totals.loss),
    netRevenue: round2(totals.profit - totals.loss),
  };
}

/**
 * Aggregates per-product totals across a set of daily records — this is
 * what backs the Sales Table (and could back a Top Selling Products
 * list for any period, not just "today").
 * @returns {Array<{ id, product, qty, revenue, profit }>} sorted by qty desc
 */
export function aggregateProductTotals(records) {
  const totalsById = new Map();

  for (const record of records) {
    for (const p of record.products) {
      const existing = totalsById.get(p.id) ?? { id: p.id, product: p.product, qty: 0, revenue: 0, profit: 0 };
      existing.qty += p.qty;
      existing.revenue += p.revenue;
      existing.profit += p.profit;
      totalsById.set(p.id, existing);
    }
  }

  return [...totalsById.values()]
    .map((p) => ({ ...p, revenue: Number(p.revenue.toFixed(2)), profit: Number(p.profit.toFixed(2)) }))
    .sort((a, b) => b.qty - a.qty);
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });
const MONTH_DAY_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

/**
 * Builds a chart-ready series (day-by-day for daily/weekly, week-by-week
 * for monthly since ~30 individual points is too dense to read).
 * @param {Array} records - already filtered to the period's date range
 * @param {'daily'|'weekly'|'monthly'} period
 * @returns {Array<{ label: string, sellingValue: number, profit: number }>}
 */
export function buildChartSeries(records, period) {
  if (period !== 'monthly') {
    return records.map((r) => ({
      label: WEEKDAY_FORMATTER.format(parseIsoDate(r.date)),
      sellingValue: r.sellingValue,
      profit: r.profit,
    }));
  }

  // Monthly: group into calendar weeks (Mon–Sun) so the chart shows
  // ~4-5 points instead of ~30.
  const weeks = new Map();
  for (const r of records) {
    const { start } = getDateRangeForPeriod('weekly', r.date);
    const bucket = weeks.get(start) ?? { start, sellingValue: 0, profit: 0 };
    bucket.sellingValue += r.sellingValue;
    bucket.profit += r.profit;
    weeks.set(start, bucket);
  }

  return [...weeks.values()]
    .sort((a, b) => (a.start < b.start ? -1 : 1))
    .map((w) => ({
      label: MONTH_DAY_FORMATTER.format(parseIsoDate(w.start)),
      sellingValue: Number(w.sellingValue.toFixed(2)),
      profit: Number(w.profit.toFixed(2)),
    }));
}

/**
 * Human-readable label for the selected range, used as the Sales
 * Table's panel title (e.g. "Jul 15, 2026", "Jul 13 – Jul 19, 2026",
 * "July 2026").
 */
export function formatRangeLabel(period, start, end) {
  if (period === 'monthly') {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      parseIsoDate(start)
    );
  }
  if (period === 'weekly') {
    return `${MONTH_DAY_FORMATTER.format(parseIsoDate(start))} – ${MONTH_DAY_FORMATTER.format(parseIsoDate(end))}`;
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
    parseIsoDate(start)
  );
}
