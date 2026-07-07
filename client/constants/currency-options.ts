export const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "BDT", label: "BDT - Bangladeshi Taka" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "KRW", label: "KRW - South Korean Won" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
] as const;

export const supportedCurrencyCodes = currencyOptions.map(
  (currency) => currency.value,
);

export type SupportedCurrencyCode = (typeof supportedCurrencyCodes)[number];

export function isSupportedCurrencyCode(
  value: string,
): value is SupportedCurrencyCode {
  return supportedCurrencyCodes.includes(value as SupportedCurrencyCode);
}

export function normalizeCurrencyCode(value: string | undefined) {
  const normalized = value?.trim().toUpperCase();

  return normalized && isSupportedCurrencyCode(normalized) ? normalized : "USD";
}
