"use client";

import Image from "next/image";
import { ArrowRight, BarChart3, Camera, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { IssueRecord } from "@/lib/demo-data";
import { AnimatedNumber } from "./animated-number";
import { Reveal } from "./reveal";
import { useLanguage } from "./language-provider";

type HeroSectionProps = {
  issues: IssueRecord[];
};

export function HeroSection({ issues }: HeroSectionProps) {
  const { t, locale } = useLanguage();
  const totalIssues = issues.length;
  const averageUrgency = Math.round(
    issues.reduce((sum, issue) => sum + issue.urgencyScore, 0) / totalIssues
  );
  const totalBudget = issues.reduce(
    (sum, issue) => sum + issue.estimatedRepairCostKZT,
    0
  );
  const averageBudget = Math.round(totalBudget / totalIssues);
  const photoIssues = issues.filter((issue) => issue.hasPhoto).length;
  const districtCount = new Set(issues.map((issue) => issue.district)).size;
  const numberLocale = locale === "en" ? "en-US" : "ru-RU";

  const stats = [
    {
      label: t.stats.detected,
      value: totalIssues,
      suffix: "",
      icon: Sparkles
    },
    {
      label: t.stats.urgency,
      value: averageUrgency,
      suffix: "/100",
      icon: BarChart3
    },
    {
      label: t.stats.budget,
      value: averageBudget,
      suffix: " KZT",
      compact: true,
      icon: MapPin
    }
  ];

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-ink px-4 pb-16 pt-32 text-white"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/qalavision-hero.png"
          alt="QalaVision AI smart city visual"
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,18,0.97)_0%,rgba(7,16,18,0.86)_46%,rgba(7,16,18,0.56)_100%)]" />
        <div className="grid-mask absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.98fr_0.82fr] lg:items-center">
        <div>
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/9 px-4 py-2 text-sm font-bold text-white/76 backdrop-blur-xl">
              <Sparkles className="size-4 text-civic-gold" />
              {t.hero.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.06] tracking-normal text-white sm:text-5xl lg:text-[4rem]">
              {t.hero.title}
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              {t.hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#submit" primary>
                <Camera className="size-5" />
                {t.hero.submitCta}
                <ArrowRight className="size-5" />
              </ButtonLink>
              <ButtonLink href="#dashboard">
                <BarChart3 className="size-5" />
                {t.hero.dashboardCta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className="glass rounded-[1.75rem] p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="rounded-full bg-civic-mint/16 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-civic-mint">
                {t.hero.visualBadge}
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-white/62">
                <span className="size-2 rounded-full bg-civic-mint shadow-[0_0_18px_rgba(114,246,184,0.9)]" />
                {t.misc.liveDemo}
              </span>
            </div>
            <p className="text-2xl font-extrabold leading-tight text-white">
              {t.hero.visualTitle}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <MiniSignal label={t.stats.photoReady} value={`${photoIssues}/${totalIssues}`} />
              <MiniSignal label={t.stats.districts} value={`${districtCount}/8`} />
            </div>

            <a
              href="#map"
              className="mt-5 flex min-h-40 items-end overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(101,227,255,0.16),rgba(248,211,107,0.12),rgba(255,141,122,0.1))] p-4 transition hover:border-white/24"
            >
              <div>
                <p className="text-sm font-bold text-white/62">{t.hero.mapCta}</p>
                <p className="mt-2 text-xl font-extrabold text-white">
                  OpenStreetMap · Almaty
                </p>
              </div>
            </a>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Reveal delay={0.08 + index * 0.06} key={stat.label}>
            <motion.div whileHover={{ y: -4 }} className="glass rounded-3xl p-5">
              <div className="mb-5 flex items-center justify-between">
                <stat.icon className="size-6 text-civic-cyan" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/38">
                  0{index + 1}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  locale={numberLocale}
                  compact={stat.compact}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-white/58">{stat.label}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ButtonLink({
  href,
  children,
  primary = false
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
      <a
        href={href}
        className={
          primary
            ? "inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-base font-extrabold text-ink shadow-glow transition hover:bg-civic-mint"
            : "inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-xl transition hover:bg-white/18"
        }
      >
        {children}
      </a>
    </motion.div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
      <p className="text-xs font-semibold text-white/52">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}
