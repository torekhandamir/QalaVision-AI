"use client";

import { DashboardSection } from "@/components/dashboard-section";
import { useIssues } from "@/components/issue-provider";

export default function DashboardPage() {
  const { issues } = useIssues();

  return <DashboardSection issues={issues} />;
}
