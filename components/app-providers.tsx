"use client";

import type { ReactNode } from "react";
import { IssueProvider } from "./issue-provider";
import { LanguageProvider } from "./language-provider";
import { Navbar } from "./navbar";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <IssueProvider>
        <Navbar />
        {children}
      </IssueProvider>
    </LanguageProvider>
  );
}
