import { config } from '../../../config/env';
import { mockSalesRecords, PRODUCTS } from '../../../data/mockSalesRecords';

// Same pattern as dashboardService.js/reportsService.js: this is the
// ONLY module that knows whether sale line items come from the mock
// dataset or a real API. The Sales page's component never touches
// mockSalesRecords directly.
//
// Reports aggregates the daily dataset into summaries (one number per
// period). Sales needs the opposite: one row per individual sale, so
// this file's job is purely to flatten — no summing.

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

const unitPricesById = new Map(
  PRODUCTS.map((p) => [p.id, { unitPurchase: p.unitCost, unitSelling: p.unitPrice }])
);

/**
 * Flattens the shared daily records into one row per product sold on
 * a given day — e.g. 92 days × up to 5 products ≈ 460 rows.
 * @returns {Array<{ id, product, qtySold, unitPurchase, unitSelling, date }>}
 */
function flattenToLineItems(records) {
  const rows = [];
  for (const record of records) {
    for (const p of record.products) {
      if (p.qty <= 0) continue; // skip days a product had zero sales
      const prices = unitPricesById.get(p.id);
      rows.push({
        id: `${record.date}-${p.id}`,
        product: p.product,
        qtySold: p.qty,
        unitPurchase: prices?.unitPurchase ?? 0,
        unitSelling: prices?.unitSelling ?? 0,
        date: record.date,
      });
    }
  }
  return rows;
}

export const salesService = {
  /** Every individual sale line item across the full 3-month dataset. */
  async getSalesLineItems() {
    if (config.useMockData) return flattenToLineItems(mockSalesRecords);
    return request('/sales/line-items');
  },
};
