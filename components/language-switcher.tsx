"use client";

import { motion } from "framer-motion";
import { localeNames } from "@/lib/i18n";
import type { Locale } from "@/lib/ai-analysis";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const locales = Object.keys(localeNames) as Locale[];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-white/15 bg-white/8 p-1 text-xs font-semibold text-white shadow-glow backdrop-blur-xl">
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={cn(
            "relative h-8 min-w-9 rounded-full px-3 transition-colors",
            locale === item ? "text-ink" : "text-white/72 hover:text-white"
          )}
        >
          {locale === item ? (
            <motion.span
              layoutId="language-pill"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          ) : null}
          <span className="relative">{localeNames[item]}</span>
        </button>
      ))}
    </div>
  );
}
