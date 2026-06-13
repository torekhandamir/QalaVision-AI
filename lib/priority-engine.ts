import {
  defectTaxonomy,
  type DefectClass,
  type SlaCode
} from "./defect-taxonomy";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type PriorityFactor = {
  value: number;
  weight: number;
  explanation: string;
};

export type PriorityResult = {
  urgencyScore: number;
  riskLevel: RiskLevel;
  repairDeadline: SlaCode;
  explanation: string;
  factors: {
    severity: PriorityFactor;
    locationRisk: PriorityFactor;
    socialImpact: PriorityFactor;
    photoEvidence: PriorityFactor;
  };
};

export type PriorityInput = {
  defectClass: DefectClass;
  address?: string;
  description?: string;
  district?: string;
  hasPhoto: boolean;
  aiConfidence: number;
  aiSocialImpactScore?: number;
};

const locationRiskKeywords = [
  "школа",
  "детский сад",
  "больница",
  "остановка",
  "переход",
  "магистраль",
  "проспект",
  "bus stop",
  "school",
  "hospital",
  "crosswalk"
];

const districtRisk: Record<string, number> = {
  almaly: 74,
  alatau: 62,
  auezov: 68,
  bostandyk: 72,
  zhetysu: 61,
  medeu: 75,
  nauryzbay: 56,
  turksib: 70
};

export function calculatePriority(input: PriorityInput): PriorityResult {
  const taxonomy = defectTaxonomy[input.defectClass];
  const severity = taxonomy.severity;
  const locationRisk = calculateLocationRisk(input);
  const socialImpact = calculateSocialImpact(input, locationRisk);
  const photoEvidence = calculatePhotoEvidence(input);

  const urgencyScore = Math.round(
    severity * 0.4 +
      locationRisk * 0.25 +
      socialImpact * 0.2 +
      photoEvidence * 0.15
  );
  const riskLevel = riskLevelFromScore(urgencyScore, taxonomy.recommendedSla);

  return {
    urgencyScore,
    riskLevel,
    repairDeadline: slaFromRiskLevel(riskLevel, taxonomy.recommendedSla),
    explanation: buildExplanation(
      input.defectClass,
      urgencyScore,
      riskLevel,
      severity,
      locationRisk,
      socialImpact,
      photoEvidence
    ),
    factors: {
      severity: {
        value: severity,
        weight: 0.4,
        explanation: "Базовая опасность класса дефекта из таксономии QalaVision."
      },
      locationRisk: {
        value: locationRisk,
        weight: 0.25,
        explanation:
          "Риск локации с учетом района и слов рядом со школой, больницей, остановкой или переходом."
      },
      socialImpact: {
        value: socialImpact,
        weight: 0.2,
        explanation:
          "Оценка влияния на пешеходов, водителей и уязвимые группы."
      },
      photoEvidence: {
        value: photoEvidence,
        weight: 0.15,
        explanation:
          "Доказательность фото и уверенность первичного AI-анализа."
      }
    }
  };
}

function calculateLocationRisk(input: PriorityInput) {
  const text = normalizeText(`${input.address ?? ""} ${input.description ?? ""}`);
  const keywordBoost = locationRiskKeywords.some((keyword) =>
    text.includes(normalizeText(keyword))
  )
    ? 20
    : 0;
  const baseRisk = districtRisk[input.district ?? ""] ?? 58;

  return clamp(baseRisk + keywordBoost);
}

function calculateSocialImpact(input: PriorityInput, locationRisk: number) {
  const aiSocial =
    typeof input.aiSocialImpactScore === "number"
      ? normalizeScore(input.aiSocialImpactScore)
      : undefined;
  const taxonomyImpact = Math.round(
    defectTaxonomy[input.defectClass].severity * 0.72 + locationRisk * 0.28
  );

  return clamp(Math.round((aiSocial ?? taxonomyImpact) * 0.55 + taxonomyImpact * 0.45));
}

function calculatePhotoEvidence(input: PriorityInput) {
  const confidence = normalizeConfidence(input.aiConfidence);
  return input.hasPhoto
    ? clamp(Math.round(72 + confidence * 28))
    : clamp(Math.round(42 + confidence * 22));
}

function riskLevelFromScore(score: number, sla: SlaCode): RiskLevel {
  if (score >= 85 || sla === "24h") return "critical";
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function slaFromRiskLevel(riskLevel: RiskLevel, taxonomySla: SlaCode): SlaCode {
  if (riskLevel === "critical") return "24h";
  if (riskLevel === "high") return taxonomySla === "24h" ? "24h" : "3d";
  if (riskLevel === "medium") return taxonomySla === "30d" ? "30d" : "7d";
  return "30d";
}

function buildExplanation(
  defectClass: DefectClass,
  urgencyScore: number,
  riskLevel: RiskLevel,
  severity: number,
  locationRisk: number,
  socialImpact: number,
  photoEvidence: number
) {
  return `QalaVision priority engine присвоил класс "${defectTaxonomy[defectClass].labelRu}" и уровень риска "${riskLevel}". Итоговый urgencyScore ${urgencyScore}/100 рассчитан по формуле: опасность ${severity}/100 * 40%, риск локации ${locationRisk}/100 * 25%, социальный эффект ${socialImpact}/100 * 20%, доказательность фото ${photoEvidence}/100 * 15%.`;
}

function normalizeText(value: string) {
  return value.toLowerCase().replaceAll("ё", "е");
}

function normalizeScore(value: number) {
  return value <= 1 ? value * 100 : value;
}

function normalizeConfidence(value: number) {
  return value > 1 ? value / 100 : value;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}
