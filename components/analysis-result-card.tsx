"use client";

import { ClipboardList, Gauge, Lightbulb, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import type { AIAnalysisResult } from "@/lib/ai-analysis";
import { formatKZT } from "@/lib/format";
import { problemLabels } from "@/lib/ai-analysis";
import { useLanguage } from "./language-provider";
import { AnimatedNumber } from "./animated-number";

type AnalysisResultCardProps = {
  result: AIAnalysisResult | null;
  loading: boolean;
};

export function AnalysisResultCard({ result, loading }: AnalysisResultCardProps) {
  const { t, locale } = useLanguage();

  if (loading) {
    return (
      <div className="light-glass flex min-h-[560px] flex-col items-center justify-center rounded-[2rem] p-8 text-center">
        <motion.div
          className="relative grid size-28 place-items-center rounded-full border border-ink/10 bg-white shadow-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute inset-3 rounded-full border border-civic-cyan/35" />
          <Gauge className="size-10 text-ink" />
        </motion.div>
        <motion.p
          className="mt-7 text-xl font-black text-ink"
          animate={{ opacity: [0.52, 1, 0.52] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          {t.form.analyzing}
        </motion.p>
        <div className="mt-7 flex w-full max-w-sm gap-2">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className="h-2 flex-1 rounded-full bg-ink"
              animate={{ opacity: [0.18, 0.9, 0.18] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: item * 0.16
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="light-glass flex min-h-[560px] flex-col justify-between rounded-[2rem] p-7">
        <div>
          <div className="grid size-14 place-items-center rounded-2xl bg-ink text-white">
            <Lightbulb className="size-7" />
          </div>
          <h3 className="mt-7 text-3xl font-black text-ink">{t.sections.resultTitle}</h3>
          <p className="mt-4 text-base leading-7 text-ink/62">
            {t.sections.resultEmpty}
          </p>
        </div>
        <div className="rounded-3xl border border-ink/8 bg-ink/[0.03] p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ink/42">
            {t.result.formula}
          </p>
          <p className="mt-3 text-lg font-bold text-ink">
            severity * 0.4 + locationRisk * 0.25 + citizenImpact * 0.2 +
            photoConfidence * 0.15
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className="light-glass rounded-[2rem] p-5 sm:p-7"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-ink/45">
            {t.sections.resultKicker}
          </p>
          <h3 className="mt-3 text-3xl font-black text-ink">
            {t.sections.resultTitle}
          </h3>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-black text-white">
          <Gauge className="size-4 text-civic-mint" />
          {localizedDeadlineLevel(t.dashboard, result.deadlineLevel)}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ResultMetric
          icon={<ClipboardList className="size-5" />}
          label={t.result.detectedProblem}
          value={problemLabels[locale][result.detectedProblem]}
        />
        <ResultMetric
          icon={<Gauge className="size-5" />}
          label={t.result.confidence}
          value={`${result.confidence}%`}
        />
        <ScoreMetric
          label={t.result.urgency}
          value={result.urgencyScore}
          tone="bg-civic-coral"
        />
        <ScoreMetric
          label={t.result.relevance}
          value={result.akimateRelevanceScore}
          tone="bg-civic-cyan"
        />
        <ResultMetric
          icon={<WalletCards className="size-5" />}
          label={t.result.cost}
          value={formatKZT(result.estimatedRepairCostKZT, locale)}
        />
        <ResultMetric
          icon={<Lightbulb className="size-5" />}
          label={t.result.deadline}
          value={result.repairDeadline}
        />
      </div>

      <div className="mt-6 rounded-3xl border border-ink/8 bg-white/68 p-5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-ink/42">
          {t.result.formula}
        </p>
        <div className="mt-4 space-y-4">
          {result.factors.map((factor) => (
            <div key={factor.label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-ink">{factor.label}</span>
                <span className="font-black text-ink/70">
                  {factor.value}/100 · {(factor.weight * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-ink/8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-ink"
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-ink/52">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <TextPanel title={t.result.explanation} text={result.explanation} />
        <TextPanel title={t.result.complaint} text={result.generatedComplaintText} />
        <p className="text-xs font-semibold text-ink/42">
          {t.result.model}: {result.modelVersion}
        </p>
      </div>
    </motion.div>
  );
}

function ResultMetric({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-white/72 p-4">
      <div className="flex items-center gap-2 text-ink/48">
        {icon}
        <span className="text-xs font-black uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <p className="mt-3 text-xl font-black leading-tight text-ink">{value}</p>
    </div>
  );
}

function ScoreMetric({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-white/72 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-ink/48">
          {label}
        </span>
        <span className="text-2xl font-black text-ink">
          <AnimatedNumber value={value} suffix="/100" />
        </span>
      </div>
      <div className="h-3 rounded-full bg-ink/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${tone}`}
        />
      </div>
    </div>
  );
}

function TextPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-ink/[0.035] p-5">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ink/42">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-ink/70">{text}</p>
    </div>
  );
}

function localizedDeadlineLevel(
  labels: {
    critical: string;
    high: string;
    medium: string;
    low: string;
  },
  level: AIAnalysisResult["deadlineLevel"]
) {
  switch (level) {
    case "Critical":
      return labels.critical;
    case "High":
      return labels.high;
    case "Medium":
      return labels.medium;
    case "Low":
      return labels.low;
  }
}
