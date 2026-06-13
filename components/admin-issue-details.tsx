"use client";

/* eslint-disable @next/next/no-img-element -- Issue photos can be local generated assets or user data URLs. */

import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, ClipboardList, MapPin, WalletCards } from "lucide-react";
import {
  deadlineText,
  districtLabels,
  problemLabels,
  type IssueStatus
} from "@/lib/ai-analysis";
import { formatKZT } from "@/lib/format";
import { statusLabels } from "@/lib/i18n";
import { useIssues } from "./issue-provider";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";

export function AdminIssueDetails() {
  const params = useParams<{ id: string }>();
  const issueId = params.id;
  const { getIssueById, updateIssueStatus } = useIssues();
  const { t, locale } = useLanguage();
  const issue = getIssueById(issueId);

  if (!issue) {
    return (
      <main className="min-h-screen bg-pearl px-4 pb-20 pt-32">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-glass">
          <h1 className="text-3xl font-extrabold text-ink">Issue not found</h1>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-extrabold text-white"
          >
            <ArrowLeft className="size-4" />
            {t.nav.dashboard}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pearl px-4 pb-20 pt-32 text-ink">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-ink/56 transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            {t.nav.dashboard}
          </Link>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-ink/45">
                {issue.id}
              </p>
              <h1 className="mt-3 text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
                {problemLabels[locale][issue.detectedProblem]}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/62">
                {t.sections.adminSubtitle}
              </p>
            </div>
            <label className="w-full max-w-xs">
              <span className="mb-2 block text-sm font-extrabold text-ink/56">
                {t.admin.status}
              </span>
              <select
                value={issue.status}
                onChange={(event) =>
                  updateIssueStatus(issue.id, event.target.value as IssueStatus)
                }
                className="h-14 w-full rounded-2xl border border-ink/10 bg-white px-4 font-bold outline-none focus:border-ink/30 focus:ring-4 focus:ring-civic-cyan/20"
              >
                {(["pending", "in_progress", "completed"] as IssueStatus[]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {statusLabels[locale][status]}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <Reveal delay={0.08}>
            <div className="light-glass rounded-[2rem] p-5">
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-ink/45">
                {t.admin.evidence}
              </p>
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-ink">
                {issue.photoUrl ? (
                  <img
                    src={issue.photoUrl}
                    alt={t.admin.evidence}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center text-white/60">
                    {t.admin.noEvidence}
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3">
                <InfoRow
                  icon={<MapPin className="size-5" />}
                  label={t.admin.address}
                  value={issue.address}
                />
                <InfoRow
                  icon={<ClipboardList className="size-5" />}
                  label={t.admin.district}
                  value={districtLabels[locale][issue.district]}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="light-glass rounded-[2rem] p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ScoreCard
                  label={t.result.urgency}
                  value={`${issue.urgencyScore}/100`}
                  icon={<AlertTriangle className="size-5" />}
                />
                <ScoreCard
                  label={t.result.relevance}
                  value={`${issue.akimatRelevanceScore}/100`}
                  icon={<ClipboardList className="size-5" />}
                />
                <ScoreCard
                  label={t.result.socialImpact}
                  value={`${issue.socialImpactScore}/100`}
                  icon={<ClipboardList className="size-5" />}
                />
                <ScoreCard
                  label={t.result.cost}
                  value={formatKZT(issue.estimatedRepairCostKZT, locale)}
                  icon={<WalletCards className="size-5" />}
                />
              </div>

              <div className="mt-5 rounded-3xl border border-ink/8 bg-white/72 p-5">
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-ink/42">
                  {t.result.deadline}
                </p>
                <p className="mt-2 text-2xl font-extrabold text-ink">
                  {deadlineText[locale][issue.deadlineLevel]}
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                <TextPanel title={t.admin.aiDescription} text={issue.aiGeneratedDescription} />
                <TextPanel title={t.admin.recommendation} text={issue.repairRecommendation} />
                <TextPanel title={t.admin.report} text={issue.fullReportForAkimat} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
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
      <div className="flex items-center gap-2 text-ink/42">
        {icon}
        <span className="text-xs font-extrabold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function ScoreCard({
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
      <div className="flex items-center gap-2 text-ink/42">
        {icon}
        <span className="text-xs font-extrabold uppercase tracking-[0.13em]">
          {label}
        </span>
      </div>
      <p className="mt-3 text-xl font-extrabold text-ink">{value}</p>
    </div>
  );
}

function TextPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-ink/[0.035] p-5">
      <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-ink/42">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-ink/70">{text}</p>
    </div>
  );
}
