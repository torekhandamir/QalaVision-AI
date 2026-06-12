import type { Locale } from "./ai-analysis";

export function formatKZT(value: number, locale: Locale) {
  const formatterLocale = locale === "en" ? "en-US" : "ru-RU";
  return `${new Intl.NumberFormat(formatterLocale, {
    maximumFractionDigits: 0
  }).format(value)} KZT`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
