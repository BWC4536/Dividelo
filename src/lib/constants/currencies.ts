export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€", locale: "es-ES" },
  { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", locale: "de-CH" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", locale: "en-CA" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", locale: "es-MX" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", locale: "pt-BR" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", locale: "es-AR" },
  { code: "COP", name: "Colombian Peso", symbol: "COP", locale: "es-CO" },
  { code: "CLP", name: "Chilean Peso", symbol: "CLP", locale: "es-CL" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", locale: "es-PE" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", locale: "sv-SE" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", locale: "nb-NO" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", locale: "da-DK" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", locale: "pl-PL" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", locale: "cs-CZ" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", locale: "hu-HU" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", locale: "ro-RO" },
];

export function getCurrencyByCode(code: string): Currency {
  return (
    CURRENCIES.find((c) => c.code === code) ?? {
      code,
      name: code,
      symbol: code,
      locale: "en-US",
    }
  );
}

export const DEFAULT_CURRENCY = "EUR";
