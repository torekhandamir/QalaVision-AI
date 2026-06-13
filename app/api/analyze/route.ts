import {
  deadlineText,
  problemTypes,
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

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const formData = JSON.parse(rawFormData) as AnalyzeIssueFormData;
  const imageFile = image instanceof File ? image : null;

  try {
    const result = await analyzeWithOpenAI(imageFile, formData);
    return Response.json(result);
  } catch (error) {
    console.error("OpenAI analysis failed", error);
    return Response.json({ error: "AI analysis failed" }, { status: 502 });
  }
}

async function analyzeWithOpenAI(
  image: File | null,
  formData: AnalyzeIssueFormData
): Promise<AIAnalysisResult> {
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
  const parsed = parseJsonObject(outputText) as OpenAIUrbanRiskPayload;
  return normalizeOpenAIResult(parsed, formData);
}

function buildPrompt(formData: AnalyzeIssueFormData) {
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
  formData: AnalyzeIssueFormData
): AIAnalysisResult {
  const locale = formData.locale ?? "en";
  const detectedProblem = requireProblemType(result.detectedProblem);
  const urgencyScore = clampNumber(result.urgencyScore, "urgencyScore");
  const deadlineLevel = deadlineFromUrgency(urgencyScore);
  const akimatRelevanceScore = clampNumber(
    result.akimatRelevanceScore,
    "akimatRelevanceScore"
  );

  return {
    detectedProblem,
    confidence: clampNumber(result.confidence, "confidence"),
    urgencyScore,
    akimatRelevanceScore,
    socialImpactScore: clampNumber(
      result.socialImpactScore,
      "socialImpactScore"
    ),
    estimatedRepairCostKZT: positiveInteger(
      result.estimatedRepairCostKZT,
      "estimatedRepairCostKZT"
    ),
    deadlineLevel,
    repairDeadline: deadlineText[locale][deadlineLevel],
    explanation: requireText(result.explanation, "explanation"),
    aiGeneratedDescription: requireText(
      result.aiGeneratedDescription,
      "aiGeneratedDescription"
    ),
    fullReportForAkimat: requireText(
      result.fullReportForAkimat,
      "fullReportForAkimat"
    ),
    repairRecommendation: requireText(
      result.repairRecommendation,
      "repairRecommendation"
    )
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

function requireProblemType(value: unknown) {
  if (typeof value === "string" && problemTypes.includes(value as ProblemType)) {
    return value as ProblemType;
  }

  throw new Error("OpenAI returned invalid detectedProblem");
}

function clampNumber(value: unknown, field: string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`OpenAI returned invalid ${field}`);
  }
  return Math.max(0, Math.min(100, Math.round(number)));
}

function positiveInteger(value: unknown, field: string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`OpenAI returned invalid ${field}`);
  }
  return Math.round(number);
}

function requireText(value: unknown, field: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  throw new Error(`OpenAI returned invalid ${field}`);
}

function deadlineFromUrgency(score: number): DeadlineLevel {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}
