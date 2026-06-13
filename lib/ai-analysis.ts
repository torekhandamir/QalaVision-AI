import {
  citizenSelectableDefectClasses,
  defectClasses,
  type DefectClass
} from "./defect-taxonomy";

export type Locale = "en" | "ru" | "kz";

export type DistrictId =
  | "almaly"
  | "alatau"
  | "auezov"
  | "bostandyk"
  | "zhetysu"
  | "medeu"
  | "nauryzbay"
  | "turksib";

export type ProblemType = DefectClass;

export type DeadlineLevel = "Critical" | "High" | "Medium" | "Low";
export type IssueStatus = "pending" | "in_progress" | "completed";

export type GeoPoint = {
  lat: number;
  lng: number;
  accuracy?: number;
};

export type AnalyzeIssueFormData = {
  district: DistrictId;
  location: GeoPoint | null;
  address: string;
  description: string;
  selectedProblemType: ProblemType;
  locale?: Locale;
};

export type AIAnalysisResult = {
  detectedProblem: ProblemType;
  defectClass?: DefectClass;
  confidence: number;
  baselineClass?: DefectClass;
  baselineConfidence?: number;
  urgencyScore: number;
  akimatRelevanceScore: number;
  socialImpactScore: number;
  riskLevel?: "low" | "medium" | "high" | "critical";
  estimatedRepairCostKZT: number;
  repairDeadline: string;
  deadlineLevel: DeadlineLevel;
  requiresHumanReview?: boolean;
  matchedKeywords?: string[];
  aiGeneratedDescription: string;
  fullReportForAkimat: string;
  explanation: string;
  repairRecommendation: string;
  costExplanation?: string;
  costDisclaimer?: string;
  methodology?: {
    aiLayer: string;
    adaptationLayer: string;
    decisionLayer: string;
    humanInLoop: boolean;
  };
};

export const districts: DistrictId[] = [
  "almaly",
  "alatau",
  "auezov",
  "bostandyk",
  "zhetysu",
  "medeu",
  "nauryzbay",
  "turksib"
];

export const problemTypes: ProblemType[] = citizenSelectableDefectClasses;

export const allProblemTypes: ProblemType[] = defectClasses;

export const districtLabels: Record<Locale, Record<DistrictId, string>> = {
  en: {
    almaly: "Almaly",
    alatau: "Alatau",
    auezov: "Auezov",
    bostandyk: "Bostandyk",
    zhetysu: "Zhetysu",
    medeu: "Medeu",
    nauryzbay: "Nauryzbay",
    turksib: "Turksib"
  },
  ru: {
    almaly: "Алмалинский",
    alatau: "Алатауский",
    auezov: "Ауэзовский",
    bostandyk: "Бостандыкский",
    zhetysu: "Жетысуский",
    medeu: "Медеуский",
    nauryzbay: "Наурызбайский",
    turksib: "Турксибский"
  },
  kz: {
    almaly: "Алмалы",
    alatau: "Алатау",
    auezov: "Әуезов",
    bostandyk: "Бостандық",
    zhetysu: "Жетісу",
    medeu: "Медеу",
    nauryzbay: "Наурызбай",
    turksib: "Түрксіб"
  }
};

export const problemLabels: Record<Locale, Record<ProblemType, string>> = {
  en: {
    pothole: "Pothole",
    broken_sidewalk: "Broken sidewalk",
    trash: "Trash accumulation",
    broken_streetlight: "Broken streetlight",
    road_crack: "Road crack",
    flooding: "Flooding",
    damaged_sign: "Damaged traffic sign",
    open_manhole: "Open manhole",
    unsafe_zone: "Unsafe zone",
    unknown: "Unknown issue"
  },
  ru: {
    pothole: "Яма на дороге",
    broken_sidewalk: "Поврежденный тротуар",
    trash: "Скопление мусора",
    broken_streetlight: "Неисправный фонарь",
    road_crack: "Трещина на дороге",
    flooding: "Подтопление",
    damaged_sign: "Поврежденный знак",
    open_manhole: "Открытый люк",
    unsafe_zone: "Опасная зона",
    unknown: "Неизвестный тип"
  },
  kz: {
    pothole: "Жолдағы шұңқыр",
    broken_sidewalk: "Бүлінген тротуар",
    trash: "Қоқыс жиналуы",
    broken_streetlight: "Істен шыққан шам",
    road_crack: "Жол жарығы",
    flooding: "Су басу",
    damaged_sign: "Бүлінген жол белгісі",
    open_manhole: "Ашық люк",
    unsafe_zone: "Қауіпті аймақ",
    unknown: "Белгісіз түр"
  }
};

export const deadlineText: Record<Locale, Record<DeadlineLevel, string>> = {
  en: {
    Critical: "24 hours",
    High: "3 days",
    Medium: "7 days",
    Low: "30 days"
  },
  ru: {
    Critical: "24 часа",
    High: "3 дня",
    Medium: "7 дней",
    Low: "30 дней"
  },
  kz: {
    Critical: "24 сағат",
    High: "3 күн",
    Medium: "7 күн",
    Low: "30 күн"
  }
};

export async function analyzeIssue(
  image: File | null,
  formData: AnalyzeIssueFormData
): Promise<AIAnalysisResult> {
  const payload = new FormData();
  payload.append("formData", JSON.stringify(formData));
  if (image) payload.append("image", image);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: payload
  });

  if (!response.ok) {
    throw new Error("Analysis request failed");
  }

  return (await response.json()) as AIAnalysisResult;
}
