"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Filter,
  Layers3,
  TrendingUp
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  deadlineText,
  districtLabels,
  districts,
  problemLabels,
  problemTypes,
  type DeadlineLevel,
  type DistrictId
} from "@/lib/ai-analysis";
import { formatKZT } from "@/lib/format";
import { statusLabels } from "@/lib/i18n";
import type { IssueRecord } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";

type DashboardSectionProps = {
  issues: IssueRecord[];
};

const urgencyOrder: DeadlineLevel[] = ["Critical", "High", "Medium", "Low"];
const chartColors = ["#ef4444", "#fb923c", "#facc15", "#22c55e", "#38bdf8"];

export function DashboardSection({ issues }: DashboardSectionProps) {
  const { t, locale } = useLanguage();
  const [districtFilter, setDistrictFilter] = useState<"all" | DistrictId>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | DeadlineLevel>("all");

  const filteredIssues = useMemo(
    () =>
      issues.filter((issue) => {
        const districtMatch =
          districtFilter === "all" || issue.district === districtFilter;
        const urgencyMatch =
          urgencyFilter === "all" || issue.deadlineLevel === urgencyFilter;
        return districtMatch && urgencyMatch;
      }),
    [districtFilter, issues, urgencyFilter]
  );

  const metrics = useMemo(() => {
    const totalBudget = filteredIssues.reduce(
      (sum, issue) => sum + issue.estimatedRepairCostKZT,
      0
    );
    const averageUrgency = filteredIssues.length
      ? Math.round(
          filteredIssues.reduce((sum, issue) => sum + issue.urgencyScore, 0) /
            filteredIssues.length
        )
      : 0;

    return {
      total: filteredIssues.length,
      critical: filteredIssues.filter((issue) => issue.deadlineLevel === "Critical")
        .length,
      totalBudget,
      averageUrgency
    };
  }, [filteredIssues]);

  const byDistrict = districts.map((district) => ({
    name: districtLabels[locale][district],
    issues: filteredIssues.filter((issue) => issue.district === district).length
  }));

  const urgencyDistribution = urgencyOrder.map((level) => ({
    name: dashboardUrgencyLabel(t.dashboard, level),
    value: filteredIssues.filter((issue) => issue.deadlineLevel === level).length
  }));

  const budgetByCategory = problemTypes
    .map((problem) => ({
      name: problemLabels[locale][problem],
      budget: filteredIssues
        .filter((issue) => issue.detectedProblem === problem)
        .reduce((sum, issue) => sum + issue.estimatedRepairCostKZT, 0)
    }))
    .filter((item) => item.budget > 0);

  const priorityQueue = [...filteredIssues]
    .sort(
      (a, b) =>
        b.urgencyScore +
        b.akimatRelevanceScore +
        b.socialImpactScore -
        (a.urgencyScore + a.akimatRelevanceScore + a.socialImpactScore)
    )
    .slice(0, 6);

  const numberLocale = locale === "en" ? "en-US" : "ru-RU";

  return (
    <main className="min-h-screen bg-ink px-4 pb-20 pt-32 text-white">
      <div className="absolute inset-0 -z-0 bg-radial-grid" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/42">
                {t.sections.dashboardKicker}
              </p>
              <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
                {t.sections.dashboardTitle}
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/62">
                {t.sections.dashboardSubtitle}
              </p>
            </div>

            <div className="glass flex flex-col gap-3 rounded-3xl p-4 sm:flex-row">
              <FilterSelect
                label={t.dashboard.districtFilter}
                value={districtFilter}
                onChange={(value) => setDistrictFilter(value as "all" | DistrictId)}
                options={[
                  { value: "all", label: t.dashboard.allDistricts },
                  ...districts.map((district) => ({
                    value: district,
                    label: districtLabels[locale][district]
                  }))
                ]}
              />
              <FilterSelect
                label={t.dashboard.urgencyFilter}
                value={urgencyFilter}
                onChange={(value) =>
                  setUrgencyFilter(value as "all" | DeadlineLevel)
                }
                options={[
                  { value: "all", label: t.dashboard.allUrgency },
                  ...urgencyOrder.map((level) => ({
                    value: level,
                    label: dashboardUrgencyLabel(t.dashboard, level)
                  }))
                ]}
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={<Layers3 className="size-6 text-civic-cyan" />}
            label={t.dashboard.totalIssues}
            value={<AnimatedNumber value={metrics.total} locale={numberLocale} />}
          />
          <KpiCard
            icon={<AlertTriangle className="size-6 text-red-400" />}
            label={t.dashboard.criticalIssues}
            value={<AnimatedNumber value={metrics.critical} locale={numberLocale} />}
          />
          <KpiCard
            icon={<Banknote className="size-6 text-civic-gold" />}
            label={t.dashboard.totalBudget}
            value={
              <AnimatedNumber
                value={metrics.totalBudget}
                locale={numberLocale}
                compact
              />
            }
            suffix=" KZT"
          />
          <KpiCard
            icon={<TrendingUp className="size-6 text-civic-mint" />}
            label={t.dashboard.averageUrgency}
            value={
              <AnimatedNumber
                value={metrics.averageUrgency}
                locale={numberLocale}
                suffix="/100"
              />
            }
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Reveal delay={0.08}>
            <Panel title={t.dashboard.charts}>
              <div className="grid gap-5 lg:grid-cols-2">
                <ChartBox title={t.dashboard.byDistrict}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byDistrict} margin={{ left: -10, right: 12 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
                      <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.07)" }} />
                      <Legend wrapperStyle={{ color: "#fff" }} />
                      <Bar name={t.dashboard.totalIssues} dataKey="issues" radius={[8, 8, 2, 2]} fill="#38bdf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>

                <ChartBox title={t.dashboard.urgencyDistribution}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={urgencyDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={82}
                        paddingAngle={3}
                        label
                      >
                        {urgencyDistribution.map((entry, index) => (
                          <Cell key={entry.name} fill={chartColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ color: "#fff", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartBox>

                <div className="lg:col-span-2">
                  <ChartBox title={t.dashboard.budgetByCategory} tall>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetByCategory} margin={{ left: 8, right: 12 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
                        <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                        <YAxis
                          tick={axisTick}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) =>
                            new Intl.NumberFormat(numberLocale, {
                              notation: "compact"
                            }).format(Number(value))
                          }
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(value) => formatKZT(Number(value), locale)}
                          cursor={{ fill: "rgba(255,255,255,0.07)" }}
                        />
                        <Legend wrapperStyle={{ color: "#fff" }} />
                        <Bar name={t.dashboard.budget} dataKey="budget" radius={[8, 8, 2, 2]}>
                          {budgetByCategory.map((entry, index) => (
                            <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartBox>
                </div>
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.14}>
            <Panel title={t.dashboard.topIssues} icon={<CheckCircle2 className="size-5" />}>
              <div className="space-y-3">
                {priorityQueue.map((issue, index) => (
                  <Link
                    key={issue.id}
                    href={`/admin/issues/${issue.id}`}
                    className="block rounded-3xl border border-white/10 bg-white/7 p-4 transition hover:border-civic-cyan/50 hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/42">
                          #{index + 1} · {issue.id}
                        </p>
                        <p className="mt-2 text-lg font-extrabold text-white">
                          {problemLabels[locale][issue.detectedProblem]}
                        </p>
                        <p className="mt-1 text-sm text-white/54">
                          {districtLabels[locale][issue.district]} ·{" "}
                          {deadlineText[locale][issue.deadlineLevel]}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-sm font-extrabold",
                          urgencyBadge(issue.deadlineLevel)
                        )}
                      >
                        {issue.urgencyScore}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Panel>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <Panel title={t.dashboard.table}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-separate border-spacing-y-2 text-left text-sm">
                <thead>
                  <tr className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/42">
                    <th className="px-3 py-2">{t.dashboard.issue}</th>
                    <th className="px-3 py-2">{t.dashboard.area}</th>
                    <th className="px-3 py-2">{t.result.detectedProblem}</th>
                    <th className="px-3 py-2">{t.dashboard.urgency}</th>
                    <th className="px-3 py-2">{t.dashboard.relevance}</th>
                    <th className="px-3 py-2">{t.dashboard.socialImpact}</th>
                    <th className="px-3 py-2">{t.dashboard.budget}</th>
                    <th className="px-3 py-2">{t.dashboard.deadline}</th>
                    <th className="px-3 py-2">{t.dashboard.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="rounded-2xl bg-white/8 text-white/78">
                      <td className="rounded-l-2xl px-3 py-3 font-extrabold text-white">
                        <Link href={`/admin/issues/${issue.id}`} className="hover:text-civic-cyan">
                          {issue.id}
                        </Link>
                      </td>
                      <td className="px-3 py-3">{districtLabels[locale][issue.district]}</td>
                      <td className="px-3 py-3">{problemLabels[locale][issue.detectedProblem]}</td>
                      <td className="px-3 py-3">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-extrabold", urgencyBadge(issue.deadlineLevel))}>
                          {issue.urgencyScore}
                        </span>
                      </td>
                      <td className="px-3 py-3">{issue.akimatRelevanceScore}</td>
                      <td className="px-3 py-3">{issue.socialImpactScore}</td>
                      <td className="px-3 py-3">{formatKZT(issue.estimatedRepairCostKZT, locale)}</td>
                      <td className="px-3 py-3">{deadlineText[locale][issue.deadlineLevel]}</td>
                      <td className="rounded-r-2xl px-3 py-3">{statusLabels[locale][issue.status]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </Reveal>
      </div>
    </main>
  );
}

const axisTick = { fill: "rgba(255,255,255,0.78)", fontSize: 11 };

const tooltipStyle = {
  background: "rgba(7,16,18,0.96)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "14px",
  color: "#fff",
  boxShadow: "0 20px 60px rgba(0,0,0,0.32)"
};

function FilterSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="min-w-48">
      <span className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white/52">
        <Filter className="size-3" />
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-white/16 bg-white/12 px-3 text-sm font-bold text-white outline-none focus:border-civic-cyan/60"
      >
        {options.map((option) => (
          <option className="text-ink" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function KpiCard({
  icon,
  label,
  value,
  suffix = ""
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  suffix?: string;
}) {
  return (
    <Reveal>
      <div className="rounded-3xl border border-white/14 bg-white/[0.09] p-5 shadow-glass backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/12">
            {icon}
          </span>
          <span className="size-2 rounded-full bg-civic-mint shadow-[0_0_20px_rgba(114,246,184,0.85)]" />
        </div>
        <p className="text-3xl font-extrabold text-white">
          {value}
          {suffix}
        </p>
        <p className="mt-2 text-sm font-semibold text-white/62">{label}</p>
      </div>
    </Reveal>
  );
}

function Panel({
  title,
  icon,
  children
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-[2rem] border border-white/14 bg-white/[0.08] p-5 shadow-glass backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        {icon ? (
          <span className="grid size-10 place-items-center rounded-2xl bg-white/12 text-civic-cyan">
            {icon}
          </span>
        ) : null}
        <h2 className="text-xl font-extrabold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ChartBox({
  title,
  children,
  tall = false
}: {
  title: string;
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/12 bg-ink/54 p-4",
        tall ? "h-[360px]" : "h-[320px]"
      )}
    >
      <p className="mb-4 text-sm font-extrabold text-white/84">{title}</p>
      <div className="h-[calc(100%-2.2rem)]">{children}</div>
    </div>
  );
}

function urgencyBadge(level: DeadlineLevel) {
  switch (level) {
    case "Critical":
      return "bg-red-500 text-white";
    case "High":
      return "bg-orange-400 text-ink";
    case "Medium":
      return "bg-yellow-300 text-ink";
    default:
      return "bg-green-400 text-ink";
  }
}

function dashboardUrgencyLabel(
  labels: {
    critical: string;
    high: string;
    medium: string;
    low: string;
  },
  level: DeadlineLevel
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
