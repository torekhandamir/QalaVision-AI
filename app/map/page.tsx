"use client";

import dynamic from "next/dynamic";

const RiskMapPage = dynamic(
  () => import("@/components/risk-map-page").then((mod) => mod.RiskMapPage),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-pearl px-4 pb-20 pt-32">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 text-ink shadow-glass">
          Loading map...
        </div>
      </main>
    )
  }
);

export default function MapPage() {
  return <RiskMapPage />;
}
