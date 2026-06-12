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

export type ProblemType =
  | "pothole"
  | "broken_sidewalk"
  | "trash"
  | "broken_streetlight"
  | "road_crack"
  | "flooding"
  | "damaged_sign";

export type DeadlineLevel = "Critical" | "High" | "Medium" | "Low";

export type IssueStatus = "new" | "triaged" | "scheduled" | "in_progress";

export type GeoPoint = {
  lat: number;
  lng: number;
  accuracy?: number;
};

export type AnalyzeIssueFormData = {
  district: DistrictId;
  location: GeoPoint | null;
  description: string;
  selectedProblemType: ProblemType;
  locale?: Locale;
};

export type AnalysisFactor = {
  label: string;
  value: number;
  weight: number;
  description: string;
};

export type AIAnalysisResult = {
  detectedProblem: ProblemType;
  confidence: number;
  urgencyScore: number;
  akimateRelevanceScore: number;
  estimatedRepairCostKZT: number;
  repairDeadline: string;
  deadlineLevel: DeadlineLevel;
  explanation: string;
  generatedComplaintText: string;
  factors: AnalysisFactor[];
  modelVersion: string;
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

export const problemTypes: ProblemType[] = [
  "pothole",
  "broken_sidewalk",
  "trash",
  "broken_streetlight",
  "road_crack",
  "flooding",
  "damaged_sign"
];

export const districtLabels: Record<Locale, Record<DistrictId, string>> = {
  en: {
    almaly: "Almalinsky",
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
    damaged_sign: "Damaged traffic sign"
  },
  ru: {
    pothole: "Яма на дороге",
    broken_sidewalk: "Поврежденный тротуар",
    trash: "Скопление мусора",
    broken_streetlight: "Неисправный фонарь",
    road_crack: "Трещина на дороге",
    flooding: "Подтопление",
    damaged_sign: "Поврежденный знак"
  },
  kz: {
    pothole: "Жолдағы шұңқыр",
    broken_sidewalk: "Бүлінген тротуар",
    trash: "Қоқыс жиналуы",
    broken_streetlight: "Істен шыққан шам",
    road_crack: "Жол жарығы",
    flooding: "Су басу",
    damaged_sign: "Бүлінген жол белгісі"
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

const severityByProblem: Record<ProblemType, number> = {
  pothole: 82,
  broken_sidewalk: 70,
  trash: 43,
  broken_streetlight: 60,
  road_crack: 65,
  flooding: 88,
  damaged_sign: 52
};

const repairCostKZT: Record<
  ProblemType,
  { mode: "area"; rate: number } | { mode: "fixed"; rate: number }
> = {
  pothole: { mode: "area", rate: 7000 },
  broken_sidewalk: { mode: "area", rate: 12000 },
  trash: { mode: "fixed", rate: 15000 },
  broken_streetlight: { mode: "fixed", rate: 45000 },
  road_crack: { mode: "area", rate: 5000 },
  flooding: { mode: "fixed", rate: 80000 },
  damaged_sign: { mode: "fixed", rate: 35000 }
};

const districtRisk: Record<
  DistrictId,
  {
    locationRisk: number;
    similarComplaints: number;
    proximityRisk: number;
    context: Record<Locale, string>;
  }
> = {
  almaly: {
    locationRisk: 78,
    similarComplaints: 10,
    proximityRisk: 82,
    context: {
      en: "central streets with high pedestrian and transit load",
      ru: "центральные улицы с высоким пешеходным и транспортным потоком",
      kz: "жаяу жүргінші және көлік ағыны жоғары орталық көшелер"
    }
  },
  alatau: {
    locationRisk: 68,
    similarComplaints: 7,
    proximityRisk: 72,
    context: {
      en: "fast-growing residential areas and arterial roads",
      ru: "быстро растущие жилые кварталы и магистральные дороги",
      kz: "қарқынды өсіп жатқан тұрғын аудандар және магистральдар"
    }
  },
  auezov: {
    locationRisk: 73,
    similarComplaints: 9,
    proximityRisk: 76,
    context: {
      en: "dense residential blocks near schools and public transport",
      ru: "плотные жилые кварталы рядом со школами и общественным транспортом",
      kz: "мектептер мен қоғамдық көлікке жақын тығыз тұрғын кварталдар"
    }
  },
  bostandyk: {
    locationRisk: 74,
    similarComplaints: 8,
    proximityRisk: 79,
    context: {
      en: "mixed education, hospital and commuter corridors",
      ru: "районы с учебными, медицинскими и транспортными коридорами",
      kz: "оқу, медицина және көлік дәліздері аралас аймақтар"
    }
  },
  zhetysu: {
    locationRisk: 64,
    similarComplaints: 6,
    proximityRisk: 68,
    context: {
      en: "industrial and residential corridors with uneven road quality",
      ru: "промышленные и жилые коридоры с неоднородным качеством дорог",
      kz: "жол сапасы әркелкі өндірістік және тұрғын дәліздер"
    }
  },
  medeu: {
    locationRisk: 80,
    similarComplaints: 7,
    proximityRisk: 84,
    context: {
      en: "tourism, mountain routes and busy civic destinations",
      ru: "туристические маршруты, горные дороги и важные городские точки",
      kz: "туристік маршруттар, тау жолдары және маңызды қалалық нүктелер"
    }
  },
  nauryzbay: {
    locationRisk: 59,
    similarComplaints: 5,
    proximityRisk: 63,
    context: {
      en: "expanding neighborhoods with longer emergency access routes",
      ru: "развивающиеся районы с более длинными маршрутами экстренного доступа",
      kz: "жедел қолжетімділік маршруттары ұзақтау дамып жатқан аудандар"
    }
  },
  turksib: {
    locationRisk: 76,
    similarComplaints: 8,
    proximityRisk: 81,
    context: {
      en: "railway, airport and logistics routes with heavy traffic",
      ru: "железнодорожные, аэропортовые и логистические маршруты с высокой нагрузкой",
      kz: "теміржол, әуежай және логистика бағыттары, қозғалысы жоғары"
    }
  }
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function deterministicRange(seed: string, min: number, max: number) {
  const hash = hashString(seed);
  return min + (hash % (max - min + 1));
}

function detectFromDescription(
  description: string,
  selectedProblemType: ProblemType
): ProblemType {
  const normalized = description.toLowerCase();
  const keywordMap: Array<[ProblemType, string[]]> = [
    ["flooding", ["flood", "water", "подтоп", "вода", "су", "тасқын"]],
    ["broken_streetlight", ["light", "lamp", "фонарь", "шам", "освещ"]],
    ["trash", ["trash", "garbage", "мусор", "қоқыс"]],
    ["broken_sidewalk", ["sidewalk", "pavement", "тротуар", "жаяу"]],
    ["damaged_sign", ["sign", "знак", "белгі"]],
    ["road_crack", ["crack", "трещ", "жарық"]],
    ["pothole", ["pothole", "яма", "шұңқыр"]]
  ];

  const matched = keywordMap.find(([, words]) =>
    words.some((word) => normalized.includes(word))
  );

  return matched?.[0] ?? selectedProblemType;
}

function citizenImpactScore(problem: ProblemType, description: string) {
  const detailBoost = Math.min(18, description.trim().length / 5);
  const baseImpact: Record<ProblemType, number> = {
    pothole: 78,
    broken_sidewalk: 72,
    trash: 46,
    broken_streetlight: 66,
    road_crack: 63,
    flooding: 86,
    damaged_sign: 58
  };

  const vulnerableBoost = /school|hospital|children|elderly|traffic|школ|больниц|дет|пожил|трафик|мектеп|аурухана|бала|қарт|көлік/i.test(
    description
  )
    ? 10
    : 0;

  return clamp(baseImpact[problem] + detailBoost + vulnerableBoost);
}

function deadlineFromUrgency(score: number): DeadlineLevel {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

function repairEstimate(problem: ProblemType, urgencyScore: number, seed: string) {
  const cost = repairCostKZT[problem];
  if (cost.mode === "fixed") {
    return cost.rate;
  }

  const estimatedAreaM2 =
    Math.round((1.2 + urgencyScore / 18 + deterministicRange(seed, 0, 22) / 10) * 10) /
    10;
  return Math.round((estimatedAreaM2 * cost.rate) / 1000) * 1000;
}

function buildExplanation(
  locale: Locale,
  problem: ProblemType,
  district: DistrictId,
  urgencyScore: number,
  relevanceScore: number,
  factors: AnalysisFactor[],
  confidence: number
) {
  const problemLabel = problemLabels[locale][problem];
  const districtLabel = districtLabels[locale][district];
  const riskContext = districtRisk[district].context[locale];
  const factorLine = factors
    .map((factor) => `${factor.label}: ${factor.value}/100`)
    .join(", ");

  if (locale === "ru") {
    return `AI определил проблему как "${problemLabel}" с уверенностью ${confidence}%. Срочность ${urgencyScore}/100 рассчитана по прозрачной формуле: ${factorLine}. Релевантность для акимата ${relevanceScore}/100 выше из-за контекста района ${districtLabel}: ${riskContext}, похожих обращений и близости к важной инфраструктуре.`;
  }

  if (locale === "kz") {
    return `AI мәселені "${problemLabel}" деп анықтады, сенімділік ${confidence}%. Шұғылдық ${urgencyScore}/100 ашық формуламен есептелді: ${factorLine}. Әкімдік үшін релеванттылық ${relevanceScore}/100, себебі ${districtLabel} ауданында ${riskContext}, ұқсас өтініштер және маңызды инфрақұрылымға жақындық ескерілді.`;
  }

  return `AI detected "${problemLabel}" with ${confidence}% confidence. Urgency ${urgencyScore}/100 is calculated with the transparent factor formula: ${factorLine}. Akimate relevance ${relevanceScore}/100 is increased by the ${districtLabel} context: ${riskContext}, similar district complaints and proximity to critical infrastructure.`;
}

function buildComplaint(
  locale: Locale,
  district: DistrictId,
  problem: ProblemType,
  urgencyScore: number,
  relevanceScore: number,
  cost: number,
  deadline: string,
  description: string,
  location: GeoPoint | null
) {
  const districtLabel = districtLabels[locale][district];
  const problemLabel = problemLabels[locale][problem];
  const coordinates = location
    ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
    : locale === "ru"
      ? "координаты не предоставлены"
      : locale === "kz"
        ? "координаттар берілмеген"
        : "coordinates not provided";

  if (locale === "ru") {
    return `Уважаемый акимат Алматы, просим рассмотреть городскую проблему: ${problemLabel}. Район: ${districtLabel}. Координаты: ${coordinates}. Срочность: ${urgencyScore}/100, релевантность для акимата: ${relevanceScore}/100. Ориентировочная стоимость ремонта: ${cost.toLocaleString("ru-RU")} KZT. Рекомендуемый срок: ${deadline}. Описание жителя: ${description || "без дополнительного описания"}.`;
  }

  if (locale === "kz") {
    return `Құрметті Алматы әкімдігі, қалалық мәселені қарастыруыңызды сұраймыз: ${problemLabel}. Аудан: ${districtLabel}. Координаттар: ${coordinates}. Шұғылдық: ${urgencyScore}/100, әкімдік үшін релеванттылық: ${relevanceScore}/100. Жөндеудің шамамен құны: ${cost.toLocaleString("ru-RU")} KZT. Ұсынылатын мерзім: ${deadline}. Тұрғын сипаттамасы: ${description || "қосымша сипаттама жоқ"}.`;
  }

  return `Dear Almaty Akimate, please review the following urban issue: ${problemLabel}. District: ${districtLabel}. Coordinates: ${coordinates}. Urgency: ${urgencyScore}/100, akimate relevance: ${relevanceScore}/100. Estimated repair cost: ${cost.toLocaleString("en-US")} KZT. Recommended deadline: ${deadline}. Citizen description: ${description || "no additional description"}.`;
}

function buildFactors(
  locale: Locale,
  problemSeverity: number,
  locationRisk: number,
  citizenImpact: number,
  photoConfidence: number
): AnalysisFactor[] {
  const labels = {
    en: {
      severity: "Problem severity",
      location: "Location risk",
      impact: "Citizen impact",
      photo: "Photo confidence"
    },
    ru: {
      severity: "Серьезность проблемы",
      location: "Риск локации",
      impact: "Влияние на жителей",
      photo: "Уверенность по фото"
    },
    kz: {
      severity: "Мәселе ауырлығы",
      location: "Локация тәуекелі",
      impact: "Тұрғындарға әсері",
      photo: "Фото сенімділігі"
    }
  }[locale];

  const descriptions = {
    en: {
      severity: "Base hazard level for the detected category.",
      location: "District profile, road load and nearby public facilities.",
      impact: "Expected effect on pedestrians, drivers and vulnerable groups.",
      photo: "Signal quality from the uploaded or captured image."
    },
    ru: {
      severity: "Базовый уровень опасности для найденной категории.",
      location: "Профиль района, нагрузка дорог и близость городских объектов.",
      impact: "Ожидаемое влияние на пешеходов, водителей и уязвимые группы.",
      photo: "Качество сигнала из загруженного или снятого фото."
    },
    kz: {
      severity: "Анықталған санаттың базалық қауіптілік деңгейі.",
      location: "Аудан профилі, жол жүктемесі және қалалық нысандарға жақындық.",
      impact: "Жаяу жүргінші, жүргізуші және осал топтарға ықпал.",
      photo: "Жүктелген немесе түсірілген фотодан алынған сигнал сапасы."
    }
  }[locale];

  return [
    {
      label: labels.severity,
      value: problemSeverity,
      weight: 0.4,
      description: descriptions.severity
    },
    {
      label: labels.location,
      value: locationRisk,
      weight: 0.25,
      description: descriptions.location
    },
    {
      label: labels.impact,
      value: citizenImpact,
      weight: 0.2,
      description: descriptions.impact
    },
    {
      label: labels.photo,
      value: photoConfidence,
      weight: 0.15,
      description: descriptions.photo
    }
  ];
}

export async function analyzeIssue(
  image: File | null,
  formData: AnalyzeIssueFormData
): Promise<AIAnalysisResult> {
  // Swap this implementation for an OpenAI API, YOLO endpoint or custom CV model later.
  return mockAnalyzeIssue(image, formData);
}

export async function mockAnalyzeIssue(
  image: File | null,
  formData: AnalyzeIssueFormData
): Promise<AIAnalysisResult> {
  const locale = formData.locale ?? "en";
  const seed = `${formData.district}-${formData.selectedProblemType}-${formData.description}-${image?.name ?? "no-image"}-${image?.size ?? 0}`;
  const detectedProblem = detectFromDescription(
    formData.description,
    formData.selectedProblemType
  );
  const districtProfile = districtRisk[formData.district];
  const problemSeverity = severityByProblem[detectedProblem];
  const locationRisk = clamp(
    districtProfile.locationRisk + deterministicRange(seed, -4, 6)
  );
  const citizenImpact = citizenImpactScore(detectedProblem, formData.description);
  const photoConfidence = image
    ? clamp(82 + deterministicRange(seed, 0, 14))
    : clamp(58 + deterministicRange(seed, 0, 16));
  const confidence = image
    ? clamp(photoConfidence + deterministicRange(seed, -2, 4))
    : clamp(photoConfidence - deterministicRange(seed, 2, 9));

  const urgencyScore = Math.round(
    problemSeverity * 0.4 +
      locationRisk * 0.25 +
      citizenImpact * 0.2 +
      photoConfidence * 0.15
  );

  const similarComplaintsScore = clamp(districtProfile.similarComplaints * 9);
  const peopleRisk = clamp((problemSeverity + citizenImpact) / 2 + deterministicRange(seed, -3, 5));
  const akimateRelevanceScore = Math.round(
    urgencyScore * 0.42 +
      similarComplaintsScore * 0.18 +
      peopleRisk * 0.18 +
      districtProfile.proximityRisk * 0.22
  );

  const deadlineLevel = deadlineFromUrgency(urgencyScore);
  const repairDeadline = deadlineText[locale][deadlineLevel];
  const estimatedRepairCostKZT = repairEstimate(
    detectedProblem,
    urgencyScore,
    seed
  );
  const factors = buildFactors(
    locale,
    problemSeverity,
    locationRisk,
    citizenImpact,
    photoConfidence
  );

  return {
    detectedProblem,
    confidence,
    urgencyScore,
    akimateRelevanceScore,
    estimatedRepairCostKZT,
    repairDeadline,
    deadlineLevel,
    factors,
    explanation: buildExplanation(
      locale,
      detectedProblem,
      formData.district,
      urgencyScore,
      akimateRelevanceScore,
      factors,
      confidence
    ),
    generatedComplaintText: buildComplaint(
      locale,
      formData.district,
      detectedProblem,
      urgencyScore,
      akimateRelevanceScore,
      estimatedRepairCostKZT,
      repairDeadline,
      formData.description,
      formData.location
    ),
    modelVersion: "mock-cv-risk-model-v0.1"
  };
}
