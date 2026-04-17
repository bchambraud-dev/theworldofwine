// Currency conversion using ExchangeRate-API (free, no key, daily updates)
// All prices stored in USD internally. Displayed in user's preferred currency.

const CACHE_KEY = "twow_exchange_rates";
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

interface RateCache {
  rates: Record<string, number>;
  fetched: number;
}

let memoryCache: RateCache | null = null;

async function fetchRates(): Promise<Record<string, number>> {
  // Check memory cache
  if (memoryCache && Date.now() - memoryCache.fetched < CACHE_TTL) {
    return memoryCache.rates;
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: RateCache = JSON.parse(cached);
      if (Date.now() - parsed.fetched < CACHE_TTL) {
        memoryCache = parsed;
        return parsed.rates;
      }
    }
  } catch {}

  // Fetch fresh rates
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if (data.result === "success" && data.rates) {
      const cache: RateCache = { rates: data.rates, fetched: Date.now() };
      memoryCache = cache;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
      return data.rates;
    }
  } catch {}

  // Fallback: approximate rates for common currencies (as of April 2026)
  return {
    USD: 1, SGD: 1.34, EUR: 0.92, GBP: 0.79, AUD: 1.55, NZD: 1.72,
    CAD: 1.38, CHF: 0.89, JPY: 154, CNY: 7.25, HKD: 7.82, KRW: 1380,
    THB: 35.5, MYR: 4.7, INR: 84.5, ZAR: 18.5, BRL: 5.1, ARS: 950,
    CLP: 960, MXN: 17.5, SEK: 10.7, DKK: 6.9, NOK: 10.9, AED: 3.67,
  };
}

/**
 * Convert a price from USD to the target currency.
 */
export async function convertFromUSD(amountUSD: number, toCurrency: string): Promise<number> {
  if (toCurrency === "USD") return amountUSD;
  const rates = await fetchRates();
  const rate = rates[toCurrency];
  if (!rate) return amountUSD;
  return amountUSD * rate;
}

/**
 * Convert a price from a source currency to USD for storage.
 */
export async function convertToUSD(amount: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === "USD") return amount;
  const rates = await fetchRates();
  const rate = rates[fromCurrency];
  if (!rate) return amount;
  return amount / rate;
}

/**
 * Format a USD amount in the user's currency with proper symbol.
 * This is the main function for display — takes stored USD, returns formatted string.
 */
export async function displayPrice(amountUSD: number | null, currencyCode: string): Promise<string> {
  if (amountUSD == null || amountUSD === 0) return "";
  const converted = await convertFromUSD(amountUSD, currencyCode);
  const symbols: Record<string, string> = {
    SGD: "S$", USD: "US$", EUR: "\u20ac", GBP: "\u00a3", AUD: "A$", NZD: "NZ$",
    CAD: "C$", CHF: "CHF", JPY: "\u00a5", CNY: "\u00a5", HKD: "HK$", KRW: "\u20a9",
    THB: "\u0e3f", MYR: "RM", INR: "\u20b9", ZAR: "R", BRL: "R$", MXN: "MX$",
    ARS: "ARS", CLP: "CLP", SEK: "kr", DKK: "kr", NOK: "kr", AED: "AED",
  };
  const sym = symbols[currencyCode] || `${currencyCode} `;
  if (["JPY", "KRW", "CLP", "ARS"].includes(currencyCode)) {
    return `${sym}${Math.round(converted).toLocaleString()}`;
  }
  return `${sym}${Math.round(converted).toLocaleString()}`;
}

/**
 * Synchronous version using cached rates (for render). Falls back to USD if no cache.
 */
export function displayPriceSync(amountUSD: number | null, currencyCode: string): string {
  if (amountUSD == null || amountUSD === 0) return "";
  let converted = amountUSD;
  if (currencyCode !== "USD" && memoryCache?.rates?.[currencyCode]) {
    converted = amountUSD * memoryCache.rates[currencyCode];
  }
  const symbols: Record<string, string> = {
    SGD: "S$", USD: "US$", EUR: "\u20ac", GBP: "\u00a3", AUD: "A$", NZD: "NZ$",
    CAD: "C$", CHF: "CHF", JPY: "\u00a5", CNY: "\u00a5", HKD: "HK$", KRW: "\u20a9",
    THB: "\u0e3f", MYR: "RM", INR: "\u20b9", ZAR: "R", BRL: "R$", MXN: "MX$",
    ARS: "ARS", CLP: "CLP", SEK: "kr", DKK: "kr", NOK: "kr", AED: "AED",
  };
  const sym = symbols[currencyCode] || `${currencyCode} `;
  return `${sym}${Math.round(converted).toLocaleString()}`;
}

/**
 * Preload rates into memory cache. Call once on app init.
 */
export async function preloadRates(): Promise<void> {
  await fetchRates();
}
