"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Camera, Map, ScanLine, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: t.nav.product },
    { href: "/submit", label: t.nav.submit },
    { href: "/analysis", label: t.nav.ai },
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/map", label: t.nav.map }
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-[1000] px-4 pt-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/14 bg-ink/82 px-4 py-3 text-white shadow-glass backdrop-blur-2xl">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white text-ink">
            <ShieldCheck className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold tracking-wide">
              QalaVision AI
            </span>
            <span className="block text-[11px] font-medium text-white/55">
              GovTech MVP
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/6 p-1 text-sm font-semibold text-white/70 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 transition",
                pathname === item.href
                  ? "bg-white text-ink"
                  : "hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/submit"
            className="hidden h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-civic-mint sm:flex"
          >
            <Camera className="size-4" />
            {t.nav.submit}
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="mx-auto mt-2 flex max-w-7xl justify-center gap-3 px-5 text-[11px] font-semibold text-white/72 lg:hidden">
        <Link className="flex items-center gap-1" href="/submit">
          <Camera className="size-3" />
          {t.nav.submit}
        </Link>
        <Link className="flex items-center gap-1" href="/analysis">
          <ScanLine className="size-3" />
          {t.nav.ai}
        </Link>
        <Link className="flex items-center gap-1" href="/dashboard">
          <BarChart3 className="size-3" />
          {t.nav.dashboard}
        </Link>
        <Link className="flex items-center gap-1" href="/map">
          <Map className="size-3" />
          {t.nav.map}
        </Link>
      </div>
    </motion.header>
  );
}
