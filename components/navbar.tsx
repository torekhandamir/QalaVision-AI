"use client";

import { BarChart3, Camera, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/14 bg-ink/56 px-4 py-3 text-white shadow-glass backdrop-blur-2xl">
        <a href="#top" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white text-ink shadow-glow">
            <ShieldCheck className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-wide">QalaVision</span>
            <span className="block text-[11px] font-medium text-white/55">
              AI GovTech
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/6 p-1 text-sm font-semibold text-white/70 lg:flex">
          <a
            href="#top"
            className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
          >
            {t.nav.product}
          </a>
          <a
            href="#submit"
            className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
          >
            {t.nav.submit}
          </a>
          <a
            href="#analysis"
            className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
          >
            {t.nav.ai}
          </a>
          <a
            href="#dashboard"
            className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
          >
            {t.nav.dashboard}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#submit"
            className="hidden h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink shadow-glow transition hover:-translate-y-0.5 hover:bg-civic-mint sm:flex"
          >
            <Camera className="size-4" />
            {t.nav.submit}
          </a>
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="pointer-events-none mx-auto mt-2 flex max-w-7xl justify-center gap-2 px-5 text-[11px] font-semibold text-white/55 lg:hidden">
        <a className="pointer-events-auto flex items-center gap-1" href="#submit">
          <Camera className="size-3" />
          {t.nav.submit}
        </a>
        <a className="pointer-events-auto flex items-center gap-1" href="#analysis">
          <Cpu className="size-3" />
          {t.nav.ai}
        </a>
        <a className="pointer-events-auto flex items-center gap-1" href="#dashboard">
          <BarChart3 className="size-3" />
          {t.nav.dashboard}
        </a>
      </div>
    </motion.header>
  );
}
