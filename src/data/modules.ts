import type { Locale, ModuleColorKey, ModuleInfo } from "@/types/calendar";

export const MODULE_COLORS: Record<
  ModuleColorKey,
  {
    bg: string;
    bgHover: string;
    border: string;
    text: string;
    dot: string;
    badge: string;
  }
> = {
  amber: {
    bg: "bg-amber-50",
    bgHover: "hover:bg-amber-100/80",
    border: "border-amber-200",
    text: "text-amber-900",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
  },
  sky: {
    bg: "bg-sky-50",
    bgHover: "hover:bg-sky-100/80",
    border: "border-sky-200",
    text: "text-sky-900",
    dot: "bg-sky-500",
    badge: "bg-sky-100 text-sky-900 border-sky-200",
  },
  violet: {
    bg: "bg-violet-50",
    bgHover: "hover:bg-violet-100/80",
    border: "border-violet-200",
    text: "text-violet-900",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-900 border-violet-200",
  },
  rose: {
    bg: "bg-rose-50",
    bgHover: "hover:bg-rose-100/80",
    border: "border-rose-200",
    text: "text-rose-900",
    dot: "bg-rose-500",
    badge: "bg-rose-100 text-rose-900 border-rose-200",
  },
  emerald: {
    bg: "bg-emerald-50",
    bgHover: "hover:bg-emerald-100/80",
    border: "border-emerald-200",
    text: "text-emerald-900",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-200",
  },
  indigo: {
    bg: "bg-indigo-50",
    bgHover: "hover:bg-indigo-100/80",
    border: "border-indigo-200",
    text: "text-indigo-900",
    dot: "bg-indigo-500",
    badge: "bg-indigo-100 text-indigo-900 border-indigo-200",
  },
  cyan: {
    bg: "bg-cyan-50",
    bgHover: "hover:bg-cyan-100/80",
    border: "border-cyan-200",
    text: "text-cyan-900",
    dot: "bg-cyan-500",
    badge: "bg-cyan-100 text-cyan-900 border-cyan-200",
  },
  fuchsia: {
    bg: "bg-fuchsia-50",
    bgHover: "hover:bg-fuchsia-100/80",
    border: "border-fuchsia-200",
    text: "text-fuchsia-900",
    dot: "bg-fuchsia-500",
    badge: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200",
  },
  teal: {
    bg: "bg-teal-50",
    bgHover: "hover:bg-teal-100/80",
    border: "border-teal-200",
    text: "text-teal-900",
    dot: "bg-teal-500",
    badge: "bg-teal-100 text-teal-900 border-teal-200",
  },
  orange: {
    bg: "bg-orange-50",
    bgHover: "hover:bg-orange-100/80",
    border: "border-orange-200",
    text: "text-orange-900",
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-900 border-orange-200",
  },
  blue: {
    bg: "bg-blue-50",
    bgHover: "hover:bg-blue-100/80",
    border: "border-blue-200",
    text: "text-blue-900",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-900 border-blue-200",
  },
  slate: {
    bg: "bg-slate-50",
    bgHover: "hover:bg-slate-100/80",
    border: "border-slate-200",
    text: "text-slate-800",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

/**
 * Master list of units/modules in chronological study order.
 * Tip: When a professor uses a recurring Teams URL for every session,
 * add it to `streamUrls: { M11: "https://...", M12: "https://..." }`
 * (or `defaultMeetingUrl` if both M11 and M12 share the exact same room).
 */
export const MODULES: ModuleInfo[] = [
  // ===================== INFORMACIÓN GENERAL / AULA TUTOR =====================
  {
    id: "aula-tutor",
    code: "TUTOR",
    name: "AULA TUTOR: MÁSTER UNIVERSITARIO EN INTELIGENCIA ARTIFICIAL ONLINE",
    nameEn: "Tutor Hub: Online Master's in Artificial Intelligence",
    shortName: "Aula Tutor (General)",
    shortNameEn: "Tutor Hub (General)",
    color: "slate",
    category: "general",
    semester: "general",
    canvasUrl: "https://campus.europaeducationgroup.es/courses/182658",
    descriptionEs:
      "Información general del Máster, calendario académico, normativa, avisos de coordinación y tutoría.",
    descriptionEn:
      "General Master's program info, academic calendar, guidelines, coordination announcements, and tutoring.",
  },

  // ===================== 1º SEMESTRE (Official UE Valencia Study Order) =====================
  {
    id: "intro-ds-ia",
    code: "IDS",
    name: "INTRODUCCIÓN AL DATA SCIENCE Y A LA INTELIGENCIA ARTIFICIAL",
    nameEn: "Introduction to Data Science and Artificial Intelligence",
    shortName: "Intro DS & IA",
    shortNameEn: "Intro DS & AI",
    color: "indigo",
    category: "core",
    semester: 1,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173859",
    descriptionEs:
      "1º Semestre · Módulo 1 (finalizado el 19 nov 2026). Fundamentos del análisis de datos e Inteligencia Artificial.",
    descriptionEn:
      "1st Semester · Module 1 (completed Nov 19, 2026). Fundamentals of Data Science and Artificial Intelligence.",
    professors: {
      M12: "Sonia Montagud Gregori",
    },
    grading: [
      {
        id: "ids-u1",
        unitLabelEs: "Unidad 1",
        unitLabelEn: "Unit 1",
        titleEs: "No tiene actividad puntuable",
        titleEn: "No graded activity",
        weightPercent: 0,
        type: "none",
      },
      {
        id: "ids-u2",
        unitLabelEs: "Unidad 2",
        unitLabelEn: "Unit 2",
        titleEs: "Actividad. Instalación de Airbyte y prueba ETL con PokéAPI",
        titleEn: "Activity. Airbyte installation and ETL test with PokéAPI",
        weightPercent: 10,
        type: "task",
        assignmentId: "ids-act-1",
      },
      {
        id: "ids-u3",
        unitLabelEs: "Unidad 3",
        unitLabelEn: "Unit 3",
        titleEs: "Cuestionario unidad 3",
        titleEn: "Unit 3 Quiz",
        weightPercent: 5,
        type: "quiz",
        assignmentId: "ids-act-2",
      },
      {
        id: "ids-u4",
        unitLabelEs: "Unidad 4",
        unitLabelEn: "Unit 4",
        titleEs: "Cuestionario unidad 4",
        titleEn: "Unit 4 Quiz",
        weightPercent: 5,
        type: "quiz",
        assignmentId: "ids-act-3",
      },
      {
        id: "ids-u5",
        unitLabelEs: "Unidad 5",
        unitLabelEn: "Unit 5",
        titleEs: "Actividad. Desarrollo de un caso de IA aplicada",
        titleEn: "Activity. Applied AI case development",
        weightPercent: 20,
        type: "task",
        assignmentId: "ids-act-4",
      },
      {
        id: "ids-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Prueba final de conocimientos",
        titleEn: "Final knowledge exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 abr 2027 (Pruebas 1º Semestre)",
        dueDateLabelEn: "Apr 10–11, 2027 (1st Semester Exams)",
      },
    ],
    streamUrls: {},
  },
  {
    id: "ml",
    code: "ML",
    name: "MACHINE LEARNING: APRENDIZAJE SUPERVISADO, NO SUPERVISADO Y REFORZADO",
    nameEn: "Machine Learning: Supervised, Unsupervised and Reinforcement Learning",
    shortName: "Machine Learning",
    shortNameEn: "Machine Learning",
    color: "emerald",
    category: "core",
    semester: 1,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173855",
    descriptionEs:
      "1º Semestre · Módulo 2 (23 nov – 14 dic 2026). Aprendizaje supervisado, no supervisado y por refuerzo.",
    descriptionEn:
      "1st Semester · Module 2 (Nov 23 – Dec 14, 2026). Supervised, unsupervised, and reinforcement learning.",
    professors: {
      M12: "Álvaro López López",
    },
    streamUrls: {
      M12: "https://teams.microsoft.com/meet/3113043422135988?p=7RimwpH2Y9tKfvSvX2",
    },
  },
  {
    id: "deep-learning",
    code: "DL",
    name: "REDES NEURONALES Y DEEP LEARNING",
    nameEn: "Neural Networks and Deep Learning",
    shortName: "Deep Learning",
    shortNameEn: "Deep Learning",
    color: "violet",
    category: "core",
    semester: 1,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173870",
    descriptionEs:
      "1º Semestre · Módulo 3. Redes neuronales profundas con TensorFlow y Keras.",
    descriptionEn:
      "1st Semester · Module 3. Deep neural networks with TensorFlow and Keras.",
    streamUrls: {},
  },
  {
    id: "genai",
    code: "GENAI",
    name: "IA GENERATIVA: SISTEMAS ABIERTOS Y SISTEMAS PROPIETARIOS",
    nameEn: "Generative AI: Open and Proprietary Systems",
    shortName: "IA Generativa",
    shortNameEn: "Generative AI",
    color: "fuchsia",
    category: "core",
    semester: 1,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173861",
    descriptionEs:
      "1º Semestre · Módulo 4. Sistemas generativos abiertos y propietarios.",
    descriptionEn:
      "1st Semester · Module 4. Open-source and proprietary generative AI systems.",
    streamUrls: {},
  },
  {
    id: "nlp",
    code: "NLP",
    name: "PROCESAMIENTO DEL LENGUAJE NATURAL",
    nameEn: "Natural Language Processing",
    shortName: "NLP",
    shortNameEn: "NLP",
    color: "teal",
    category: "core",
    semester: 1,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173867",
    descriptionEs:
      "1º Semestre · Módulo 5. Procesamiento del lenguaje natural.",
    descriptionEn:
      "1st Semester · Module 5. Natural Language Processing.",
    streamUrls: {},
  },

  // ===================== CERTIFICACIONES CLOUD & IA (MARTES · NOV–ABR) =====================
  {
    id: "cert-aws",
    code: "AWS AIF-C01",
    name: "AWS Certified AI Practitioner (AIF-C01)",
    nameEn: "AWS Certified AI Practitioner (AIF-C01)",
    shortName: "AWS AI Cert",
    shortNameEn: "AWS AI Cert",
    color: "orange",
    category: "certification",
    semester: "cert",
    descriptionEs:
      "Clases 2–10 (Nov–Feb). Conceptos de IA, ML e IA generativa en AWS; Bedrock, SageMaker AI, IA responsable, seguridad y gobernanza.",
    descriptionEn:
      "Classes 2–10 (Nov–Feb). AI, ML & generative AI concepts on AWS; Bedrock, SageMaker AI, Responsible AI, security & governance.",
    professors: {
      M12: "Moisés Alberto Álvaro Blanco",
    },
    streamUrls: {
      M12: "https://teams.microsoft.com/meet/3612576670268743?p=dFyko7jsTDFCiVHmIs",
    },
  },
  {
    id: "cert-azure",
    code: "Azure AI-901",
    name: "Microsoft Azure AI Fundamentals (AI-901)",
    nameEn: "Microsoft Azure AI Fundamentals (AI-901)",
    shortName: "Azure AI Cert",
    shortNameEn: "Azure AI Cert",
    color: "sky",
    category: "certification",
    semester: "cert",
    descriptionEs:
      "Clases 11–18 (Feb–Abr). Conceptos de IA y práctica en Microsoft Foundry; modelos, agentes, voz, visión, extracción, Python, REST APIs y SDKs.",
    descriptionEn:
      "Classes 11–18 (Feb–Apr). AI concepts & hands-on Microsoft Foundry; models, agents, speech, vision, extraction, Python, REST APIs & SDKs.",
    streamUrls: {},
  },

  // ===================== 2º SEMESTRE (Official UE Valencia Study Order) =====================
  {
    id: "cv",
    code: "CV",
    name: "COMPUTER VISION",
    nameEn: "Computer Vision",
    shortName: "Computer Vision",
    shortNameEn: "Computer Vision",
    color: "cyan",
    category: "core",
    semester: 2,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173853",
    descriptionEs: "2º Semestre · Módulo 6. Visión por computador.",
    descriptionEn: "2nd Semester · Module 6. Computer Vision.",
    streamUrls: {},
  },
  {
    id: "ia-ciberseguridad",
    code: "CIBER",
    name: "IA EN CIBERSEGURIDAD",
    nameEn: "AI in Cybersecurity",
    shortName: "IA Ciberseguridad",
    shortNameEn: "AI in Cybersecurity",
    color: "rose",
    category: "core",
    semester: 2,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173854",
    descriptionEs:
      "2º Semestre · Módulo 7. Inteligencia Artificial aplicada a la ciberseguridad.",
    descriptionEn:
      "2nd Semester · Module 7. Artificial Intelligence applied to cybersecurity.",
    streamUrls: {},
  },
  {
    id: "ia-sociedad",
    code: "SOC",
    name: "IA PARA LA SOCIEDAD Y LA EMPRESA",
    nameEn: "AI for Society and Business",
    shortName: "IA Sociedad",
    shortNameEn: "AI for Society",
    color: "amber",
    category: "core",
    semester: 2,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173856",
    descriptionEs:
      "2º Semestre · Módulo 8. Ética, impacto empresarial y social de la IA.",
    descriptionEn:
      "2nd Semester · Module 8. Ethics, business, and societal impact of AI.",
    streamUrls: {},
  },
  {
    id: "metodologia",
    code: "MET",
    name: "METODOLOGÍA DE LA INVESTIGACIÓN",
    nameEn: "Research Methodology",
    shortName: "Metodología",
    shortNameEn: "Research Methodology",
    color: "blue",
    category: "core",
    semester: 2,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173862",
    descriptionEs:
      "2º Semestre · Itinerario electivo (Prácticas en empresa o Metodología de la Investigación para I+D / doctorado).",
    descriptionEn:
      "2nd Semester · Elective track (Company Internship or Research Methodology for R&D / PhD).",
    streamUrls: {},
  },

  // ===================== TRABAJO FIN DE MÁSTER =====================
  {
    id: "tfm",
    code: "TFM",
    name: "TRABAJO FIN DE MÁSTER",
    nameEn: "Master's Thesis (TFM)",
    shortName: "TFM",
    shortNameEn: "Master's Thesis",
    color: "rose",
    category: "tfm",
    semester: "tfm",
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173858",
    descriptionEs:
      "Proyecto aplicado o de investigación que reúne todo lo aprendido. Defensa ordinaria: 16–21 oct 2027.",
    descriptionEn:
      "Applied or research capstone project. Ordinary defense: Oct 16–21, 2027.",
    streamUrls: {},
  },

  // Placeholder for scheduled sessions whose module hasn't been mapped yet
  {
    id: "tbd",
    code: "MIA",
    name: "Máster en IA · Módulo por confirmar",
    nameEn: "Masters in AI · Module TBD",
    shortName: "Módulo por confirmar",
    shortNameEn: "Module TBD",
    color: "slate",
    category: "unassigned",
    descriptionEs:
      "Clase programada en el calendario general. Actualiza el moduleId en src/data/sessions.ts cuando se confirme la asignatura.",
    descriptionEn:
      "Scheduled class on the general timetable. Update moduleId in src/data/sessions.ts once the module is confirmed.",
  },
];

export const MODULES_BY_ID: Record<string, ModuleInfo> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
);

export function getModule(moduleId: string): ModuleInfo {
  return MODULES_BY_ID[moduleId] ?? MODULES_BY_ID.tbd;
}

export function getModuleShortName(mod: ModuleInfo, locale: Locale): string {
  return locale === "en" && mod.shortNameEn ? mod.shortNameEn : mod.shortName;
}
