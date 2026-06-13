"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type {
  AIAnalysisResult,
  AnalyzeIssueFormData
} from "@/lib/ai-analysis";
import { demoIssues, type IssueRecord } from "@/lib/demo-data";

export type LatestAnalysis = {
  result: AIAnalysisResult;
  formData: AnalyzeIssueFormData;
  photoDataUrl: string | null;
  sentIssueId?: string;
};

type IssueContextValue = {
  issues: IssueRecord[];
  latestAnalysis: LatestAnalysis | null;
  setLatestAnalysis: (analysis: LatestAnalysis) => void;
  addIssue: (issue: IssueRecord) => void;
  updateIssueStatus: (issueId: string, status: IssueRecord["status"]) => void;
  markLatestSent: (issueId: string) => void;
  getIssueById: (issueId: string) => IssueRecord | undefined;
};

const IssueContext = createContext<IssueContextValue | null>(null);
const issuesStorageKey = "qalavision.savedIssues";
const latestStorageKey = "qalavision.latestAnalysis";

export function IssueProvider({ children }: { children: ReactNode }) {
  const [savedIssues, setSavedIssues] = useState<IssueRecord[]>([]);
  const [latestAnalysisState, setLatestAnalysisState] =
    useState<LatestAnalysis | null>(null);

  useEffect(() => {
    try {
      const issuesJson = window.localStorage.getItem(issuesStorageKey);
      const latestJson = window.localStorage.getItem(latestStorageKey);
      if (issuesJson) setSavedIssues(JSON.parse(issuesJson) as IssueRecord[]);
      if (latestJson) {
        setLatestAnalysisState(JSON.parse(latestJson) as LatestAnalysis);
      }
    } catch {
      setSavedIssues([]);
      setLatestAnalysisState(null);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(issuesStorageKey, JSON.stringify(savedIssues));
  }, [savedIssues]);

  useEffect(() => {
    if (latestAnalysisState) {
      window.localStorage.setItem(
        latestStorageKey,
        JSON.stringify(latestAnalysisState)
      );
    }
  }, [latestAnalysisState]);

  const issues = useMemo(() => {
    const savedIds = new Set(savedIssues.map((issue) => issue.id));
    return [
      ...savedIssues,
      ...demoIssues.filter((issue) => !savedIds.has(issue.id))
    ];
  }, [savedIssues]);

  const addIssue = useCallback((issue: IssueRecord) => {
    setSavedIssues((currentIssues) => {
      if (currentIssues.some((currentIssue) => currentIssue.id === issue.id)) {
        return currentIssues;
      }

      return [issue, ...currentIssues];
    });
  }, []);

  const updateIssueStatus = useCallback(
    (issueId: string, status: IssueRecord["status"]) => {
      setSavedIssues((currentIssues) => {
        const existingIssue = currentIssues.find((issue) => issue.id === issueId);
        if (existingIssue) {
          return currentIssues.map((issue) =>
            issue.id === issueId ? { ...issue, status } : issue
          );
        }

        const demoIssue = demoIssues.find((issue) => issue.id === issueId);
        return demoIssue ? [{ ...demoIssue, status }, ...currentIssues] : currentIssues;
      });
    },
    []
  );

  const markLatestSent = useCallback((issueId: string) => {
    setLatestAnalysisState((current) =>
      current ? { ...current, sentIssueId: issueId } : current
    );
  }, []);

  const getIssueById = useCallback(
    (issueId: string) => issues.find((issue) => issue.id === issueId),
    [issues]
  );

  const value = useMemo(
    () => ({
      issues,
      latestAnalysis: latestAnalysisState,
      setLatestAnalysis: setLatestAnalysisState,
      addIssue,
      updateIssueStatus,
      markLatestSent,
      getIssueById
    }),
    [
      addIssue,
      getIssueById,
      issues,
      latestAnalysisState,
      markLatestSent,
      updateIssueStatus
    ]
  );

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error("useIssues must be used inside IssueProvider");
  }

  return context;
}
