"use client";

import dynamic from "next/dynamic";
import { HeroSection } from "@/components/hero-section";
import { useIssues } from "@/components/issue-provider";
import { SubmissionSection } from "@/components/submission-section";
import { DashboardSection } from "@/components/dashboard-section";

const RiskMapSection = dynamic(
  () => import("@/components/risk-map-page").then((mod) => mod.RiskMapSection),
  {
    ssr: false,
    loading: () => (
      <section id="map" className="bg-pearl px-4 py-24 text-ink">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-glass">
          Loading map...
        </div>
      </section>
    )
  }
);

export default function HomePage() {
  const { issues } = useIssues();

  return (
    <main className="min-h-screen bg-pearl">
      <HeroSection issues={issues} />
      <SubmissionSection />
      <DashboardSection issues={issues} />
      <RiskMapSection />
    </main>
  );
}
