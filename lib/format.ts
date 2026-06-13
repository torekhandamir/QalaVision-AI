import type { Locale } from "./ai-analysis";

export function formatKZT(value: number, locale: Locale) {
  const formatterLocale = locale === "en" ? "en-US" : "ru-RU";
  return `${new Intl.NumberFormat(formatterLocale, {
    maximumFractionDigits: 0
  }).format(value)} KZT`;
}

export function formatPercent(value: number) {
  const normalized = value <= 1 ? value * 100 : value;
  return `${Math.round(normalized)}%`;
}
