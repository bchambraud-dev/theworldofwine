export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  country: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "US$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "\u20ac", name: "Euro", country: "Eurozone" },
  { code: "GBP", symbol: "\u00a3", name: "British Pound", country: "United Kingdom" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", country: "Switzerland" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  { code: "JPY", symbol: "\u00a5", name: "Japanese Yen", country: "Japan" },
  { code: "CNY", symbol: "\u00a5", name: "Chinese Yuan", country: "China" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong" },
  { code: "KRW", symbol: "\u20a9", name: "South Korean Won", country: "South Korea" },
  { code: "THB", symbol: "\u0e3f", name: "Thai Baht", country: "Thailand" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "INR", symbol: "\u20b9", name: "Indian Rupee", country: "India" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil" },
  { code: "ARS", symbol: "ARS", name: "Argentine Peso", country: "Argentina" },
  { code: "CLP", symbol: "CLP", name: "Chilean Peso", country: "Chile" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso", country: "Mexico" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway" },
  { code: "AED", symbol: "AED", name: "UAE Dirham", country: "UAE" },
  { code: "ILS", symbol: "\u20aa", name: "Israeli Shekel", country: "Israel" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia" },
  { code: "PHP", symbol: "\u20b1", name: "Philippine Peso", country: "Philippines" },
  { code: "COP", symbol: "COL$", name: "Colombian Peso", country: "Colombia" },
  { code: "PEN", symbol: "S/.", name: "Peruvian Sol", country: "Peru" },
];

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

export function formatPrice(amount: number, currencyCode: string): string {
  const c = getCurrency(currencyCode);
  if (["JPY", "KRW", "CLP"].includes(c.code)) {
    return `${c.symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${c.symbol}${amount.toFixed(0)}`;
}
