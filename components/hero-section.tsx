"use client";

import Image from "next/image";
import { ArrowRight, BarChart3, Camera, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./animated-number";
import { Reveal } from "./reveal";
import { useLanguage } from "./language-provider";
import type { IssueRecord } from "@/lib/mock-data";

type HeroSectionProps = {
  issues: IssueRecord[];
};

export function HeroSection({ issues }: HeroSectionProps) {
  const { t, locale } = useLanguage();
  const totalIssues = issues.length;
  const averageUrgency =
    issues.reduce((sum, issue) => sum + issue.urgencyScore, 0) / totalIssues;
  const totalBudget = issues.reduce(
    (sum, issue) => sum + issue.estimatedRepairCostKZT,
    0
  );
  const photoIssues = issues.filter((issue) => issue.hasPhoto).length;
  const districtCount = new Set(issues.map((issue) => issue.district)).size;
  const numberLocale = locale === "en" ? "en-US" : "ru-RU";

  const stats = [
    {
      label: t.stats.detected,
      value: totalIssues,
      suffix: "",
      icon: Sparkles,
      tone: "text-civic-cyan"
    },
    {
      label: t.stats.urgency,
      value: averageUrgency,
      suffix: "%",
      icon: BarChart3,
      tone: "text-civic-coral"
    },
    {
      label: t.stats.budget,
      value: totalBudget,
      suffix: "",
      prefix: "",
      compact: true,
      icon: MapPin,
      tone: "text-civic-gold"
    }
  ];

  return (
    <section
      id="top"
      className="relative min-h-[88svh] overflow-hidden bg-ink px-4 pb-14 pt-32 text-white sm:pt-36"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/qalavision-hero.png"
          alt="QalaVision AI smart city hero background"
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,18,0.96)_0%,rgba(7,16,18,0.78)_38%,rgba(7,16,18,0.34)_76%,rgba(7,16,18,0.76)_100%)]" />
        <div className="grid-mask absolute inset-0" />
      </div>

      <div className="noise absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/76 backdrop-blur-xl">
              <Sparkles className="size-4 text-civic-gold" />
              {t.hero.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="max-w-5xl text-balance text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">
              {t.hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="#submit"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-base font-black text-ink shadow-glow transition hover:bg-civic-mint"
              >
                <Camera className="size-5" />
                {t.hero.submitCta}
                <ArrowRight className="size-5" />
              </motion.a>
              <motion.a
                href="#dashboard"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-xl transition hover:bg-white/18"
              >
                <BarChart3 className="size-5" />
                {t.hero.dashboardCta}
              </motion.a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18}>
          <div className="relative ml-auto max-w-xl">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass rounded-[2rem] p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-civic-mint/16 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-civic-mint">
                  {t.hero.visualBadge}
                </span>
                <span className="flex items-center gap-2 text-xs font-semibold text-white/62">
                  <span className="size-2 rounded-full bg-civic-mint shadow-[0_0_18px_rgba(114,246,184,0.9)]" />
                  {t.misc.liveDemo}
                </span>
              </div>
              <p className="text-2xl font-black leading-tight text-white">
                {t.hero.visualTitle}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <MiniSignal label={t.stats.photoReady} value={`${photoIssues}/${totalIssues}`} />
                <MiniSignal label={t.stats.districts} value={`${districtCount}/8`} />
              </div>
              <div className="mt-5 h-44 overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-4">
                <div className="relative h-full rounded-2xl bg-[linear-gradient(135deg,rgba(101,227,255,0.16),rgba(248,211,107,0.12),rgba(255,141,122,0.1))]">
                  {[16, 28, 42, 57, 72, 84].map((left, index) => (
                    <motion.span
                      key={left}
                      className="absolute size-3 rounded-full bg-white shadow-[0_0_28px_rgba(101,227,255,0.8)]"
                      style={{
                        left: `${left}%`,
                        top: `${20 + ((index * 17) % 58)}%`
                      }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.35, 0.8] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: index * 0.28
                      }}
                    />
                  ))}
                  <div className="absolute inset-x-4 top-1/2 h-px bg-white/25" />
                  <div className="absolute bottom-8 left-8 right-5 h-px rotate-[-12deg] bg-civic-gold/35" />
                  <div className="absolute left-1/2 top-4 h-[80%] w-px rotate-[18deg] bg-civic-cyan/30" />
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Reveal delay={0.1 + index * 0.08} key={stat.label}>
            <motion.div
              whileHover={{ y: -6 }}
              className="glass rounded-3xl p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <stat.icon className={`size-6 ${stat.tone}`} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/38">
                  0{index + 1}
                </span>
              </div>
              <div className="text-4xl font-black text-white">
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

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
      <p className="text-xs font-semibold text-white/52">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
