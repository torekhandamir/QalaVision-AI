import type { IssueStatus, Locale } from "./ai-analysis";

export const localeNames: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  kz: "KZ"
};

export const statusLabels: Record<Locale, Record<IssueStatus, string>> = {
  en: {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed"
  },
  ru: {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed"
  },
  kz: {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed"
  }
};

export const copy = {
  en: {
    nav: {
      product: "Home",
      submit: "Submit",
      ai: "Analysis",
      dashboard: "Dashboard",
      map: "Risk map"
    },
    hero: {
      eyebrow: "Track 3 · City Safety & Social Services",
      title: "AI-ready urban safety platform for Almaty",
      subtitle:
        "QalaVision AI turns citizen photos into explainable repair priority, budget estimates and operational decisions for akimat teams.",
      submitCta: "Submit issue",
      dashboardCta: "Open dashboard",
      mapCta: "View risk map",
      visualBadge: "Akimat-ready workflow",
      visualTitle:
        "Photo evidence, social impact scoring, cost estimation and repair queue in one clean product."
    },
    stats: {
      detected: "Detected issues",
      urgency: "Average urgency",
      budget: "Estimated repair budget",
      photoReady: "Photo-backed submissions",
      districts: "District coverage"
    },
    sections: {
      citizenKicker: "Citizen submission",
      citizenTitle: "Submit a street issue with evidence",
      citizenSubtitle:
        "Upload or capture a photo, share location, add address context and let QalaVision AI prepare an actionable report.",
      resultKicker: "AI analysis",
      resultTitle: "Urban risk analysis",
      resultEmpty:
        "Submit an issue first to generate a result with confidence, urgency, akimat relevance and repair budget.",
      dashboardKicker: "Akimat operations",
      dashboardTitle: "Repair prioritization dashboard",
      dashboardSubtitle:
        "Readable metrics, charts and priority queue for planning city service response.",
      mapTitle: "Almaty risk map",
      mapSubtitle:
        "OpenStreetMap layer with colored issue markers and direct links to full issue details.",
      adminTitle: "Issue details",
      adminSubtitle: "Full AI report and operational fields for akimat staff."
    },
    form: {
      district: "District of Almaty",
      location: "Location",
      useLocation: "Use my location",
      locationReady: "Location captured",
      locationDenied: "Location unavailable. Enter address manually.",
      address: "Manual address",
      addressPlaceholder: "Example: Abylai Khan Ave, near Tole Bi",
      photo: "Upload or take photo",
      photoHint: "On mobile, this can open the rear camera.",
      problem: "Problem type fallback",
      description: "Short description",
      descriptionPlaceholder:
        "Example: deep pothole near school crossing, cars avoid it and pedestrians are at risk.",
      submit: "Analyze issue",
      analyzing: "AI is analyzing urban risk...",
      confidenceBoost: "Photo attached: analysis confidence will be higher",
      noPhoto: "No photo yet",
      preview: "Photo preview",
      reset: "Clear"
    },
    result: {
      uploadedPhoto: "Uploaded photo",
      detectedProblem: "Detected issue",
      confidence: "Confidence",
      urgency: "Urgency score",
      relevance: "Relevance for akimat",
      socialImpact: "Social impact",
      cost: "Estimated repair budget",
      deadline: "Recommended deadline",
      explanation: "AI explanation",
      complaint: "Generated report text",
      formula: "Scoring formula",
      model: "Analysis engine",
      send: "Send to Akimat Dashboard",
      sent: "Sent to dashboard"
    },
    dashboard: {
      totalIssues: "Total issues",
      criticalIssues: "Critical issues",
      totalBudget: "Total budget",
      averageUrgency: "Average urgency",
      districtFilter: "District",
      urgencyFilter: "Urgency",
      allDistricts: "All districts",
      allUrgency: "All urgency",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      table: "All submissions",
      charts: "Operational intelligence",
      byDistrict: "Issues by district",
      urgencyDistribution: "Urgency distribution",
      budgetByCategory: "Budget by category",
      queue: "Priority queue",
      topIssues: "Top issues to fix first",
      issue: "Issue",
      area: "District",
      urgency: "Urgency",
      relevance: "Relevance",
      socialImpact: "Impact",
      budget: "Budget",
      deadline: "Deadline",
      status: "Status",
      openIssue: "Open full issue"
    },
    admin: {
      address: "Address",
      district: "District",
      aiDescription: "AI generated description",
      recommendation: "Repair recommendation",
      report: "Full AI report",
      status: "Status",
      evidence: "Photo evidence",
      noEvidence: "No photo evidence attached"
    },
    misc: {
      yes: "Yes",
      no: "No",
      kzt: "KZT",
      liveDemo: "Frontend MVP, AI-ready architecture",
      readyApi:
        "The analysis module can be replaced by OpenAI API, custom computer vision or YOLO later."
    }
  },
  ru: {
    nav: {
      product: "Главная",
      submit: "Заявка",
      ai: "Анализ",
      dashboard: "Dashboard",
      map: "Карта"
    },
    hero: {
      eyebrow: "Track 3 · City Safety & Social Services",
      title: "AI-ready платформа городской безопасности для Алматы",
      subtitle:
        "QalaVision AI превращает фото жителей в объяснимый приоритет ремонта, оценку бюджета и решения для команд акимата.",
      submitCta: "Подать заявку",
      dashboardCta: "Открыть dashboard",
      mapCta: "Открыть карту",
      visualBadge: "Workflow для акимата",
      visualTitle:
        "Фото-доказательство, социальный impact, оценка стоимости и очередь ремонта в одном продукте."
    },
    stats: {
      detected: "Обнаружено проблем",
      urgency: "Средняя срочность",
      budget: "Оценочный бюджет ремонта",
      photoReady: "Заявки с фото",
      districts: "Покрытие районов"
    },
    sections: {
      citizenKicker: "Заявка жителя",
      citizenTitle: "Сообщите о городской проблеме с доказательством",
      citizenSubtitle:
        "Загрузите или сделайте фото, добавьте геолокацию, адрес и описание, а QalaVision AI подготовит отчет.",
      resultKicker: "AI-анализ",
      resultTitle: "Анализ городского риска",
      resultEmpty:
        "Сначала отправьте заявку, чтобы получить confidence, urgency, relevance и бюджет ремонта.",
      dashboardKicker: "Операции акимата",
      dashboardTitle: "Dashboard приоритизации ремонта",
      dashboardSubtitle:
        "Читаемые метрики, графики и priority queue для планирования городских служб.",
      mapTitle: "Карта рисков Алматы",
      mapSubtitle:
        "OpenStreetMap слой с цветными точками заявок и переходом в полную карточку проблемы.",
      adminTitle: "Детали заявки",
      adminSubtitle: "Полный AI report и операционные поля для сотрудников акимата."
    },
    form: {
      district: "Район Алматы",
      location: "Геолокация",
      useLocation: "Использовать мою геолокацию",
      locationReady: "Геолокация получена",
      locationDenied: "Геолокация недоступна. Введите адрес вручную.",
      address: "Адрес вручную",
      addressPlaceholder: "Например: проспект Абылай хана, рядом с Толе би",
      photo: "Загрузить или сделать фото",
      photoHint: "На телефоне может открыться задняя камера.",
      problem: "Fallback тип проблемы",
      description: "Короткое описание",
      descriptionPlaceholder:
        "Пример: глубокая яма возле школьного перехода, машины объезжают ее и пешеходы рискуют.",
      submit: "Проанализировать",
      analyzing: "AI анализирует городской риск...",
      confidenceBoost: "Фото добавлено: уверенность анализа будет выше",
      noPhoto: "Фото пока нет",
      preview: "Превью фото",
      reset: "Очистить"
    },
    result: {
      uploadedPhoto: "Загруженное фото",
      detectedProblem: "Найденная проблема",
      confidence: "Confidence",
      urgency: "Urgency score",
      relevance: "Relevance для акимата",
      socialImpact: "Social impact",
      cost: "Оценочный бюджет ремонта",
      deadline: "Рекомендуемый срок",
      explanation: "AI объяснение",
      complaint: "Сгенерированный report",
      formula: "Формула оценки",
      model: "Analysis engine",
      send: "Отправить в dashboard акимата",
      sent: "Отправлено в dashboard"
    },
    dashboard: {
      totalIssues: "Всего заявок",
      criticalIssues: "Критичные",
      totalBudget: "Общий бюджет",
      averageUrgency: "Средняя срочность",
      districtFilter: "Район",
      urgencyFilter: "Срочность",
      allDistricts: "Все районы",
      allUrgency: "Любая срочность",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      table: "Все заявки",
      charts: "Операционная аналитика",
      byDistrict: "Заявки по районам",
      urgencyDistribution: "Распределение срочности",
      budgetByCategory: "Бюджет по категориям",
      queue: "Priority queue",
      topIssues: "Что чинить первым",
      issue: "Заявка",
      area: "Район",
      urgency: "Urgency",
      relevance: "Relevance",
      socialImpact: "Impact",
      budget: "Бюджет",
      deadline: "Срок",
      status: "Статус",
      openIssue: "Открыть заявку"
    },
    admin: {
      address: "Адрес",
      district: "Район",
      aiDescription: "AI описание",
      recommendation: "Рекомендация ремонта",
      report: "Полный AI report",
      status: "Статус",
      evidence: "Фото-доказательство",
      noEvidence: "Фото не прикреплено"
    },
    misc: {
      yes: "Да",
      no: "Нет",
      kzt: "KZT",
      liveDemo: "Frontend MVP, AI-ready архитектура",
      readyApi:
        "Модуль анализа можно заменить на OpenAI API, custom computer vision или YOLO."
    }
  },
  kz: {
    nav: {
      product: "Басты",
      submit: "Өтініш",
      ai: "Талдау",
      dashboard: "Dashboard",
      map: "Карта"
    },
    hero: {
      eyebrow: "Track 3 · City Safety & Social Services",
      title: "Алматыға арналған AI-ready қалалық қауіпсіздік платформасы",
      subtitle:
        "QalaVision AI тұрғын фотосын түсіндірілетін жөндеу басымдығына, бюджет бағасына және әкімдік шешіміне айналдырады.",
      submitCta: "Өтініш жіберу",
      dashboardCta: "Dashboard ашу",
      mapCta: "Картаны көру",
      visualBadge: "Әкімдікке дайын workflow",
      visualTitle:
        "Фото дәлелі, әлеуметтік impact, құн бағасы және жөндеу кезегі бір өнімде."
    },
    stats: {
      detected: "Анықталған мәселелер",
      urgency: "Орташа шұғылдық",
      budget: "Жөндеу бюджеті",
      photoReady: "Фото қосылған өтініштер",
      districts: "Аудандар қамтылуы"
    },
    sections: {
      citizenKicker: "Тұрғын өтініші",
      citizenTitle: "Қалалық мәселені дәлелмен жіберіңіз",
      citizenSubtitle:
        "Фото жүктеп немесе түсіріп, геолокация, мекенжай және сипаттама қосыңыз. QalaVision AI есеп дайындайды.",
      resultKicker: "AI талдау",
      resultTitle: "Қалалық тәуекел талдауы",
      resultEmpty:
        "Confidence, urgency, relevance және бюджет алу үшін алдымен өтініш жіберіңіз.",
      dashboardKicker: "Әкімдік операциялары",
      dashboardTitle: "Жөндеу басымдығы dashboard",
      dashboardSubtitle:
        "Қалалық қызметтерді жоспарлауға арналған метрикалар, графиктер және priority queue.",
      mapTitle: "Алматы тәуекел картасы",
      mapSubtitle:
        "OpenStreetMap қабатында түрлі түсті өтініш нүктелері және толық карточкаға өту.",
      adminTitle: "Өтініш детальдары",
      adminSubtitle: "Әкімдік қызметкерлеріне арналған толық AI report және операциялық өрістер."
    },
    form: {
      district: "Алматы ауданы",
      location: "Геолокация",
      useLocation: "Геолокациямды қолдану",
      locationReady: "Геолокация алынды",
      locationDenied: "Геолокация қолжетімсіз. Мекенжайды қолмен енгізіңіз.",
      address: "Мекенжай қолмен",
      addressPlaceholder: "Мысалы: Абылай хан даңғылы, Төле би маңы",
      photo: "Фото жүктеу немесе түсіру",
      photoHint: "Телефонда артқы камера ашылуы мүмкін.",
      problem: "Fallback мәселе түрі",
      description: "Қысқа сипаттама",
      descriptionPlaceholder:
        "Мысал: мектеп өткелі жанында терең шұңқыр бар, көліктер айналып өтіп, жаяу жүргіншілерге қауіп төнеді.",
      submit: "Талдау",
      analyzing: "AI қалалық тәуекелді талдап жатыр...",
      confidenceBoost: "Фото қосылды: талдау сенімділігі жоғары болады",
      noPhoto: "Фото әлі жоқ",
      preview: "Фото preview",
      reset: "Тазалау"
    },
    result: {
      uploadedPhoto: "Жүктелген фото",
      detectedProblem: "Анықталған мәселе",
      confidence: "Confidence",
      urgency: "Urgency score",
      relevance: "Әкімдікке relevance",
      socialImpact: "Social impact",
      cost: "Жөндеу бюджеті",
      deadline: "Ұсынылатын мерзім",
      explanation: "AI түсіндірмесі",
      complaint: "Жасалған report",
      formula: "Бағалау формуласы",
      model: "Analysis engine",
      send: "Әкімдік dashboard-ына жіберу",
      sent: "Dashboard-қа жіберілді"
    },
    dashboard: {
      totalIssues: "Барлық өтініштер",
      criticalIssues: "Critical",
      totalBudget: "Жалпы бюджет",
      averageUrgency: "Орташа шұғылдық",
      districtFilter: "Аудан",
      urgencyFilter: "Шұғылдық",
      allDistricts: "Барлық аудандар",
      allUrgency: "Барлық шұғылдық",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      table: "Барлық өтініштер",
      charts: "Операциялық аналитика",
      byDistrict: "Аудан бойынша өтініштер",
      urgencyDistribution: "Шұғылдық таралуы",
      budgetByCategory: "Санат бойынша бюджет",
      queue: "Priority queue",
      topIssues: "Алдымен жөнделетін мәселелер",
      issue: "Өтініш",
      area: "Аудан",
      urgency: "Urgency",
      relevance: "Relevance",
      socialImpact: "Impact",
      budget: "Бюджет",
      deadline: "Мерзім",
      status: "Статус",
      openIssue: "Өтінішті ашу"
    },
    admin: {
      address: "Мекенжай",
      district: "Аудан",
      aiDescription: "AI сипаттамасы",
      recommendation: "Жөндеу ұсынысы",
      report: "Толық AI report",
      status: "Статус",
      evidence: "Фото дәлелі",
      noEvidence: "Фото тіркелмеген"
    },
    misc: {
      yes: "Иә",
      no: "Жоқ",
      kzt: "KZT",
      liveDemo: "Frontend MVP, AI-ready архитектура",
      readyApi:
        "Талдау модулін OpenAI API, custom computer vision немесе YOLO-ға ауыстыруға болады."
    }
  }
} as const;
