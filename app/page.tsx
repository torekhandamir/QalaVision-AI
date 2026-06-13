"use client";

import { HeroSection } from "@/components/hero-section";
import { useIssues } from "@/components/issue-provider";

export default function HomePage() {
  const { issues } = useIssues();

  return (
    <main className="min-h-screen bg-pearl">
      <HeroSection issues={issues} />
    </main>
  );
}
