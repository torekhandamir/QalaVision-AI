"use client";

import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { DeadlineLevel } from "@/lib/ai-analysis";
import { deadlineText, districtLabels, problemLabels } from "@/lib/ai-analysis";
import { formatKZT } from "@/lib/format";
import type { IssueRecord } from "@/lib/demo-data";
import { useIssues } from "./issue-provider";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";

export function RiskMapPage() {
  const { issues } = useIssues();
  const { t, locale } = useLanguage();

  return (
    <main className="min-h-screen bg-pearl px-4 pb-20 pt-32 text-ink">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-ink/45">
              {t.nav.map}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
              {t.sections.mapTitle}
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink/62">
              {t.sections.mapSubtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="light-glass mt-10 overflow-hidden rounded-[2rem] p-3">
            <div className="h-[72vh] min-h-[520px] overflow-hidden rounded-[1.5rem]">
              <MapContainer
                center={[43.2389, 76.8897]}
                zoom={11}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {issues.map((issue) => (
                  <IssueMarker key={issue.id} issue={issue} />
                ))}
              </MapContainer>
            </div>
          </div>
        </Reveal>

        <div className="mt-5 flex flex-wrap gap-3">
          {(["Critical", "High", "Medium", "Low"] as DeadlineLevel[]).map(
            (level) => (
              <span
                key={level}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink/70"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ background: markerColor(level) }}
                />
                {level}
              </span>
            )
          )}
        </div>
      </div>
    </main>
  );

  function IssueMarker({ issue }: { issue: IssueRecord }) {
    return (
      <CircleMarker
        center={[issue.location.lat, issue.location.lng]}
        radius={10}
        pathOptions={{
          color: "#ffffff",
          weight: 2,
          fillColor: markerColor(issue.deadlineLevel),
          fillOpacity: 0.92
        }}
      >
        <Popup>
          <div className="w-56 font-sans text-ink">
            <p className="text-sm font-extrabold">
              {problemLabels[locale][issue.detectedProblem]}
            </p>
            <p className="mt-1 text-xs text-ink/62">
              {districtLabels[locale][issue.district]}
            </p>
            <div className="mt-3 grid gap-1 text-xs">
              <span>
                {t.dashboard.urgency}: <b>{issue.urgencyScore}/100</b>
              </span>
              <span>
                {t.dashboard.budget}:{" "}
                <b>{formatKZT(issue.estimatedRepairCostKZT, locale)}</b>
              </span>
              <span>
                {t.dashboard.deadline}:{" "}
                <b>{deadlineText[locale][issue.deadlineLevel]}</b>
              </span>
            </div>
            <Link
              href={`/admin/issues/${issue.id}`}
              className="mt-3 inline-flex w-full justify-center rounded-xl bg-ink px-3 py-2 text-xs font-extrabold text-white"
            >
              {t.dashboard.openIssue}
            </Link>
          </div>
        </Popup>
      </CircleMarker>
    );
  }
}

function markerColor(level: DeadlineLevel) {
  switch (level) {
    case "Critical":
      return "#ef4444";
    case "High":
      return "#fb923c";
    case "Medium":
      return "#facc15";
    case "Low":
      return "#22c55e";
  }
}
