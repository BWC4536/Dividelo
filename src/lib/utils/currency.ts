export function formatCurrency(
  amount: number,
  currency = "EUR",
  locale = "es-ES"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrencyInput(value: string): number {
  // Remove currency symbols and spaces, replace comma with dot
  const cleaned = value.replace(/[^0-9.,]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function roundToDecimals(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function splitEqually(total: number, count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor((total * 100) / count) / 100;
  const remainder = Math.round((total - base * count) * 100);
  const splits = Array(count).fill(base);
  for (let i = 0; i < remainder; i++) {
    splits[i] = roundToDecimals(splits[i] + 0.01);
  }
  return splits;
}
