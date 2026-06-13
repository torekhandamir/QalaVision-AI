export type DefectClass =
  | "pothole"
  | "road_crack"
  | "broken_sidewalk"
  | "open_manhole"
  | "broken_streetlight"
  | "damaged_sign"
  | "trash"
  | "flooding"
  | "unsafe_zone"
  | "unknown";

export type ServiceCategory =
  | "roads"
  | "lighting"
  | "sanitation"
  | "safety"
  | "drainage";

export type SlaCode = "24h" | "3d" | "7d" | "30d";

export type CostRule =
  | {
      type: "area";
      baseKZTPerM2: number;
    }
  | {
      type: "fixed";
      amountKZT: number;
    }
  | {
      type: "range";
      minKZT: number;
      maxKZT: number;
    };

export type DefectTaxonomyItem = {
  defectClass: DefectClass;
  labelRu: string;
  severity: number;
  serviceCategory: ServiceCategory;
  recommendedSla: SlaCode;
  costRule: CostRule;
  keywords: string[];
};

export const defectTaxonomy = {
  pothole: {
    defectClass: "pothole",
    labelRu: "Яма на дороге",
    severity: 82,
    serviceCategory: "roads",
    recommendedSla: "3d",
    costRule: { type: "area", baseKZTPerM2: 7000 },
    keywords: [
      "яма",
      "ямы",
      "глубокая",
      "шұңқыр",
      "pothole",
      "hole",
      "deep hole",
      "road hole"
    ]
  },
  road_crack: {
    defectClass: "road_crack",
    labelRu: "Трещина на дороге",
    severity: 64,
    serviceCategory: "roads",
    recommendedSla: "7d",
    costRule: { type: "area", baseKZTPerM2: 5000 },
    keywords: [
      "трещина",
      "трещины",
      "асфальт треснул",
      "жарық",
      "crack",
      "road crack",
      "asphalt crack"
    ]
  },
  broken_sidewalk: {
    defectClass: "broken_sidewalk",
    labelRu: "Поврежденный тротуар",
    severity: 70,
    serviceCategory: "roads",
    recommendedSla: "7d",
    costRule: { type: "area", baseKZTPerM2: 12000 },
    keywords: [
      "тротуар",
      "плитка",
      "бордюр",
      "пешеход",
      "жаяу",
      "sidewalk",
      "pavement",
      "curb",
      "broken sidewalk"
    ]
  },
  open_manhole: {
    defectClass: "open_manhole",
    labelRu: "Открытый люк",
    severity: 96,
    serviceCategory: "safety",
    recommendedSla: "24h",
    costRule: { type: "fixed", amountKZT: 60000 },
    keywords: [
      "открытый люк",
      "люк открыт",
      "нет крышки люка",
      "крышка люка",
      "құдық",
      "open manhole",
      "manhole",
      "missing cover",
      "sewer cover"
    ]
  },
  broken_streetlight: {
    defectClass: "broken_streetlight",
    labelRu: "Неисправный фонарь",
    severity: 60,
    serviceCategory: "lighting",
    recommendedSla: "3d",
    costRule: { type: "fixed", amountKZT: 45000 },
    keywords: [
      "фонарь",
      "свет",
      "освещение",
      "темно",
      "шам",
      "streetlight",
      "lamp",
      "lighting",
      "dark street"
    ]
  },
  damaged_sign: {
    defectClass: "damaged_sign",
    labelRu: "Поврежденный знак",
    severity: 58,
    serviceCategory: "safety",
    recommendedSla: "7d",
    costRule: { type: "fixed", amountKZT: 35000 },
    keywords: [
      "знак",
      "дорожный знак",
      "сломанный знак",
      "белгі",
      "sign",
      "traffic sign",
      "damaged sign",
      "road sign"
    ]
  },
  trash: {
    defectClass: "trash",
    labelRu: "Скопление мусора",
    severity: 42,
    serviceCategory: "sanitation",
    recommendedSla: "7d",
    costRule: { type: "range", minKZT: 15000, maxKZT: 40000 },
    keywords: [
      "мусор",
      "свалка",
      "контейнер",
      "грязь",
      "қоқыс",
      "trash",
      "garbage",
      "waste",
      "dump"
    ]
  },
  flooding: {
    defectClass: "flooding",
    labelRu: "Подтопление",
    severity: 88,
    serviceCategory: "drainage",
    recommendedSla: "24h",
    costRule: { type: "fixed", amountKZT: 80000 },
    keywords: [
      "подтопление",
      "затопило",
      "лужа",
      "вода",
      "ливневка",
      "су",
      "flood",
      "flooding",
      "water",
      "drainage"
    ]
  },
  unsafe_zone: {
    defectClass: "unsafe_zone",
    labelRu: "Опасная зона",
    severity: 78,
    serviceCategory: "safety",
    recommendedSla: "3d",
    costRule: { type: "fixed", amountKZT: 50000 },
    keywords: [
      "опасно",
      "опасная зона",
      "ограждение",
      "аварийный",
      "риск",
      "қауіпті",
      "unsafe",
      "danger",
      "hazard",
      "risk zone"
    ]
  },
  unknown: {
    defectClass: "unknown",
    labelRu: "Неизвестный тип",
    severity: 35,
    serviceCategory: "safety",
    recommendedSla: "30d",
    costRule: { type: "fixed", amountKZT: 10000 },
    keywords: ["unknown", "other", "другое", "неизвестно"]
  }
} satisfies Record<DefectClass, DefectTaxonomyItem>;

export const defectClasses = Object.keys(defectTaxonomy) as DefectClass[];

export const citizenSelectableDefectClasses = defectClasses.filter(
  (defectClass) => defectClass !== "unknown"
);

export function isDefectClass(value: unknown): value is DefectClass {
  return typeof value === "string" && value in defectTaxonomy;
}
