import {
  deadlineText,
  problemTypes,
  runLocalRiskAnalysis,
  type AIAnalysisResult,
  type AnalyzeIssueFormData,
  type DeadlineLevel,
  type ProblemType
} from "@/lib/ai-analysis";

export const runtime = "nodejs";

type OpenAIUrbanRiskPayload = {
  detectedProblem?: ProblemType;
  confidence?: number;
  urgencyScore?: number;
  akimatRelevanceScore?: number;
  socialImpactScore?: number;
  estimatedRepairCostKZT?: number;
  explanation?: string;
  aiGeneratedDescription?: string;
  fullReportForAkimat?: string;
  repairRecommendation?: string;
};

export async function POST(request: Request) {
  const form = await request.formData();
  const rawFormData = form.get("formData");
  const image = form.get("image");

  if (typeof rawFormData !== "string") {
    return Response.json({ error: "Missing formData" }, { status: 400 });
  }

  const formData = JSON.parse(rawFormData) as AnalyzeIssueFormData;
  const imageFile = image instanceof File ? image : null;
  const fallback = await runLocalRiskAnalysis(imageFile, formData);

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(fallback);
  }

  try {
    const result = await analyzeWithOpenAI(imageFile, formData, fallback);
    return Response.json(result);
  } catch (error) {
    console.error("OpenAI analysis failed", error);
    return Response.json(fallback);
  }
}

async function analyzeWithOpenAI(
  image: File | null,
  formData: AnalyzeIssueFormData,
  fallback: AIAnalysisResult
): Promise<AIAnalysisResult> {
  const model = process.env.OPENAI_MODEL ?? "gpt-5.5";
  const content: Array<Record<string, string>> = [
    {
      type: "input_text",
      text: buildPrompt(formData, fallback)
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
  const parsed = parseJsonObject(outputText) as OpenAIUrbanRiskPayload;
  const normalized = normalizeOpenAIResult(parsed, fallback, formData);

  return {
    ...normalized,
    modelVersion: `OpenAI ${model}`
  };
}

function buildPrompt(formData: AnalyzeIssueFormData, fallback: AIAnalysisResult) {
  return `You are QalaVision AI, an urban safety analysis system for Almaty akimat.

Analyze the citizen report and attached image if present.

Return ONLY valid JSON. Do not use markdown.

Allowed problem types:
${problemTypes.join(", ")}

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

Scoring rules:
- urgencyScore = problemSeverity * 0.4 + locationRisk * 0.25 + citizenImpact * 0.2 + photoConfidence * 0.15
- akimatRelevanceScore must consider urgency, similar complaints in district, risk to people, proximity to school/hospital/road and district context.
- socialImpactScore must estimate effect on pedestrians, drivers, schools, hospitals and vulnerable groups.
- repair deadlines: Critical 24 hours, High 3 days, Medium 7 days, Low 30 days.
- repair costs: pothole 7000 KZT per m2, broken_sidewalk 12000 KZT per m2, trash 15000 KZT fixed, broken_streetlight 45000 KZT fixed, road_crack 5000 KZT per m2, flooding 80000 KZT fixed, damaged_sign 35000 KZT fixed.

Use this deterministic baseline only as a calibration reference, not as the final answer:
${JSON.stringify({
    detectedProblem: fallback.detectedProblem,
    confidence: fallback.confidence,
    urgencyScore: fallback.urgencyScore,
    akimatRelevanceScore: fallback.akimatRelevanceScore,
    socialImpactScore: fallback.socialImpactScore,
    estimatedRepairCostKZT: fallback.estimatedRepairCostKZT
  })}

Required JSON shape:
{
  "detectedProblem": "one allowed problem type",
  "confidence": 0-100,
  "urgencyScore": 0-100,
  "akimatRelevanceScore": 0-100,
  "socialImpactScore": 0-100,
  "estimatedRepairCostKZT": positive integer,
  "explanation": "short explainable scoring reason",
  "aiGeneratedDescription": "operational description for city staff",
  "fullReportForAkimat": "full report text for akimat",
  "repairRecommendation": "recommended field action"
}`;
}

function normalizeOpenAIResult(
  result: OpenAIUrbanRiskPayload,
  fallback: AIAnalysisResult,
  formData: AnalyzeIssueFormData
): AIAnalysisResult {
  const locale = formData.locale ?? "en";
  const detectedProblem = problemTypes.includes(result.detectedProblem as ProblemType)
    ? (result.detectedProblem as ProblemType)
    : fallback.detectedProblem;
  const urgencyScore = clampNumber(result.urgencyScore, fallback.urgencyScore);
  const deadlineLevel = deadlineFromUrgency(urgencyScore);
  const akimatRelevanceScore = clampNumber(
    result.akimatRelevanceScore,
    fallback.akimatRelevanceScore
  );

  return {
    ...fallback,
    detectedProblem,
    confidence: clampNumber(result.confidence, fallback.confidence),
    urgencyScore,
    akimatRelevanceScore,
    akimateRelevanceScore: akimatRelevanceScore,
    socialImpactScore: clampNumber(
      result.socialImpactScore,
      fallback.socialImpactScore
    ),
    estimatedRepairCostKZT: positiveInteger(
      result.estimatedRepairCostKZT,
      fallback.estimatedRepairCostKZT
    ),
    deadlineLevel,
    repairDeadline: deadlineText[locale][deadlineLevel],
    explanation: result.explanation?.trim() || fallback.explanation,
    aiGeneratedDescription:
      result.aiGeneratedDescription?.trim() || fallback.aiGeneratedDescription,
    fullReportForAkimat:
      result.fullReportForAkimat?.trim() || fallback.fullReportForAkimat,
    generatedComplaintText:
      result.fullReportForAkimat?.trim() || fallback.generatedComplaintText,
    repairRecommendation:
      result.repairRecommendation?.trim() || fallback.repairRecommendation
  };
}

function extractOutputText(body: unknown) {
  if (isRecord(body) && typeof body.output_text === "string") {
    return body.output_text;
  }

  if (!isRecord(body) || !Array.isArray(body.output)) {
    throw new Error("OpenAI response has no output text");
  }

  const text = body.output
    .flatMap((item) => (isRecord(item) && Array.isArray(item.content) ? item.content : []))
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

function clampNumber(value: unknown, fallback: number) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function positiveInteger(value: unknown, fallback: number) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallback;
  return Math.round(number);
}

function deadlineFromUrgency(score: number): DeadlineLevel {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}
