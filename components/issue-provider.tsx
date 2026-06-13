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
import { demoIssues, type IssueRecord } from "@/lib/demo-data";

type IssueContextValue = {
  issues: IssueRecord[];
  addIssue: (issue: IssueRecord) => void;
  updateIssueStatus: (issueId: string, status: IssueRecord["status"]) => void;
  getIssueById: (issueId: string) => IssueRecord | undefined;
};

const IssueContext = createContext<IssueContextValue | null>(null);
const issuesStorageKey = "qalavision.savedIssues";

export function IssueProvider({ children }: { children: ReactNode }) {
  const [savedIssues, setSavedIssues] = useState<IssueRecord[]>([]);

  useEffect(() => {
    try {
      const issuesJson = window.localStorage.getItem(issuesStorageKey);
      if (issuesJson) setSavedIssues(JSON.parse(issuesJson) as IssueRecord[]);
    } catch {
      setSavedIssues([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(issuesStorageKey, JSON.stringify(savedIssues));
  }, [savedIssues]);

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

  const getIssueById = useCallback(
    (issueId: string) => issues.find((issue) => issue.id === issueId),
    [issues]
  );

  const value = useMemo(
    () => ({
      issues,
      addIssue,
      updateIssueStatus,
      getIssueById
    }),
    [addIssue, getIssueById, issues, updateIssueStatus]
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
