import type {
  AIAnalysisResult,
  DeadlineLevel,
  DistrictId,
  GeoPoint,
  IssueStatus,
  ProblemType
} from "./ai-analysis";

export type IssueRecord = {
  id: string;
  district: DistrictId;
  address: string;
  location: GeoPoint;
  description: string;
  detectedProblem: ProblemType;
  confidence: number;
  urgencyScore: number;
  akimateRelevanceScore: number;
  estimatedRepairCostKZT: number;
  repairDeadline: string;
  deadlineLevel: DeadlineLevel;
  status: IssueStatus;
  createdAt: string;
  hasPhoto: boolean;
};

export const mockIssues: IssueRecord[] = [
  {
    id: "QV-2401",
    district: "almaly",
    address: "Abylai Khan Ave, near Tole Bi",
    location: { lat: 43.2552, lng: 76.9459 },
    description: "Deep pothole near a busy crossing and bus lane.",
    detectedProblem: "pothole",
    confidence: 94,
    urgencyScore: 88,
    akimateRelevanceScore: 91,
    estimatedRepairCostKZT: 56000,
    repairDeadline: "24 hours",
    deadlineLevel: "Critical",
    status: "new",
    createdAt: "2026-06-10",
    hasPhoto: true
  },
  {
    id: "QV-2402",
    district: "bostandyk",
    address: "Al-Farabi Ave, hospital access road",
    location: { lat: 43.222, lng: 76.913 },
    description: "Flooding after rain blocks a hospital access lane.",
    detectedProblem: "flooding",
    confidence: 92,
    urgencyScore: 90,
    akimateRelevanceScore: 93,
    estimatedRepairCostKZT: 80000,
    repairDeadline: "24 hours",
    deadlineLevel: "Critical",
    status: "triaged",
    createdAt: "2026-06-10",
    hasPhoto: true
  },
  {
    id: "QV-2403",
    district: "auezov",
    address: "Saina St, school zone",
    location: { lat: 43.236, lng: 76.862 },
    description: "Broken sidewalk next to a school entrance.",
    detectedProblem: "broken_sidewalk",
    confidence: 89,
    urgencyScore: 77,
    akimateRelevanceScore: 82,
    estimatedRepairCostKZT: 84000,
    repairDeadline: "3 days",
    deadlineLevel: "High",
    status: "scheduled",
    createdAt: "2026-06-09",
    hasPhoto: true
  },
  {
    id: "QV-2404",
    district: "turksib",
    address: "Mailin St, logistics corridor",
    location: { lat: 43.333, lng: 76.961 },
    description: "Road crack is expanding on a route with heavy trucks.",
    detectedProblem: "road_crack",
    confidence: 86,
    urgencyScore: 73,
    akimateRelevanceScore: 79,
    estimatedRepairCostKZT: 43000,
    repairDeadline: "3 days",
    deadlineLevel: "High",
    status: "in_progress",
    createdAt: "2026-06-08",
    hasPhoto: true
  },
  {
    id: "QV-2405",
    district: "medeu",
    address: "Dostyk Ave, pedestrian promenade",
    location: { lat: 43.242, lng: 76.959 },
    description: "Streetlight is off near a popular evening route.",
    detectedProblem: "broken_streetlight",
    confidence: 83,
    urgencyScore: 71,
    akimateRelevanceScore: 78,
    estimatedRepairCostKZT: 45000,
    repairDeadline: "3 days",
    deadlineLevel: "High",
    status: "new",
    createdAt: "2026-06-08",
    hasPhoto: false
  },
  {
    id: "QV-2406",
    district: "zhetysu",
    address: "Ryskulov Ave service road",
    location: { lat: 43.294, lng: 76.917 },
    description: "Damaged sign is hard to see before lane merge.",
    detectedProblem: "damaged_sign",
    confidence: 80,
    urgencyScore: 59,
    akimateRelevanceScore: 66,
    estimatedRepairCostKZT: 35000,
    repairDeadline: "7 days",
    deadlineLevel: "Medium",
    status: "triaged",
    createdAt: "2026-06-07",
    hasPhoto: true
  },
  {
    id: "QV-2407",
    district: "alatau",
    address: "Momysuly St, residential block",
    location: { lat: 43.294, lng: 76.823 },
    description: "Trash accumulation near playground bins.",
    detectedProblem: "trash",
    confidence: 78,
    urgencyScore: 51,
    akimateRelevanceScore: 62,
    estimatedRepairCostKZT: 15000,
    repairDeadline: "7 days",
    deadlineLevel: "Medium",
    status: "scheduled",
    createdAt: "2026-06-07",
    hasPhoto: true
  },
  {
    id: "QV-2408",
    district: "nauryzbay",
    address: "Kargaly microdistrict",
    location: { lat: 43.203, lng: 76.777 },
    description: "Broken sidewalk makes access difficult after rain.",
    detectedProblem: "broken_sidewalk",
    confidence: 81,
    urgencyScore: 65,
    akimateRelevanceScore: 68,
    estimatedRepairCostKZT: 72000,
    repairDeadline: "7 days",
    deadlineLevel: "Medium",
    status: "triaged",
    createdAt: "2026-06-06",
    hasPhoto: false
  },
  {
    id: "QV-2409",
    district: "almaly",
    address: "Zhibek Zholy St",
    location: { lat: 43.263, lng: 76.94 },
    description: "Damaged sign near pedestrian crossing.",
    detectedProblem: "damaged_sign",
    confidence: 85,
    urgencyScore: 62,
    akimateRelevanceScore: 74,
    estimatedRepairCostKZT: 35000,
    repairDeadline: "7 days",
    deadlineLevel: "Medium",
    status: "new",
    createdAt: "2026-06-05",
    hasPhoto: true
  },
  {
    id: "QV-2410",
    district: "bostandyk",
    address: "Timiryazev St",
    location: { lat: 43.235, lng: 76.906 },
    description: "Road crack near tram-style bus lane marking.",
    detectedProblem: "road_crack",
    confidence: 79,
    urgencyScore: 58,
    akimateRelevanceScore: 69,
    estimatedRepairCostKZT: 32000,
    repairDeadline: "7 days",
    deadlineLevel: "Medium",
    status: "scheduled",
    createdAt: "2026-06-04",
    hasPhoto: true
  },
  {
    id: "QV-2411",
    district: "medeu",
    address: "Kok-Tobe route",
    location: { lat: 43.234, lng: 76.976 },
    description: "Small pothole on uphill tourist road.",
    detectedProblem: "pothole",
    confidence: 82,
    urgencyScore: 69,
    akimateRelevanceScore: 76,
    estimatedRepairCostKZT: 42000,
    repairDeadline: "7 days",
    deadlineLevel: "Medium",
    status: "triaged",
    createdAt: "2026-06-03",
    hasPhoto: false
  },
  {
    id: "QV-2412",
    district: "turksib",
    address: "Airport approach road",
    location: { lat: 43.352, lng: 77.04 },
    description: "Streetlight outage near bus stop.",
    detectedProblem: "broken_streetlight",
    confidence: 84,
    urgencyScore: 70,
    akimateRelevanceScore: 77,
    estimatedRepairCostKZT: 45000,
    repairDeadline: "3 days",
    deadlineLevel: "High",
    status: "new",
    createdAt: "2026-06-02",
    hasPhoto: true
  }
];

export function issueFromAnalysis(
  result: AIAnalysisResult,
  input: {
    district: DistrictId;
    description: string;
    location: GeoPoint | null;
    hasPhoto: boolean;
  }
): IssueRecord {
  return {
    id: `QV-${Math.floor(3000 + Math.random() * 6000)}`,
    district: input.district,
    address: input.location
      ? `${input.location.lat.toFixed(4)}, ${input.location.lng.toFixed(4)}`
      : "Citizen submitted location",
    location: input.location ?? { lat: 43.2389, lng: 76.8897 },
    description: input.description,
    detectedProblem: result.detectedProblem,
    confidence: result.confidence,
    urgencyScore: result.urgencyScore,
    akimateRelevanceScore: result.akimateRelevanceScore,
    estimatedRepairCostKZT: result.estimatedRepairCostKZT,
    repairDeadline: result.repairDeadline,
    deadlineLevel: result.deadlineLevel,
    status: "new",
    createdAt: new Date().toISOString().slice(0, 10),
    hasPhoto: input.hasPhoto
  };
}
