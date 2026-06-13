import type { AnalyzeIssueFormData } from "./ai-analysis";
import { classifyDefectBaseline } from "./baseline-classifier";
import {
  defectTaxonomy,
  isDefectClass,
  type DefectClass
} from "./defect-taxonomy";

export type RawAiResult = {
  detectedProblem?: unknown;
  defectClass?: unknown;
  confidence?: unknown;
  urgencyScore?: unknown;
  akimatRelevanceScore?: unknown;
  socialImpactScore?: unknown;
  explanation?: unknown;
  aiGeneratedDescription?: unknown;
  fullReportForAkimat?: unknown;
  repairRecommendation?: unknown;
};

export type NormalizedAiResult = {
  detectedProblem: DefectClass;
  defectClass: DefectClass;
  confidence: number;
  baselineClass: DefectClass;
  baselineConfidence: number;
  matchedKeywords: string[];
  urgencyScore?: number;
  akimatRelevanceScore?: number;
  socialImpactScore?: number;
  explanation: string;
  aiGeneratedDescription: string;
  fullReportForAkimat: string;
  repairRecommendation: string;
  requiresHumanReview: boolean;
};

export function normalizeAiResult(
  rawAiResult: RawAiResult,
  formData: AnalyzeIssueFormData
): NormalizedAiResult {
  const baseline = classifyDefectBaseline({
    description: formData.description,
    address: formData.address,
    district: formData.district,
    aiGeneratedDescription: textOrEmpty(rawAiResult.aiGeneratedDescription)
  });
  const rawClass = rawAiResult.defectClass ?? rawAiResult.detectedProblem;
  const aiClass = isDefectClass(rawClass) ? rawClass : "unknown";
  const confidence = normalizeConfidence(rawAiResult.confidence);
  const shouldUseBaseline =
    aiClass === "unknown" ||
    confidence < 0.65 ||
    baseline.confidence >= Math.max(0.7, confidence + 0.12);
  const defectClass = shouldUseBaseline ? baseline.defectClass : aiClass;
  const finalClass = defectClass === "unknown" ? formData.selectedProblemType : defectClass;
  const criticalByTaxonomy =
    defectTaxonomy[finalClass].recommendedSla === "24h" ||
    defectTaxonomy[finalClass].severity >= 85;

  return {
    detectedProblem: finalClass,
    defectClass: finalClass,
    confidence,
    baselineClass: baseline.defectClass,
    baselineConfidence: baseline.confidence,
    matchedKeywords: baseline.matchedKeywords,
    urgencyScore: optionalScore(rawAiResult.urgencyScore),
    akimatRelevanceScore: optionalScore(rawAiResult.akimatRelevanceScore),
    socialImpactScore: optionalScore(rawAiResult.socialImpactScore),
    explanation: textOrEmpty(rawAiResult.explanation),
    aiGeneratedDescription: textOrEmpty(rawAiResult.aiGeneratedDescription),
    fullReportForAkimat: textOrEmpty(rawAiResult.fullReportForAkimat),
    repairRecommendation: textOrEmpty(rawAiResult.repairRecommendation),
    requiresHumanReview: confidence < 0.65 || criticalByTaxonomy
  };
}

function normalizeConfidence(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  const normalized = number > 1 ? number / 100 : number;
  return Math.max(0, Math.min(1, Math.round(normalized * 100) / 100));
}

function optionalScore(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return undefined;
  const normalized = number <= 1 ? number * 100 : number;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

function textOrEmpty(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
