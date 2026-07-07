export const SUPPORTED_CURRENCY_CODES = [
  "USD",
  "GBP",
  "BDT",
  "EUR",
  "INR",
  "KRW",
  "JPY",
  "CAD",
  "AUD",
] as const;

export type SupportedCurrencyCode = (typeof SUPPORTED_CURRENCY_CODES)[number];
