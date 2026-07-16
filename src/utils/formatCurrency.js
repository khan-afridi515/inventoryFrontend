import { CURRENCY, LOCALE } from '../constants/dashboard.constants';

/**
 * Formats a number as currency consistently across the whole app.
 * @param {number} value
 * @returns {string} e.g. "$934.82"
 */
export function formatCurrency(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
  }).format(value);
}

/**
 * Formats a plain integer with thousands separators.
 * @param {number} value
 * @returns {string} e.g. "1,075"
 */
export function formatNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(LOCALE).format(value);
}
