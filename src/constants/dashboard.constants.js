// Business-logic thresholds and fixed lookup values.
// Keeping these out of components means a product-owner tweak
// (e.g. "low stock should mean <10 not <5") is a one-line change.

export const LOW_STOCK_THRESHOLD = 10;
export const UNSOLD_DAYS_THRESHOLD = 14;

export const TREND_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  FLAT: 'flat',
};

// NOTE: Recharts renders raw SVG and takes color values as props (stroke,
// fill), not Tailwind classNames — it cannot consume utility classes. These
// hex values are kept in sync with the @theme tokens in src/index.css by
// hand; if you change one, change the other.
export const CHART_COLORS = {
  primary: '#3B6FE0',
  primaryLight: '#E8EEFC',
  bar: '#3F4A5A',
  grid: '#E7EAF0',
  positive: '#1DA97C',
  negative: '#E0473B',
  warning: '#C98A1A',
};

export const CURRENCY = 'USD';
export const LOCALE = 'en-US';
