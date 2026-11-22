// Retain only the coarse region code, never the trace's IP or diagnostic data.
let cachedCountry = null;
let expiresAt = 0;
let pending;
export async function resolveCountry() {
  const override = process.env.MIAO_REGION?.toUpperCase();
  if (/^[A-Z]{2}$/.test(override || '')) return override;
  if (Date.now() < expiresAt) return cachedCountry;
  if (pending) return pending;
  pending = (async () => {
    try {
      const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', { signal: AbortSignal.timeout(1800) });
      if (!response.ok) throw new Error('Region unavailable');
      const country = /^loc=([A-Z]{2})$/m.exec(await response.text())?.[1];
      if (!country) throw new Error('Region unavailable');
      cachedCountry = country;
      expiresAt = Date.now() + 60 * 60 * 1000;
    } catch {
      cachedCountry = null;
      expiresAt = Date.now() + 60 * 1000;
    } finally {
      pending = null;
    }
    return cachedCountry;
  })();
  return pending;
}
