"use client";

import { useCallback, useState } from "react";
import { DashboardSection } from "@/components/dashboard-section";
import { HeroSection } from "@/components/hero-section";
import { LanguageProvider } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";
import { SubmissionSection } from "@/components/submission-section";
import { mockIssues, type IssueRecord } from "@/lib/mock-data";

export default function Home() {
  return (
    <LanguageProvider>
      <QalaVisionApp />
    </LanguageProvider>
  );
}

function QalaVisionApp() {
  const [issues, setIssues] = useState<IssueRecord[]>(mockIssues);

  const handleIssueCreated = useCallback((issue: IssueRecord) => {
    setIssues((currentIssues) => [issue, ...currentIssues]);
  }, []);

  return (
    <main className="min-h-screen bg-pearl">
      <Navbar />
      <HeroSection issues={issues} />
      <SubmissionSection onIssueCreated={handleIssueCreated} />
      <DashboardSection issues={issues} />
    </main>
  );
}
