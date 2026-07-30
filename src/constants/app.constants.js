// Values used by MORE THAN ONE feature (Dashboard AND Reports both use
// CHART_COLORS; formatCurrency/formatDate — shared utils — use CURRENCY/
// LOCALE). Anything used by only one feature belongs in that feature's
// own constants file instead, not here.

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
