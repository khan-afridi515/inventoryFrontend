import { LOCALE } from '../constants/dashboard.constants';

/**
 * Formats an ISO date string into a short label, e.g. "Jul 15, 2026".
 * @param {string} isoDate
 */
export function formatShortDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats a weekday abbreviation for chart axes, e.g. "Thu".
 * @param {string} isoDate
 */
export function formatWeekdayShort(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(date);
}
