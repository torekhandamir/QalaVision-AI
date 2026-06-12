import type { IssueStatus, Locale } from "./ai-analysis";

export const localeNames: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  kz: "KZ"
};

export const statusLabels: Record<Locale, Record<IssueStatus, string>> = {
  en: {
    new: "New",
    triaged: "Triaged",
    scheduled: "Scheduled",
    in_progress: "In progress"
  },
  ru: {
    new: "Новая",
    triaged: "Проверена",
    scheduled: "Запланирована",
    in_progress: "В работе"
  },
  kz: {
    new: "Жаңа",
    triaged: "Сұрыпталды",
    scheduled: "Жоспарланды",
    in_progress: "Орындалуда"
  }
};

export const copy = {
  en: {
    nav: {
      product: "Product",
      submit: "Submit issue",
      dashboard: "Akimate dashboard",
      ai: "AI analysis"
    },
    hero: {
      eyebrow: "Track 3 · City Safety & Social Services",
      title:
        "QalaVision AI — AI platform for urban issue detection and repair prioritization",
      subtitle:
        "Citizen reports become explainable AI triage, budget estimates and a repair priority queue for Almaty akimate teams.",
      submitCta: "Submit issue",
      dashboardCta: "Akimate dashboard",
      visualBadge: "Live urban risk layer",
      visualTitle: "Computer vision signals, civic impact and repair readiness in one workflow."
    },
    stats: {
      detected: "Detected issues",
      urgency: "Average urgency",
      budget: "Estimated repair budget",
      photoReady: "Photo-backed submissions",
      districts: "District coverage"
    },
    sections: {
      citizenKicker: "Citizen workflow",
      citizenTitle: "Submit a street issue in under a minute",
      citizenSubtitle:
        "The form works without backend services today and is ready to send image, location and context to a real model later.",
      resultKicker: "Explainable AI",
      resultTitle: "Analysis result",
      resultEmpty:
        "Submit an issue to generate confidence, urgency, akimate relevance, budget and complaint text.",
      dashboardKicker: "Akimat operations",
      dashboardTitle: "Repair prioritization dashboard",
      dashboardSubtitle:
        "Filter issues, inspect budget pressure and see the priority queue that city teams should repair first."
    },
    form: {
      district: "District of Almaty",
      location: "Location",
      useLocation: "Use my location",
      locationReady: "Location captured",
      locationDenied: "Location unavailable. You can still submit the issue.",
      photo: "Upload or take photo",
      photoHint: "Camera input is enabled on mobile devices.",
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
      detectedProblem: "Problem type",
      confidence: "Confidence",
      urgency: "Urgency score",
      relevance: "Akimate relevance",
      cost: "Estimated repair cost",
      deadline: "Recommended deadline",
      explanation: "Why this score",
      complaint: "Generated complaint text",
      formula: "Urgency formula",
      model: "Model"
    },
    dashboard: {
      totalIssues: "Total issues",
      criticalIssues: "Critical issues",
      totalBudget: "Total estimated budget",
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
      budgetByCategory: "Repair budget by category",
      map: "Almaty risk map",
      queue: "Priority queue",
      topIssues: "Top issues to fix first",
      issue: "Issue",
      area: "District",
      urgency: "Urgency",
      relevance: "Relevance",
      budget: "Budget",
      deadline: "Deadline",
      status: "Status",
      photo: "Photo"
    },
    misc: {
      yes: "Yes",
      no: "No",
      kzt: "KZT",
      liveDemo: "Frontend demo, no backend required",
      readyApi:
        "Mock AI module can be replaced by OpenAI API, custom CV or YOLO endpoint."
    }
  },
  ru: {
    nav: {
      product: "Продукт",
      submit: "Подать заявку",
      dashboard: "Панель акимата",
      ai: "AI-анализ"
    },
    hero: {
      eyebrow: "Track 3 · City Safety & Social Services",
      title:
        "QalaVision AI — AI-платформа для выявления городских проблем и приоритизации ремонта",
      subtitle:
        "Жалобы жителей превращаются в объяснимую AI-триаж систему, оценку бюджета и очередь ремонта для команд акимата Алматы.",
      submitCta: "Подать заявку",
      dashboardCta: "Панель акимата",
      visualBadge: "Живой слой городского риска",
      visualTitle: "Компьютерное зрение, социальный риск и готовность ремонта в одном процессе."
    },
    stats: {
      detected: "Обнаружено проблем",
      urgency: "Средняя срочность",
      budget: "Оценка бюджета ремонта",
      photoReady: "Заявки с фото",
      districts: "Покрытие районов"
    },
    sections: {
      citizenKicker: "Путь жителя",
      citizenTitle: "Сообщить о проблеме на улице меньше чем за минуту",
      citizenSubtitle:
        "Форма работает без backend уже сейчас и готова позже отправлять фото, геолокацию и контекст в настоящую модель.",
      resultKicker: "Объяснимый AI",
      resultTitle: "Результат анализа",
      resultEmpty:
        "Отправьте заявку, чтобы получить уверенность, срочность, релевантность для акимата, бюджет и текст обращения.",
      dashboardKicker: "Операции акимата",
      dashboardTitle: "Панель приоритизации ремонта",
      dashboardSubtitle:
        "Фильтруйте заявки, оценивайте бюджетную нагрузку и смотрите очередь работ, которые нужно исправить первыми."
    },
    form: {
      district: "Район Алматы",
      location: "Геолокация",
      useLocation: "Использовать мою геолокацию",
      locationReady: "Геолокация получена",
      locationDenied: "Геолокация недоступна. Заявку можно отправить без нее.",
      photo: "Загрузить или сделать фото",
      photoHint: "На телефоне откроется камера для съемки на месте.",
      problem: "Тип проблемы как fallback",
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
      detectedProblem: "Тип проблемы",
      confidence: "Уверенность",
      urgency: "Срочность",
      relevance: "Релевантность для акимата",
      cost: "Оценка стоимости ремонта",
      deadline: "Рекомендуемый срок",
      explanation: "Почему такой балл",
      complaint: "Сгенерированный текст обращения",
      formula: "Формула срочности",
      model: "Модель"
    },
    dashboard: {
      totalIssues: "Всего заявок",
      criticalIssues: "Критичные заявки",
      totalBudget: "Общий бюджет ремонта",
      averageUrgency: "Средняя срочность",
      districtFilter: "Район",
      urgencyFilter: "Срочность",
      allDistricts: "Все районы",
      allUrgency: "Любая срочность",
      critical: "Критично",
      high: "Высокая",
      medium: "Средняя",
      low: "Низкая",
      table: "Все заявки",
      charts: "Операционная аналитика",
      byDistrict: "Заявки по районам",
      urgencyDistribution: "Распределение срочности",
      budgetByCategory: "Бюджет по категориям",
      map: "Карта рисков Алматы",
      queue: "Очередь приоритета",
      topIssues: "Что чинить первым",
      issue: "Заявка",
      area: "Район",
      urgency: "Срочность",
      relevance: "Релевантность",
      budget: "Бюджет",
      deadline: "Срок",
      status: "Статус",
      photo: "Фото"
    },
    misc: {
      yes: "Да",
      no: "Нет",
      kzt: "KZT",
      liveDemo: "Frontend demo без backend",
      readyApi:
        "Mock AI модуль легко заменить на OpenAI API, custom CV или YOLO endpoint."
    }
  },
  kz: {
    nav: {
      product: "Өнім",
      submit: "Өтініш жіберу",
      dashboard: "Әкімдік панелі",
      ai: "AI талдау"
    },
    hero: {
      eyebrow: "Track 3 · City Safety & Social Services",
      title:
        "QalaVision AI — қалалық мәселелерді анықтап, жөндеуді басымдыққа қоятын AI платформа",
      subtitle:
        "Тұрғын өтініштері түсіндірілетін AI триажға, бюджет бағасына және Алматы әкімдігі үшін жөндеу кезегіне айналады.",
      submitCta: "Өтініш жіберу",
      dashboardCta: "Әкімдік панелі",
      visualBadge: "Қалалық тәуекелдің live қабаты",
      visualTitle: "Компьютерлік көру, қоғамдық әсер және жөндеу дайындығы бір ағында."
    },
    stats: {
      detected: "Анықталған мәселелер",
      urgency: "Орташа шұғылдық",
      budget: "Жөндеу бюджеті",
      photoReady: "Фото қосылған өтініштер",
      districts: "Аудандар қамтылуы"
    },
    sections: {
      citizenKicker: "Тұрғын жолы",
      citizenTitle: "Көше мәселесін бір минутқа жетпей жіберіңіз",
      citizenSubtitle:
        "Форма backend-сіз жұмыс істейді және кейін фото, геолокация мен контекстті нақты модельге жіберуге дайын.",
      resultKicker: "Түсіндірілетін AI",
      resultTitle: "Талдау нәтижесі",
      resultEmpty:
        "Сенімділік, шұғылдық, әкімдікке релеванттылық, бюджет және өтініш мәтінін алу үшін мәселе жіберіңіз.",
      dashboardKicker: "Әкімдік операциялары",
      dashboardTitle: "Жөндеу басымдығы панелі",
      dashboardSubtitle:
        "Өтініштерді сүзгіден өткізіп, бюджет қысымын бағалап, бірінші жөнделетін мәселелер кезегін көріңіз."
    },
    form: {
      district: "Алматы ауданы",
      location: "Геолокация",
      useLocation: "Менің геолокациямды қолдану",
      locationReady: "Геолокация алынды",
      locationDenied: "Геолокация қолжетімсіз. Өтінішті онсыз жіберуге болады.",
      photo: "Фото жүктеу немесе түсіру",
      photoHint: "Телефонда камера ашылып, фотоны бірден түсіруге болады.",
      problem: "Fallback мәселе түрі",
      description: "Қысқа сипаттама",
      descriptionPlaceholder:
        "Мысал: мектеп өткелінің жанында терең шұңқыр бар, көліктер айналып өтіп, жаяу жүргіншілерге қауіп төнеді.",
      submit: "Талдау",
      analyzing: "AI қалалық тәуекелді талдап жатыр...",
      confidenceBoost: "Фото қосылды: талдау сенімділігі жоғары болады",
      noPhoto: "Фото әлі жоқ",
      preview: "Фото preview",
      reset: "Тазалау"
    },
    result: {
      detectedProblem: "Мәселе түрі",
      confidence: "Сенімділік",
      urgency: "Шұғылдық",
      relevance: "Әкімдікке релеванттылық",
      cost: "Жөндеу құны",
      deadline: "Ұсынылатын мерзім",
      explanation: "Неге осындай балл",
      complaint: "Жасалған өтініш мәтіні",
      formula: "Шұғылдық формуласы",
      model: "Модель"
    },
    dashboard: {
      totalIssues: "Барлық өтініштер",
      criticalIssues: "Критикалық өтініштер",
      totalBudget: "Жалпы жөндеу бюджеті",
      averageUrgency: "Орташа шұғылдық",
      districtFilter: "Аудан",
      urgencyFilter: "Шұғылдық",
      allDistricts: "Барлық аудандар",
      allUrgency: "Барлық шұғылдық",
      critical: "Критикалық",
      high: "Жоғары",
      medium: "Орташа",
      low: "Төмен",
      table: "Барлық өтініштер",
      charts: "Операциялық аналитика",
      byDistrict: "Аудан бойынша өтініштер",
      urgencyDistribution: "Шұғылдық таралуы",
      budgetByCategory: "Санат бойынша бюджет",
      map: "Алматы тәуекел картасы",
      queue: "Басымдық кезегі",
      topIssues: "Алдымен жөнделетін мәселелер",
      issue: "Өтініш",
      area: "Аудан",
      urgency: "Шұғылдық",
      relevance: "Релеванттылық",
      budget: "Бюджет",
      deadline: "Мерзім",
      status: "Статус",
      photo: "Фото"
    },
    misc: {
      yes: "Иә",
      no: "Жоқ",
      kzt: "KZT",
      liveDemo: "Backend қажет емес frontend demo",
      readyApi:
        "Mock AI модулін OpenAI API, custom CV немесе YOLO endpoint-ке оңай ауыстыруға болады."
    }
  }
} as const;
