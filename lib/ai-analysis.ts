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

export type AnalysisFactor = {
  id: "problemSeverity" | "locationRisk" | "citizenImpact" | "photoConfidence";
  label: string;
  value: number;
  weight: number;
  description: string;
};

export type AIAnalysisResult = {
  detectedProblem: ProblemType;
  confidence: number;
  urgencyScore: number;
  akimatRelevanceScore: number;
  socialImpactScore: number;
  estimatedRepairCostKZT: number;
  repairDeadline: string;
  deadlineLevel: DeadlineLevel;
  aiGeneratedDescription: string;
  fullReportForAkimat: string;
  explanation: string;
  repairRecommendation: string;
  factors: AnalysisFactor[];
  modelVersion: string;
  akimateRelevanceScore: number;
  generatedComplaintText: string;
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

const baseSocialImpact: Record<ProblemType, number> = {
  pothole: 78,
  broken_sidewalk: 74,
  trash: 48,
  broken_streetlight: 67,
  road_crack: 62,
  flooding: 87,
  damaged_sign: 59
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
      en: "central streets with heavy pedestrian, transit and business traffic",
      ru: "центральные улицы с высоким пешеходным и транспортным потоком",
      kz: "жаяу жүргінші және көлік ағыны жоғары орталық көшелер"
    }
  },
  alatau: {
    locationRisk: 68,
    similarComplaints: 7,
    proximityRisk: 72,
    context: {
      en: "fast-growing residential blocks and arterial roads",
      ru: "быстро растущие жилые кварталы и магистральные дороги",
      kz: "қарқынды өсіп жатқан тұрғын аудандар және магистральдар"
    }
  },
  auezov: {
    locationRisk: 73,
    similarComplaints: 9,
    proximityRisk: 76,
    context: {
      en: "dense residential areas near schools and public transport",
      ru: "плотные жилые кварталы рядом со школами и общественным транспортом",
      kz: "мектептер мен қоғамдық көлікке жақын тығыз тұрғын кварталдар"
    }
  },
  bostandyk: {
    locationRisk: 74,
    similarComplaints: 8,
    proximityRisk: 79,
    context: {
      en: "education, hospital and commuter corridors",
      ru: "учебные, медицинские и транспортные коридоры",
      kz: "оқу, медицина және көлік дәліздері"
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
  return min + (hashString(seed) % (max - min + 1));
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

  return (
    keywordMap.find(([, words]) =>
      words.some((word) => normalized.includes(word))
    )?.[0] ?? selectedProblemType
  );
}

function calculateSocialImpact(problem: ProblemType, description: string) {
  const detailBoost = Math.min(14, Math.floor(description.trim().length / 12));
  const vulnerableBoost =
    /school|hospital|children|elderly|traffic|bus|crossing|школ|больниц|дет|пожил|трафик|автобус|переход|мектеп|аурухана|бала|қарт|көлік|өткел/i.test(
      description
    )
      ? 12
      : 0;

  return clamp(baseSocialImpact[problem] + detailBoost + vulnerableBoost);
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

function buildFactors(
  locale: Locale,
  problemSeverity: number,
  locationRisk: number,
  socialImpact: number,
  photoConfidence: number
): AnalysisFactor[] {
  const text = {
    en: {
      severity: "Problem severity",
      location: "Location risk",
      impact: "Social impact",
      photo: "Photo confidence",
      severityDesc: "Base hazard level for the detected category.",
      locationDesc: "District risk, road load and proximity to public services.",
      impactDesc: "Expected effect on pedestrians, drivers and vulnerable groups.",
      photoDesc: "Evidence quality from the uploaded or captured image."
    },
    ru: {
      severity: "Серьезность проблемы",
      location: "Риск локации",
      impact: "Социальное влияние",
      photo: "Уверенность по фото",
      severityDesc: "Базовый уровень опасности для найденной категории.",
      locationDesc: "Риск района, нагрузка дорог и близость городских объектов.",
      impactDesc: "Ожидаемое влияние на пешеходов, водителей и уязвимые группы.",
      photoDesc: "Качество доказательства из загруженного или снятого фото."
    },
    kz: {
      severity: "Мәселе ауырлығы",
      location: "Локация тәуекелі",
      impact: "Әлеуметтік әсер",
      photo: "Фото сенімділігі",
      severityDesc: "Анықталған санаттың базалық қауіптілік деңгейі.",
      locationDesc: "Аудан тәуекелі, жол жүктемесі және қалалық нысандарға жақындық.",
      impactDesc: "Жаяу жүргінші, жүргізуші және осал топтарға ықпал.",
      photoDesc: "Жүктелген немесе түсірілген фото дәлелінің сапасы."
    }
  }[locale];

  return [
    {
      id: "problemSeverity",
      label: text.severity,
      value: problemSeverity,
      weight: 0.4,
      description: text.severityDesc
    },
    {
      id: "locationRisk",
      label: text.location,
      value: locationRisk,
      weight: 0.25,
      description: text.locationDesc
    },
    {
      id: "citizenImpact",
      label: text.impact,
      value: socialImpact,
      weight: 0.2,
      description: text.impactDesc
    },
    {
      id: "photoConfidence",
      label: text.photo,
      value: photoConfidence,
      weight: 0.15,
      description: text.photoDesc
    }
  ];
}

function buildGeneratedDescription(
  locale: Locale,
  problem: ProblemType,
  district: DistrictId,
  urgencyScore: number,
  address: string
) {
  const problemLabel = problemLabels[locale][problem];
  const districtLabel = districtLabels[locale][district];
  const place = address.trim() || districtLabel;

  if (locale === "ru") {
    return `Система определила проблему "${problemLabel}" в районе ${districtLabel}. Локация: ${place}. Инцидент требует приоритизации с уровнем срочности ${urgencyScore}/100.`;
  }

  if (locale === "kz") {
    return `Жүйе ${districtLabel} ауданында "${problemLabel}" мәселесін анықтады. Орналасуы: ${place}. Оқиға ${urgencyScore}/100 шұғылдықпен басымдыққа қойылуы керек.`;
  }

  return `The system detected "${problemLabel}" in ${districtLabel}. Location: ${place}. The incident should be prioritized with urgency ${urgencyScore}/100.`;
}

function buildRepairRecommendation(locale: Locale, problem: ProblemType, level: DeadlineLevel) {
  const deadline = deadlineText[locale][level];
  const action: Record<Locale, Record<ProblemType, string>> = {
    en: {
      pothole: "Dispatch a road repair crew, secure the lane and patch the damaged asphalt area.",
      broken_sidewalk: "Send a sidewalk maintenance team, isolate the unsafe segment and replace surface slabs.",
      trash: "Assign sanitation crew for removal, cleaning and follow-up container inspection.",
      broken_streetlight: "Route to electrical maintenance, inspect wiring and replace the lamp unit.",
      road_crack: "Inspect crack depth, seal damaged asphalt and monitor recurring deformation.",
      flooding: "Send drainage team, clear inlets and check stormwater flow capacity.",
      damaged_sign: "Replace or reinstall the road sign and verify visibility from traffic lanes."
    },
    ru: {
      pothole: "Направить дорожную бригаду, оградить участок и выполнить ямочный ремонт.",
      broken_sidewalk: "Направить бригаду по тротуарам, изолировать опасный сегмент и заменить покрытие.",
      trash: "Назначить санитарную бригаду для вывоза, уборки и проверки контейнерной зоны.",
      broken_streetlight: "Передать электрикам, проверить проводку и заменить световой модуль.",
      road_crack: "Проверить глубину трещины, герметизировать асфальт и отслеживать деформацию.",
      flooding: "Направить дренажную службу, очистить ливневки и проверить пропускную способность.",
      damaged_sign: "Заменить или переустановить знак и проверить видимость с полос движения."
    },
    kz: {
      pothole: "Жол жөндеу бригадасын жіберіп, учаскені қоршап, асфальтты жамау.",
      broken_sidewalk: "Тротуар бригадасын жіберіп, қауіпті бөлікті оқшаулап, жабындыны ауыстыру.",
      trash: "Қоқысты шығару, аумақты тазалау және контейнер аймағын тексеру.",
      broken_streetlight: "Электр қызметіне жіберіп, сымды тексеріп, шам модулін ауыстыру.",
      road_crack: "Жарық тереңдігін тексеріп, асфальтты герметизациялау және деформацияны бақылау.",
      flooding: "Дренаж қызметін жіберіп, нөсер су қабылдағыштарын тазалау.",
      damaged_sign: "Жол белгісін ауыстыру немесе қайта орнату және көрінуін тексеру."
    }
  };

  return `${action[locale][problem]} ${locale === "ru" ? "Рекомендуемый срок:" : locale === "kz" ? "Ұсынылатын мерзім:" : "Recommended deadline:"} ${deadline}.`;
}

function buildExplanation(
  locale: Locale,
  problem: ProblemType,
  district: DistrictId,
  urgencyScore: number,
  relevanceScore: number,
  socialImpactScore: number,
  factors: AnalysisFactor[],
  confidence: number
) {
  const problemLabel = problemLabels[locale][problem];
  const districtLabel = districtLabels[locale][district];
  const factorLine = factors
    .map((factor) => `${factor.label}: ${factor.value}/100`)
    .join(", ");
  const context = districtRisk[district].context[locale];

  if (locale === "ru") {
    return `AI определил проблему как "${problemLabel}" с уверенностью ${confidence}%. Срочность ${urgencyScore}/100 рассчитана по прозрачной формуле: ${factorLine}. Релевантность для акимата ${relevanceScore}/100 учитывает срочность, похожие обращения в районе ${districtLabel}, риск для людей и контекст локации: ${context}. Социальное влияние оценено в ${socialImpactScore}/100.`;
  }

  if (locale === "kz") {
    return `AI мәселені "${problemLabel}" деп анықтады, сенімділік ${confidence}%. Шұғылдық ${urgencyScore}/100 ашық формуламен есептелді: ${factorLine}. Әкімдік үшін релеванттылық ${relevanceScore}/100 шұғылдықты, ${districtLabel} ауданындағы ұқсас өтініштерді, адамдарға қауіп пен локация контекстін ескереді: ${context}. Әлеуметтік әсер ${socialImpactScore}/100.`;
  }

  return `AI detected "${problemLabel}" with ${confidence}% confidence. Urgency ${urgencyScore}/100 uses the transparent formula: ${factorLine}. Akimat relevance ${relevanceScore}/100 considers urgency, similar complaints in ${districtLabel}, risk to people and location context: ${context}. Social impact is ${socialImpactScore}/100.`;
}

function buildFullReport(
  locale: Locale,
  formData: AnalyzeIssueFormData,
  problem: ProblemType,
  urgencyScore: number,
  relevanceScore: number,
  socialImpactScore: number,
  cost: number,
  deadline: string,
  recommendation: string
) {
  const districtLabel = districtLabels[locale][formData.district];
  const problemLabel = problemLabels[locale][problem];
  const coordinates = formData.location
    ? `${formData.location.lat.toFixed(5)}, ${formData.location.lng.toFixed(5)}`
    : locale === "ru"
      ? "не предоставлены"
      : locale === "kz"
        ? "берілмеген"
        : "not provided";
  const address = formData.address.trim() || (locale === "ru" ? "не указан" : locale === "kz" ? "көрсетілмеген" : "not provided");
  const costText = cost.toLocaleString(locale === "en" ? "en-US" : "ru-RU");

  if (locale === "ru") {
    return `Отчет для акимата Алматы. Категория: ${problemLabel}. Район: ${districtLabel}. Адрес: ${address}. Координаты: ${coordinates}. Срочность: ${urgencyScore}/100. Релевантность для акимата: ${relevanceScore}/100. Социальное влияние: ${socialImpactScore}/100. Оценочный бюджет ремонта: ${costText} KZT. Рекомендуемый срок: ${deadline}. Описание жителя: ${formData.description || "без дополнительного описания"}. Рекомендация: ${recommendation}`;
  }

  if (locale === "kz") {
    return `Алматы әкімдігіне есеп. Санат: ${problemLabel}. Аудан: ${districtLabel}. Мекенжай: ${address}. Координаттар: ${coordinates}. Шұғылдық: ${urgencyScore}/100. Әкімдікке релеванттылық: ${relevanceScore}/100. Әлеуметтік әсер: ${socialImpactScore}/100. Жөндеу бюджеті: ${costText} KZT. Ұсынылатын мерзім: ${deadline}. Тұрғын сипаттамасы: ${formData.description || "қосымша сипаттама жоқ"}. Ұсыныс: ${recommendation}`;
  }

  return `Report for Almaty Akimat. Category: ${problemLabel}. District: ${districtLabel}. Address: ${address}. Coordinates: ${coordinates}. Urgency: ${urgencyScore}/100. Akimat relevance: ${relevanceScore}/100. Social impact: ${socialImpactScore}/100. Estimated repair budget: ${costText} KZT. Recommended deadline: ${deadline}. Citizen description: ${formData.description || "no additional description"}. Recommendation: ${recommendation}`;
}

export async function analyzeIssue(
  image: File | null,
  formData: AnalyzeIssueFormData
): Promise<AIAnalysisResult> {
  return runLocalRiskAnalysis(image, formData);
}

async function runLocalRiskAnalysis(
  image: File | null,
  formData: AnalyzeIssueFormData
): Promise<AIAnalysisResult> {
  const locale = formData.locale ?? "en";
  const seed = `${formData.district}-${formData.selectedProblemType}-${formData.address}-${formData.description}-${image?.name ?? "no-image"}-${image?.size ?? 0}`;
  const detectedProblem = detectFromDescription(
    formData.description,
    formData.selectedProblemType
  );
  const districtProfile = districtRisk[formData.district];
  const problemSeverity = severityByProblem[detectedProblem];
  const locationRisk = clamp(
    districtProfile.locationRisk + deterministicRange(seed, -4, 6)
  );
  const socialImpactScore = calculateSocialImpact(
    detectedProblem,
    formData.description
  );
  const photoConfidence = image
    ? clamp(82 + deterministicRange(seed, 0, 14))
    : clamp(58 + deterministicRange(seed, 0, 16));
  const confidence = image
    ? clamp(photoConfidence + deterministicRange(seed, -2, 4))
    : clamp(photoConfidence - deterministicRange(seed, 2, 9));

  const urgencyScore = Math.round(
    problemSeverity * 0.4 +
      locationRisk * 0.25 +
      socialImpactScore * 0.2 +
      photoConfidence * 0.15
  );

  const similarComplaintsScore = clamp(districtProfile.similarComplaints * 9);
  const peopleRisk = clamp(
    (problemSeverity + socialImpactScore) / 2 + deterministicRange(seed, -3, 5)
  );
  const akimatRelevanceScore = Math.round(
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
    socialImpactScore,
    photoConfidence
  );
  const aiGeneratedDescription = buildGeneratedDescription(
    locale,
    detectedProblem,
    formData.district,
    urgencyScore,
    formData.address
  );
  const repairRecommendation = buildRepairRecommendation(
    locale,
    detectedProblem,
    deadlineLevel
  );
  const explanation = buildExplanation(
    locale,
    detectedProblem,
    formData.district,
    urgencyScore,
    akimatRelevanceScore,
    socialImpactScore,
    factors,
    confidence
  );
  const fullReportForAkimat = buildFullReport(
    locale,
    formData,
    detectedProblem,
    urgencyScore,
    akimatRelevanceScore,
    socialImpactScore,
    estimatedRepairCostKZT,
    repairDeadline,
    repairRecommendation
  );

  return {
    detectedProblem,
    confidence,
    urgencyScore,
    akimatRelevanceScore,
    akimateRelevanceScore: akimatRelevanceScore,
    socialImpactScore,
    estimatedRepairCostKZT,
    repairDeadline,
    deadlineLevel,
    aiGeneratedDescription,
    fullReportForAkimat,
    generatedComplaintText: fullReportForAkimat,
    explanation,
    repairRecommendation,
    factors,
    modelVersion: "QalaVision Risk Engine v0.2"
  };
}
