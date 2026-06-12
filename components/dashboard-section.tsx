"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Filter,
  Layers3,
  MapPinned,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { statusLabels } from "@/lib/i18n";
import { formatKZT } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IssueRecord } from "@/lib/mock-data";
import { AnimatedNumber } from "./animated-number";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";

type DashboardSectionProps = {
  issues: IssueRecord[];
};

const urgencyOrder: DeadlineLevel[] = ["Critical", "High", "Medium", "Low"];
const chartColors = ["#65e3ff", "#ff8d7a", "#f8d36b", "#72f6b8", "#9b8cff"];

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
        b.urgencyScore + b.akimateRelevanceScore -
        (a.urgencyScore + a.akimateRelevanceScore)
    )
    .slice(0, 5);

  const numberLocale = locale === "en" ? "en-US" : "ru-RU";

  return (
    <section
      id="dashboard"
      className="relative overflow-hidden bg-ink px-4 py-24 text-white"
    >
      <div className="absolute inset-0 bg-radial-grid" />
      <div className="grid-mask absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-white/42">
                {t.sections.dashboardKicker}
              </p>
              <h2 className="mt-4 text-balance text-4xl font-black leading-tight sm:text-6xl">
                {t.sections.dashboardTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/62">
                {t.sections.dashboardSubtitle}
              </p>
            </div>

            <div className="glass flex flex-col gap-3 rounded-3xl p-4 sm:flex-row">
              <label className="min-w-48">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/45">
                  <Filter className="size-3" />
                  {t.dashboard.districtFilter}
                </span>
                <select
                  value={districtFilter}
                  onChange={(event) =>
                    setDistrictFilter(event.target.value as "all" | DistrictId)
                  }
                  className="h-12 w-full rounded-2xl border border-white/12 bg-white/10 px-3 text-sm font-bold text-white outline-none focus:border-civic-cyan/60"
                >
                  <option className="text-ink" value="all">
                    {t.dashboard.allDistricts}
                  </option>
                  {districts.map((district) => (
                    <option className="text-ink" key={district} value={district}>
                      {districtLabels[locale][district]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="min-w-44">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/45">
                  <TrendingUp className="size-3" />
                  {t.dashboard.urgencyFilter}
                </span>
                <select
                  value={urgencyFilter}
                  onChange={(event) =>
                    setUrgencyFilter(event.target.value as "all" | DeadlineLevel)
                  }
                  className="h-12 w-full rounded-2xl border border-white/12 bg-white/10 px-3 text-sm font-bold text-white outline-none focus:border-civic-cyan/60"
                >
                  <option className="text-ink" value="all">
                    {t.dashboard.allUrgency}
                  </option>
                  {urgencyOrder.map((level) => (
                    <option className="text-ink" key={level} value={level}>
                      {dashboardUrgencyLabel(t.dashboard, level)}
                    </option>
                  ))}
                </select>
              </label>
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
            icon={<AlertTriangle className="size-6 text-civic-coral" />}
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

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={0.08}>
            <Panel title={t.dashboard.charts}>
              <div className="grid gap-5 lg:grid-cols-2">
                <ChartBox title={t.dashboard.byDistrict}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byDistrict}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "rgba(255,255,255,0.62)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                      <Bar dataKey="issues" radius={[10, 10, 2, 2]} fill="#65e3ff" />
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
                      >
                        {urgencyDistribution.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartBox>

                <div className="lg:col-span-2">
                  <ChartBox title={t.dashboard.budgetByCategory} wide>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetByCategory}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "rgba(255,255,255,0.62)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
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
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        />
                        <Bar dataKey="budget" radius={[10, 10, 2, 2]}>
                          {budgetByCategory.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={chartColors[index % chartColors.length]}
                            />
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
            <Panel title={t.dashboard.map} icon={<MapPinned className="size-5" />}>
              <RiskMap
                issues={filteredIssues}
                cityLabel={locale === "en" ? "Almaty" : "Алматы"}
              />
            </Panel>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <Reveal delay={0.08}>
            <Panel title={t.dashboard.topIssues} icon={<CheckCircle2 className="size-5" />}>
              <div className="space-y-3">
                {priorityQueue.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    whileHover={{ x: 4 }}
                    className="rounded-3xl border border-white/10 bg-white/7 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">
                          #{index + 1} · {issue.id}
                        </p>
                        <p className="mt-2 text-lg font-black text-white">
                          {problemLabels[locale][issue.detectedProblem]}
                        </p>
                        <p className="mt-1 text-sm text-white/54">
                          {districtLabels[locale][issue.district]} ·{" "}
                          {deadlineText[locale][issue.deadlineLevel]}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-sm font-black",
                          urgencyBadge(issue.deadlineLevel)
                        )}
                      >
                        {issue.urgencyScore}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.14}>
            <Panel title={t.dashboard.table}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="text-xs font-black uppercase tracking-[0.14em] text-white/38">
                      <th className="px-3 py-2">{t.dashboard.issue}</th>
                      <th className="px-3 py-2">{t.dashboard.area}</th>
                      <th className="px-3 py-2">{t.result.detectedProblem}</th>
                      <th className="px-3 py-2">{t.dashboard.urgency}</th>
                      <th className="px-3 py-2">{t.dashboard.relevance}</th>
                      <th className="px-3 py-2">{t.dashboard.budget}</th>
                      <th className="px-3 py-2">{t.dashboard.deadline}</th>
                      <th className="px-3 py-2">{t.dashboard.status}</th>
                      <th className="px-3 py-2">{t.dashboard.photo}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id} className="rounded-2xl bg-white/7 text-white/76">
                        <td className="rounded-l-2xl px-3 py-3 font-black text-white">
                          {issue.id}
                        </td>
                        <td className="px-3 py-3">
                          {districtLabels[locale][issue.district]}
                        </td>
                        <td className="px-3 py-3">
                          {problemLabels[locale][issue.detectedProblem]}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-black",
                              urgencyBadge(issue.deadlineLevel)
                            )}
                          >
                            {issue.urgencyScore}
                          </span>
                        </td>
                        <td className="px-3 py-3">{issue.akimateRelevanceScore}</td>
                        <td className="px-3 py-3">
                          {formatKZT(issue.estimatedRepairCostKZT, locale)}
                        </td>
                        <td className="px-3 py-3">
                          {deadlineText[locale][issue.deadlineLevel]}
                        </td>
                        <td className="px-3 py-3">
                          {statusLabels[locale][issue.status]}
                        </td>
                        <td className="rounded-r-2xl px-3 py-3">
                          {issue.hasPhoto ? t.misc.yes : t.misc.no}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const tooltipStyle = {
  background: "rgba(7,16,18,0.94)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "18px",
  color: "#fff",
  boxShadow: "0 20px 60px rgba(0,0,0,0.28)"
};

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
      <motion.div whileHover={{ y: -5 }} className="glass rounded-3xl p-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/10">
            {icon}
          </span>
          <span className="size-2 rounded-full bg-civic-mint shadow-[0_0_20px_rgba(114,246,184,0.85)]" />
        </div>
        <p className="text-3xl font-black text-white">
          {value}
          {suffix}
        </p>
        <p className="mt-2 text-sm font-semibold text-white/52">{label}</p>
      </motion.div>
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
    <div className="glass rounded-[2rem] p-5">
      <div className="mb-5 flex items-center gap-3">
        {icon ? (
          <span className="grid size-10 place-items-center rounded-2xl bg-white/10 text-civic-cyan">
            {icon}
          </span>
        ) : null}
        <h3 className="text-xl font-black text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ChartBox({
  title,
  children,
  wide = false
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/7 p-4",
        wide ? "h-[320px]" : "h-[300px]"
      )}
    >
      <p className="mb-4 text-sm font-black text-white/74">{title}</p>
      <div className="h-[calc(100%-2.2rem)]">{children}</div>
    </div>
  );
}

function RiskMap({
  issues,
  cityLabel
}: {
  issues: IssueRecord[];
  cityLabel: string;
}) {
  return (
    <div className="relative h-[430px] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(101,227,255,0.14),rgba(114,246,184,0.08),rgba(255,141,122,0.11))]">
      <div className="absolute inset-0 opacity-60">
        <span className="absolute left-[8%] top-[28%] h-px w-[85%] rotate-[-12deg] bg-white/24" />
        <span className="absolute left-[12%] top-[52%] h-px w-[78%] rotate-[9deg] bg-white/18" />
        <span className="absolute left-[45%] top-[8%] h-[86%] w-px rotate-[18deg] bg-white/20" />
        <span className="absolute left-[66%] top-[12%] h-[76%] w-px rotate-[-22deg] bg-white/16" />
      </div>

      <div className="absolute left-5 top-5 rounded-full bg-ink/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/68 backdrop-blur-xl">
        {cityLabel}
      </div>

      {issues.map((issue) => {
        const position = mapPosition(issue.location.lat, issue.location.lng);
        return (
          <motion.span
            key={issue.id}
            title={`${issue.id} · ${issue.urgencyScore}`}
            className={cn(
              "absolute grid size-5 place-items-center rounded-full border border-white/60 shadow-glow",
              mapPointColor(issue.deadlineLevel)
            )}
            style={{ left: `${position.left}%`, top: `${position.top}%` }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.45 }}
            viewport={{ once: true }}
          >
            <span className="size-2 rounded-full bg-white" />
          </motion.span>
        );
      })}
    </div>
  );
}

function mapPosition(lat: number, lng: number) {
  const minLat = 43.18;
  const maxLat = 43.37;
  const minLng = 76.74;
  const maxLng = 77.08;
  const left = ((lng - minLng) / (maxLng - minLng)) * 100;
  const top = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
  return {
    left: Math.max(6, Math.min(92, left)),
    top: Math.max(10, Math.min(88, top))
  };
}

function urgencyBadge(level: DeadlineLevel) {
  switch (level) {
    case "Critical":
      return "bg-civic-coral text-ink";
    case "High":
      return "bg-civic-gold text-ink";
    case "Medium":
      return "bg-civic-cyan text-ink";
    default:
      return "bg-white/12 text-white";
  }
}

function mapPointColor(level: DeadlineLevel) {
  switch (level) {
    case "Critical":
      return "bg-civic-coral";
    case "High":
      return "bg-civic-gold";
    case "Medium":
      return "bg-civic-cyan";
    default:
      return "bg-white/45";
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
