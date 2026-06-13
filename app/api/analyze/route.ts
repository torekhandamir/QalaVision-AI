import {
  allProblemTypes,
  problemLabels,
  type AIAnalysisResult,
  type AnalyzeIssueFormData,
  type DeadlineLevel,
  type Locale
} from "@/lib/ai-analysis";
import { estimateRepairCost } from "@/lib/cost-estimator";
import { normalizeAiResult, type RawAiResult } from "@/lib/domain-adapter";
import { defectTaxonomy, type DefectClass } from "@/lib/defect-taxonomy";
import { calculatePriority, type RiskLevel } from "@/lib/priority-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const rawFormData = form.get("formData");
  const image = form.get("image");

  if (typeof rawFormData !== "string") {
    return Response.json({ error: "Missing formData" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const formData = JSON.parse(rawFormData) as AnalyzeIssueFormData;
  const imageFile = image instanceof File ? image : null;

  try {
    const rawAiResult = await analyzeWithOpenAI(imageFile, formData);
    const result = buildDomainDecision(rawAiResult, formData, Boolean(imageFile));
    return Response.json(result);
  } catch (error) {
    console.error("AI analysis failed", error);
    return Response.json({ error: "AI analysis failed" }, { status: 502 });
  }
}

async function analyzeWithOpenAI(
  image: File | null,
  formData: AnalyzeIssueFormData
): Promise<RawAiResult> {
  const model = process.env.OPENAI_MODEL ?? "gpt-5.5";
  const content: Array<Record<string, string>> = [
    {
      type: "input_text",
      text: buildPrompt(formData)
    }
  ];

  if (image) {
    content.push({
      type: "input_image",
      image_url: await fileToDataUrl(image)
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "user",
          content
        }
      ],
      store: false
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI returned ${response.status}`);
  }

  const body = await response.json();
  const outputText = extractOutputText(body);
  return parseJsonObject(outputText) as RawAiResult;
}

function buildDomainDecision(
  rawAiResult: RawAiResult,
  formData: AnalyzeIssueFormData,
  hasPhoto: boolean
): AIAnalysisResult {
  const locale = formData.locale ?? "en";
  const normalized = normalizeAiResult(rawAiResult, formData);
  const priority = calculatePriority({
    defectClass: normalized.defectClass,
    address: formData.address,
    description: formData.description,
    district: formData.district,
    hasPhoto,
    aiConfidence: normalized.confidence,
    aiSocialImpactScore: normalized.socialImpactScore
  });
  const severity = priority.factors.severity.value;
  const cost = estimateRepairCost(
    normalized.defectClass,
    severity,
    formData.description
  );
  const akimatRelevanceScore = calculateAkimatRelevanceScore(
    normalized.akimatRelevanceScore,
    priority.urgencyScore,
    priority.factors.locationRisk.value,
    priority.factors.socialImpact.value,
    normalized.requiresHumanReview
  );
  const requiresHumanReview =
    normalized.requiresHumanReview || priority.riskLevel === "critical";
  const deadlineLevel = deadlineLevelFromRisk(priority.riskLevel);
  const aiGeneratedDescription =
    normalized.aiGeneratedDescription ||
    buildGeneratedDescription(normalized.defectClass, formData, priority.riskLevel);
  const repairRecommendation =
    normalized.repairRecommendation ||
    buildRepairRecommendation(normalized.defectClass, priority.riskLevel);
  const explanation = [
    normalized.explanation,
    priority.explanation,
    cost.costExplanation,
    requiresHumanReview
      ? "Заявка отмечена для проверки оператором из-за высокого риска или низкой уверенности."
      : ""
  ]
    .filter(Boolean)
    .join(" ");

  return {
    detectedProblem: normalized.defectClass,
    defectClass: normalized.defectClass,
    confidence: normalized.confidence,
    baselineClass: normalized.baselineClass,
    baselineConfidence: normalized.baselineConfidence,
    urgencyScore: priority.urgencyScore,
    akimatRelevanceScore,
    socialImpactScore: priority.factors.socialImpact.value,
    riskLevel: priority.riskLevel,
    estimatedRepairCostKZT: cost.estimatedRepairCostKZT,
    repairDeadline: priority.repairDeadline,
    deadlineLevel,
    requiresHumanReview,
    matchedKeywords: normalized.matchedKeywords,
    aiGeneratedDescription,
    fullReportForAkimat: buildFullReportForAkimat({
      normalizedClass: normalized.defectClass,
      formData,
      locale,
      priority,
      akimatRelevanceScore,
      cost,
      repairRecommendation,
      requiresHumanReview,
      aiReport: normalized.fullReportForAkimat
    }),
    explanation,
    repairRecommendation,
    costExplanation: cost.costExplanation,
    costDisclaimer: cost.disclaimer,
    methodology: {
      aiLayer: "OpenAI vision/text analysis",
      adaptationLayer:
        "QalaVision domain taxonomy + baseline classifier + priority engine",
      decisionLayer: "rule-based risk, cost and SLA scoring",
      humanInLoop: true
    }
  };
}

function buildPrompt(formData: AnalyzeIssueFormData) {
  return `You are QalaVision AI, an urban safety analysis layer for Almaty akimat.

Analyze the citizen report and attached image if present.
Return ONLY valid JSON. Do not use markdown.

Allowed defect classes:
${allProblemTypes.join(", ")}

Citizen report:
- district: ${formData.district}
- address: ${formData.address || "not provided"}
- coordinates: ${
    formData.location
      ? `${formData.location.lat}, ${formData.location.lng}`
      : "not provided"
  }
- citizen selected problem type: ${formData.selectedProblemType}
- description: ${formData.description || "not provided"}

Your role is the primary vision/text analysis layer. The final decision will be adapted by QalaVision domain taxonomy, baseline classifier, priority engine and cost estimator.

Required JSON shape:
{
  "detectedProblem": "one allowed defect class",
  "confidence": 0-1,
  "urgencyScore": 0-100,
  "akimatRelevanceScore": 0-100,
  "socialImpactScore": 0-100,
  "explanation": "short reason based on visible evidence and citizen text",
  "aiGeneratedDescription": "operational description for city staff",
  "fullReportForAkimat": "full report text for akimat",
  "repairRecommendation": "recommended field action"
}`;
}

function calculateAkimatRelevanceScore(
  aiScore: number | undefined,
  urgencyScore: number,
  locationRisk: number,
  socialImpact: number,
  requiresHumanReview: boolean
) {
  const adapted = Math.round(
    urgencyScore * 0.45 +
      locationRisk * 0.25 +
      socialImpact * 0.2 +
      (requiresHumanReview ? 10 : 4)
  );

  return clamp(
    Math.round(typeof aiScore === "number" ? aiScore * 0.35 + adapted * 0.65 : adapted)
  );
}

function buildGeneratedDescription(
  defectClass: DefectClass,
  formData: AnalyzeIssueFormData,
  riskLevel: RiskLevel
) {
  const label = defectTaxonomy[defectClass].labelRu;
  const address = formData.address || "адрес не указан";
  return `QalaVision AI классифицировал заявку как "${label}" по адресу: ${address}. Уровень риска: ${riskLevel}.`;
}

function buildRepairRecommendation(defectClass: DefectClass, riskLevel: RiskLevel) {
  const taxonomy = defectTaxonomy[defectClass];
  return `Передать в службу "${taxonomy.serviceCategory}", проверить место, подтвердить дефект и обработать заявку по SLA ${taxonomy.recommendedSla}. Уровень риска: ${riskLevel}.`;
}

function buildFullReportForAkimat({
  normalizedClass,
  formData,
  locale,
  priority,
  akimatRelevanceScore,
  cost,
  repairRecommendation,
  requiresHumanReview,
  aiReport
}: {
  normalizedClass: DefectClass;
  formData: AnalyzeIssueFormData;
  locale: Locale;
  priority: ReturnType<typeof calculatePriority>;
  akimatRelevanceScore: number;
  cost: ReturnType<typeof estimateRepairCost>;
  repairRecommendation: string;
  requiresHumanReview: boolean;
  aiReport: string;
}) {
  const label = problemLabels[locale][normalizedClass];
  const coordinates = formData.location
    ? `${formData.location.lat.toFixed(5)}, ${formData.location.lng.toFixed(5)}`
    : "не указаны";

  return [
    `Отчет QalaVision AI для акимата. Класс дефекта: ${label}.`,
    `Район: ${formData.district}. Адрес: ${formData.address || "не указан"}. Координаты: ${coordinates}.`,
    `Urgency: ${priority.urgencyScore}/100. Akimat relevance: ${akimatRelevanceScore}/100. Social impact: ${priority.factors.socialImpact.value}/100.`,
    `Risk level: ${priority.riskLevel}. SLA: ${priority.repairDeadline}. Бюджет: ${cost.estimatedRepairCostKZT.toLocaleString("ru-RU")} KZT.`,
    `Human review: ${requiresHumanReview ? "required" : "not required"}.`,
    `Рекомендация: ${repairRecommendation}`,
    `Методология: OpenAI vision/text layer + QalaVision taxonomy + baseline classifier + priority engine + cost estimator.`,
    cost.disclaimer,
    aiReport ? `AI note: ${aiReport}` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function extractOutputText(body: unknown) {
  if (isRecord(body) && typeof body.output_text === "string") {
    return body.output_text;
  }

  if (!isRecord(body) || !Array.isArray(body.output)) {
    throw new Error("OpenAI response has no output text");
  }

  const text = body.output
    .flatMap((item) =>
      isRecord(item) && Array.isArray(item.content) ? item.content : []
    )
    .map((content) => {
      if (!isRecord(content)) return "";
      if (typeof content.text === "string") return content.text;
      if (typeof content.output_text === "string") return content.output_text;
      return "";
    })
    .join("\n")
    .trim();

  if (!text) throw new Error("OpenAI output text is empty");
  return text;
}

function parseJsonObject(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const jsonText = fenced ?? trimmed;
  const start = jsonText.indexOf("{");
  const end = jsonText.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("OpenAI output is not JSON");
  }

  return JSON.parse(jsonText.slice(start, end + 1));
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function deadlineLevelFromRisk(riskLevel: RiskLevel): DeadlineLevel {
  if (riskLevel === "critical") return "Critical";
  if (riskLevel === "high") return "High";
  if (riskLevel === "medium") return "Medium";
  return "Low";
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}
