/**
 * Strips characters that could be used for HTML/script injection from
 * plain text that will be rendered in the DOM.
 *
 * With static mock data this is a no-op safety net. The moment any
 * value here originates from a backend, a form, or a third-party feed,
 * this function is what stands between that value and the DOM — so it
 * belongs at the data boundary (dashboardService) now, before the
 * habit needs to be retrofitted under pressure.
 *
 * NOTE: React already escapes text content by default. This helper
 * matters most for values you'd ever pass to dangerouslySetInnerHTML,
 * href attributes, or outside React entirely — keep using it for any
 * user- or API-sourced string as a defense-in-depth measure.
 *
 * @param {string} value
 * @returns {string}
 */
export function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates that a string is a safe, relative-or-https URL before it's
 * ever used in an href/src. Rejects javascript: and data: schemes.
 * @param {string} url
 * @returns {string} the safe URL, or '#' if it fails validation
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (/^(https:\/\/|\/)/i.test(trimmed)) return trimmed;
  return '#';
}
