import {
  defectClasses,
  defectTaxonomy,
  type DefectClass
} from "./defect-taxonomy";

export type BaselineClassifierInput = {
  description?: string;
  address?: string;
  district?: string;
  aiGeneratedDescription?: string;
};

export type BaselineClassifierResult = {
  defectClass: DefectClass;
  confidence: number;
  matchedKeywords: string[];
};

export function classifyDefectBaseline(
  input: BaselineClassifierInput
): BaselineClassifierResult {
  const text = normalizeText(
    [
      input.description,
      input.address,
      input.district,
      input.aiGeneratedDescription
    ]
      .filter(Boolean)
      .join(" ")
  );

  if (!text) {
    return {
      defectClass: "unknown",
      confidence: 0,
      matchedKeywords: []
    };
  }

  const scored = defectClasses
    .filter((defectClass) => defectClass !== "unknown")
    .map((defectClass) => {
      const matchedKeywords = defectTaxonomy[defectClass].keywords.filter(
        (keyword) => text.includes(normalizeText(keyword))
      );
      const score = matchedKeywords.reduce(
        (sum, keyword) => sum + keywordWeight(keyword),
        0
      );

      return {
        defectClass,
        matchedKeywords,
        score
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const second = scored[1];

  if (!best || best.score === 0) {
    return {
      defectClass: "unknown",
      confidence: 0.2,
      matchedKeywords: []
    };
  }

  const confidence = Math.min(
    0.98,
    Math.max(0.35, best.score / (best.score + (second?.score ?? 0) + 4))
  );

  return {
    defectClass: best.defectClass,
    confidence: roundConfidence(confidence),
    matchedKeywords: best.matchedKeywords
  };
}

function normalizeText(value: string) {
  return value.toLowerCase().replaceAll("ё", "е").replace(/\s+/g, " ").trim();
}

function keywordWeight(keyword: string) {
  const words = keyword.trim().split(/\s+/).length;
  return words > 1 ? 5 + words : 3;
}

function roundConfidence(value: number) {
  return Math.round(value * 100) / 100;
}
