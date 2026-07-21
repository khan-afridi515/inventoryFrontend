// Single source of truth for environment/config values.
// Never read import.meta.env directly anywhere else in the app —
// that keeps env-var access auditable and makes it trivial to add
// validation or defaults in one place.

const required = (key, fallback) => {
  const value = import.meta.env[key] ?? fallback;
  if (value === undefined) {
    // Fail loudly at startup rather than silently at fetch-time.
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  apiBaseUrl: required('VITE_API_BASE_URL', '/api'),
  useMockData: (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') === 'true',
  clientId: required('VITE_CLIENT_ID'),
  redirectUri: import.meta.env.VITE_EBAY_REDIRECT_URI ?? `${window.location.origin}/auth/ebay/callback`,
  env: import.meta.env.MODE,
};
