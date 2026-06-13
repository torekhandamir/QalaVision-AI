"use client";

/* eslint-disable @next/next/no-img-element -- User-uploaded data URLs are displayed directly as evidence. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ClipboardList,
  Gauge,
  ImageIcon,
  Send,
  WalletCards
} from "lucide-react";
import { motion } from "framer-motion";
import { districtLabels, problemLabels } from "@/lib/ai-analysis";
import { formatKZT } from "@/lib/format";
import { issueFromAnalysis } from "@/lib/demo-data";
import { useIssues } from "./issue-provider";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";

export function AnalysisPageContent() {
  const router = useRouter();
  const { latestAnalysis, addIssue, markLatestSent } = useIssues();
  const { t, locale } = useLanguage();

  if (!latestAnalysis) {
    return (
      <main className="min-h-screen bg-pearl px-4 pb-20 pt-32">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-ink/8 bg-white p-8 shadow-glass">
          <div className="grid size-14 place-items-center rounded-2xl bg-ink text-white">
            <Gauge className="size-7" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-ink">
            {t.sections.resultTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-ink/62">{t.sections.resultEmpty}</p>
          <Link
            href="/submit"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-extrabold text-white"
          >
            {t.nav.submit}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const { result, formData, photoDataUrl, sentIssueId } = latestAnalysis;

  function sendToDashboard() {
    if (!latestAnalysis) return;
    if (!sentIssueId) {
      const issue = issueFromAnalysis(result, {
        district: formData.district,
        description: formData.description,
        address: formData.address,
        location: formData.location,
        hasPhoto: Boolean(photoDataUrl),
        photoUrl: photoDataUrl ?? undefined
      });
      addIssue(issue);
      markLatestSent(issue.id);
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-pearl px-4 pb-20 pt-32 text-ink">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-ink/45">
              {t.sections.resultKicker}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
              {t.sections.resultTitle}
            </h1>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={0.08}>
            <div className="light-glass rounded-[2rem] p-5">
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-ink/45">
                {t.result.uploadedPhoto}
              </p>
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-ink">
                {photoDataUrl ? (
                  <img
                    src={photoDataUrl}
                    alt={t.result.uploadedPhoto}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center text-white/60">
                    <div className="text-center">
                      <ImageIcon className="mx-auto size-10" />
                      <p className="mt-3 text-sm font-bold">{t.form.noPhoto}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5 rounded-3xl border border-ink/8 bg-white/72 p-5">
                <p className="text-sm font-extrabold text-ink">
                  {districtLabels[locale][formData.district]}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  {formData.address || t.form.addressPlaceholder}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="light-glass rounded-[2rem] p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink/45">
                    {t.result.detectedProblem}
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold text-ink">
                    {problemLabels[locale][result.detectedProblem]}
                  </h2>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white">
                  <Gauge className="size-4 text-civic-mint" />
                  {result.repairDeadline}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Metric
                  icon={<Gauge className="size-5" />}
                  label={t.result.confidence}
                  value={`${result.confidence}%`}
                />
                <Metric
                  icon={<WalletCards className="size-5" />}
                  label={t.result.cost}
                  value={formatKZT(result.estimatedRepairCostKZT, locale)}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Score label={t.result.urgency} value={result.urgencyScore} tone="bg-red-500" />
                <Score label={t.result.relevance} value={result.akimatRelevanceScore} tone="bg-orange-400" />
                <Score label={t.result.socialImpact} value={result.socialImpactScore} tone="bg-civic-cyan" />
              </div>

              <div className="mt-6 grid gap-4">
                <TextPanel title={t.admin.aiDescription} text={result.aiGeneratedDescription} />
                <TextPanel title={t.result.explanation} text={result.explanation} />
                <TextPanel title={t.result.complaint} text={result.fullReportForAkimat} />
              </div>

              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendToDashboard}
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-6 py-4 text-base font-extrabold text-white shadow-glow transition hover:bg-ink/90"
              >
                <Send className="size-5" />
                {sentIssueId ? t.result.sent : t.result.send}
              </motion.button>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

function Metric({
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
        <span className="text-xs font-extrabold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <p className="mt-3 text-xl font-extrabold leading-tight text-ink">{value}</p>
    </div>
  );
}

function Score({
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
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold uppercase tracking-[0.13em] text-ink/48">
          {label}
        </span>
        <span className="text-xl font-extrabold text-ink">{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-ink/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${tone}`}
        />
      </div>
    </div>
  );
}

function TextPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-ink/[0.035] p-5">
      <div className="flex items-center gap-2 text-ink/42">
        <ClipboardList className="size-4" />
        <p className="text-sm font-extrabold uppercase tracking-[0.16em]">
          {title}
        </p>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/70">{text}</p>
    </div>
  );
}
