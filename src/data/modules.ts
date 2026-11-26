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
    ects: 60,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/182658",
    descriptionEs:
      "Información general del Máster, calendario académico, normativa, avisos de coordinación y tutoría.",
    descriptionEn:
      "General Master's program info, academic calendar, guidelines, coordination announcements, and tutoring.",
    programOverview: {
      coDirectors: "Víctor Yeste & Idir Ouhab",
      welcomeEs:
        "El Máster Universitario en Inteligencia Artificial (60 ECTS · curso 2026–27) recorre el campo de la IA de principio a fin: desde los fundamentos del análisis de datos hasta la construcción de sistemas avanzados aplicados a problemas reales, cerrando con un Trabajo Fin de Máster aplicado o de investigación.",
      welcomeEn:
        "The Master's in Artificial Intelligence (60 ECTS · 2026–27) covers AI end to end — from data analysis fundamentals to building production-grade intelligent systems, culminating in an applied or research Master's Thesis (TFM).",
      tools: [
        "Python",
        "Pandas",
        "Scikit-learn",
        "TensorFlow",
        "Keras",
        "SQL",
        "NoSQL",
      ],
      methodologyEs:
        "Aprendizaje basado en proyectos con casos reales. Además del stack técnico, se trabaja transversalmente la ética, la gobernanza y la seguridad para desarrollar IA de forma responsable.",
      methodologyEn:
        "Hands-on project-based learning on real-world cases. Alongside the technical stack, AI ethics, governance, and safety are integrated throughout the program.",
      beyondClassroom: [
        {
          titleEs: "Masterclasses con profesionales",
          titleEn: "Industry Masterclasses",
          detailEs:
            "Sesiones con especialistas que aplican IA en salud, industria, finanzas y consultoría.",
          detailEn:
            "Sessions with practitioners applying AI across healthcare, industry, finance, and consulting.",
        },
        {
          titleEs: "Forum Europeo de IA (Encuentros NOW)",
          titleEn: "European AI Forum (Encuentros NOW)",
          detailEs:
            "Participación en el evento anual celebrado cada noviembre en Alicante.",
          detailEn:
            "Participation in the annual AI forum held every November in Alicante.",
        },
        {
          titleEs: "Certificaciones AWS y Azure",
          titleEn: "AWS & Azure Certifications",
          detailEs:
            "Preparación integrada los martes para AWS AI Practitioner (AIF-C01) y Azure AI Fundamentals (AI-901).",
          detailEn:
            "Built-in Tuesday prep tracks for AWS AI Practitioner (AIF-C01) and Azure AI Fundamentals (AI-901).",
        },
      ],
      supportEmail: "orientacioneducativa.uev@universidadeuropea.es",
      supportNoteEs:
        "La Unidad de Orientación Educativa y Diversidad (ODI) ofrece acompañamiento académico, planes personalizados, ajustes metodológicos para necesidades específicas y orientación vocacional.",
      supportNoteEn:
        "The Educational Guidance & Diversity Unit (ODI) provides academic mentoring, personalized study plans, non-significant curricular accommodations, and career guidance.",
    },
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173859",
    guidePdfUrl: "/guides/introduccion-data-science-ia.pdf",
    guideRef: "6496b3ee",
    descriptionEs:
      "1º Semestre · Módulo 1 (finalizado el 19 nov 2026). Marco conceptual e historia de la IA, razonamiento automático, preparación de datos, estructuras Big Data y programación en la nube.",
    descriptionEn:
      "1st Semester · Module 1 (completed Nov 19, 2026). AI conceptual framework & history, automated reasoning, data preparation, Big Data indexing, and cloud data science programming.",
    professors: {
      M11: "Miguel Ángel Torres",
      M12: "Sonia Montagud Gregori",
    },
    topics: [
      {
        es: "Marco conceptual y evolución histórica de la inteligencia artificial",
        en: "Conceptual framework and historical evolution of artificial intelligence",
      },
      {
        es: "Resolución de problemas, razonamiento automático y planificación",
        en: "Problem solving, automated reasoning, and planning",
      },
      {
        es: "Representación estructurada del conocimiento y razonamiento con incertidumbre",
        en: "Structured knowledge representation and reasoning under uncertainty",
      },
      {
        es: "Fundamentos del análisis de datos y técnicas de limpieza y preparación",
        en: "Data analysis fundamentals, cleaning, and preparation techniques",
      },
      {
        es: "Estructuras avanzadas y técnicas de indexación para Big Data",
        en: "Advanced data structures and indexing techniques for Big Data",
      },
      {
        es: "Programación orientada a ciencia de datos y entornos en la nube",
        en: "Data science programming and cloud computing environments",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Russell, S., & Norvig, P. (2021). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.",
      },
      {
        kind: "basic",
        citation:
          "VanderPlas, J. (2023). Python Data Science Handbook: Essential Tools for Working with Data (2nd ed.). O'Reilly Media.",
      },
      {
        kind: "basic",
        citation:
          "McKinney, W. (2022). Python for Data Analysis: Data Wrangling with pandas, NumPy, and Jupyter (3rd ed.). O'Reilly Media.",
      },
      {
        kind: "complementary",
        citation:
          "Leskovec, J., Rajaraman, A., & Ullman, J. D. (2020). Mining of Massive Datasets (3rd ed.). Cambridge University Press.",
      },
      {
        kind: "complementary",
        citation:
          "Kleppmann, M., & Riccomini, C. (2026). Designing Data-Intensive Applications (2nd ed.). O'Reilly Media.",
      },
      {
        kind: "complementary",
        citation:
          "Koller, D., & Friedman, N. (2009). Probabilistic Graphical Models: Principles and Techniques. MIT Press.",
      },
      {
        kind: "complementary",
        citation:
          "Ghallab, M., Nau, D., & Traverso, P. (2016). Automated Planning and Acting. Cambridge University Press.",
      },
      {
        kind: "complementary",
        citation:
          "Provost, F., & Fawcett, T. (2013). Data Science for Business. O'Reilly Media.",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173855",
    guidePdfUrl: "/guides/machine-learning.pdf",
    guideRef: "9cfbf36a",
    descriptionEs:
      "1º Semestre · Módulo 2 (23 nov – 14 dic 2026). Algoritmos y herramientas para aprendizaje supervisado, no supervisado y por refuerzo, detección de patrones, evaluación y optimización de modelos.",
    descriptionEn:
      "1st Semester · Module 2 (Nov 23 – Dec 14, 2026). Supervised, unsupervised, and reinforcement learning algorithms, pattern detection, model evaluation, tuning, and optimization.",
    professors: {
      M11: "Jorge López Fresco",
      M12: "Álvaro López López",
    },
    topics: [
      {
        es: "Principios y técnicas del aprendizaje supervisado con datos etiquetados",
        en: "Supervised learning principles and techniques with labeled data",
      },
      {
        es: "Métodos de aprendizaje no supervisado para la detección de patrones",
        en: "Unsupervised learning methods for pattern detection",
      },
      {
        es: "Fundamentos del aprendizaje reforzado basado en recompensas y castigos",
        en: "Reinforcement learning fundamentals based on rewards and penalties",
      },
      {
        es: "Algoritmos y herramientas para el entrenamiento de modelos predictivos",
        en: "Algorithms and tools for training predictive models",
      },
      {
        es: "Aplicaciones prácticas del aprendizaje automático en distintos dominios",
        en: "Practical machine learning applications across domains",
      },
      {
        es: "Evaluación, ajuste y optimización de modelos de machine learning",
        en: "Evaluation, tuning, and optimization of machine learning models",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Géron, A. (2023). Aprende machine learning con Scikit-Learn, Keras y TensorFlow (3.ª ed.). Anaya Multimedia.",
      },
      {
        kind: "basic",
        citation:
          "Raschka, S., Liu, Y., & Mirjalili, V. (2023). Machine Learning con PyTorch y Scikit-Learn. Marcombo.",
      },
      {
        kind: "basic",
        citation:
          "Sutton, R. S., & Barto, A. G. (2018). Reinforcement Learning: An Introduction. MIT Press.",
      },
      {
        kind: "complementary",
        citation:
          "Russell, S. J., & Norvig, P. (2004). Inteligencia artificial: Un enfoque moderno (2.ª ed.). Pearson Educación.",
      },
      {
        kind: "complementary",
        citation:
          "Hutter, F., Kotthoff, L., & Vanschoren, J. (eds.) (2019). Automated Machine Learning: Methods, Systems, Challenges. Springer.",
      },
    ],
    grading: [
      {
        id: "ml-case",
        unitLabelEs: "Caso / problema",
        unitLabelEn: "Case / problem",
        titleEs: "Resolución de caso práctico / problema (evaluación continua)",
        titleEn: "Applied case / problem assignment (continuous assessment)",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "ml-project",
        unitLabelEs: "Proyecto",
        unitLabelEn: "Project",
        titleEs: "Investigaciones y proyectos",
        titleEn: "Research & project work",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "ml-lab",
        unitLabelEs: "Laboratorio",
        unitLabelEn: "Lab / Workshop",
        titleEs: "Cuaderno de prácticas de laboratorio / taller",
        titleEn: "Lab / workshop practice notebook",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "ml-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 abr 2027 (Pruebas 1º Semestre)",
        dueDateLabelEn: "Apr 10–11, 2027 (1st Semester Exams)",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173870",
    guidePdfUrl: "/guides/redes-neuronales-deep-learning.pdf",
    guideRef: "caefbc7c",
    descriptionEs:
      "1º Semestre · Módulo 3. Arquitecturas profundas, optimización, ajuste de hiperparámetros, regularización y aplicaciones en visión y lenguaje natural.",
    descriptionEn:
      "1st Semester · Module 3. Deep neural architectures, optimization, hyperparameter tuning, regularization, and applications in vision and NLP.",
    professors: {
      M11: "Alejandro Perdiguero O'Leary",
    },
    topics: [
      {
        es: "Representaciones complejas y arquitecturas de redes neuronales profundas",
        en: "Complex representations and deep neural network architectures",
      },
      {
        es: "Aplicaciones avanzadas como reconocimiento de imágenes y lenguaje natural",
        en: "Advanced applications including image recognition and natural language processing",
      },
      {
        es: "Técnicas de optimización y ajuste de hiperparámetros en modelos neuronales",
        en: "Optimization techniques and hyperparameter tuning in neural models",
      },
      {
        es: "Métodos de evaluación y mejora del rendimiento en deep learning",
        en: "Performance evaluation and improvement methods in deep learning",
      },
      {
        es: "Estrategias de regularización y reducción del sobreajuste",
        en: "Regularization strategies and overfitting reduction",
      },
      {
        es: "Estabilización del entrenamiento y mejora de la generalización del modelo",
        en: "Training stabilization and improving model generalization",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.",
      },
      {
        kind: "basic",
        citation:
          "Prince, S. J. D. (2023). Understanding Deep Learning. MIT Press.",
      },
      {
        kind: "basic",
        citation:
          "Chollet, F., & Watson, M. (2025). Deep Learning with Python (3rd ed.). Manning.",
      },
      {
        kind: "complementary",
        citation:
          "Bishop, C. M., & Bishop, H. (2024). Deep Learning: Foundations and Concepts. Springer.",
      },
      {
        kind: "complementary",
        citation:
          "LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature, 521(7553), 436–444.",
      },
      {
        kind: "complementary",
        citation:
          "Srivastava, N., Hinton, G., Krizhevsky, A., Sutskever, I., & Salakhutdinov, R. (2014). Dropout: A simple way to prevent neural networks from overfitting. JMLR, 15, 1929–1958.",
      },
      {
        kind: "complementary",
        citation:
          "Ioffe, S., & Szegedy, C. (2015). Batch normalization: Accelerating deep network training by reducing internal covariate shift. ICML (PMLR 37, pp. 448–456).",
      },
      {
        kind: "complementary",
        citation:
          "Kingma, D. P., & Ba, J. (2015). Adam: A method for stochastic optimization. ICLR 2015.",
      },
    ],
    grading: [
      {
        id: "dl-case",
        unitLabelEs: "Caso / problema",
        unitLabelEn: "Case / problem",
        titleEs: "Resolución de caso práctico / problema (evaluación continua)",
        titleEn: "Applied case / problem assignment (continuous assessment)",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "dl-project",
        unitLabelEs: "Proyecto",
        unitLabelEn: "Project",
        titleEs: "Investigaciones y proyectos",
        titleEn: "Research & project work",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "dl-lab",
        unitLabelEs: "Laboratorio",
        unitLabelEn: "Lab / Workshop",
        titleEs: "Cuaderno de prácticas de laboratorio / taller",
        titleEn: "Lab / workshop practice notebook",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "dl-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 abr 2027 (Pruebas 1º Semestre)",
        dueDateLabelEn: "Apr 10–11, 2027 (1st Semester Exams)",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173861",
    guidePdfUrl: "/guides/ia-generativa.pdf",
    guideRef: "8c0c08c4",
    descriptionEs:
      "1º Semestre · Módulo 4. Modelos generativos (GANs, VAEs, LLMs, difusión), ecosistemas abiertos y plataformas propietarias, fine-tuning, evaluación y mitigación de errores.",
    descriptionEn:
      "1st Semester · Module 4. Generative models (GANs, VAEs, LLMs, diffusion), open-source & proprietary platforms, fine-tuning, evaluation, and error mitigation.",
    professors: {
      M11: "Pablo del Vecchio",
      M12: "Idir Ouhab",
    },
    topics: [
      {
        es: "Modelos probabilísticos y redes neuronales generativas como GANs y VAEs",
        en: "Probabilistic models and generative neural networks (GANs & VAEs)",
      },
      {
        es: "Herramientas de código abierto para el desarrollo de IA generativa",
        en: "Open-source tools for generative AI development",
      },
      {
        es: "Integración y personalización de modelos preentrenados en entornos abiertos",
        en: "Integration and customization of pretrained models in open ecosystems",
      },
      {
        es: "Plataformas propietarias para el desarrollo y despliegue de modelos generativos",
        en: "Proprietary platforms for building and deploying generative models",
      },
      {
        es: "Configuración, entrenamiento y ajuste de modelos en entornos propietarios",
        en: "Configuration, training, and fine-tuning in proprietary environments",
      },
      {
        es: "Evaluación, mejora de rendimiento y mitigación de errores en IA generativa",
        en: "Evaluation, performance optimization, and error mitigation in generative AI",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Foster, D. (2023). Generative Deep Learning: Teaching Machines to Paint, Write, Compose, and Play (2nd ed.). O'Reilly Media.",
      },
      {
        kind: "basic",
        citation:
          "Alammar, J., & Grootendorst, M. (2024). Hands-On Large Language Models: Language Understanding and Generation. O'Reilly Media.",
      },
      {
        kind: "basic",
        citation:
          "Huyen, C. (2025). AI Engineering: Building Applications with Foundation Models. O'Reilly Media.",
      },
      {
        kind: "complementary",
        citation:
          "Raschka, S. (2024). Build a Large Language Model (From Scratch). Manning.",
      },
      {
        kind: "complementary",
        citation:
          "Tunstall, L., von Werra, L., & Wolf, T. (2022). Natural Language Processing with Transformers (rev. ed.). O'Reilly Media.",
      },
      {
        kind: "complementary",
        citation:
          "Goodfellow, I., et al. (2014). Generative adversarial nets. NeurIPS (Vol. 27, pp. 2672–2680).",
      },
      {
        kind: "complementary",
        citation:
          "Kingma, D. P., & Welling, M. (2014). Auto-encoding variational Bayes. ICLR 2014.",
      },
      {
        kind: "complementary",
        citation:
          "Ho, J., Jain, A., & Abbeel, P. (2020). Denoising diffusion probabilistic models. NeurIPS (Vol. 33, pp. 6840–6851).",
      },
      {
        kind: "complementary",
        citation:
          "Hu, E. J., et al. (2022). LoRA: Low-rank adaptation of large language models. ICLR 2022.",
      },
      {
        kind: "complementary",
        citation:
          "Lewis, P., et al. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. NeurIPS (Vol. 33, pp. 9459–9474).",
      },
    ],
    grading: [
      {
        id: "genai-case",
        unitLabelEs: "Caso / problema",
        unitLabelEn: "Case / problem",
        titleEs: "Resolución de caso práctico / problema (evaluación continua)",
        titleEn: "Applied case / problem assignment (continuous assessment)",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "genai-project",
        unitLabelEs: "Proyecto",
        unitLabelEn: "Project",
        titleEs: "Investigaciones y proyectos",
        titleEn: "Research & project work",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "genai-lab",
        unitLabelEs: "Laboratorio",
        unitLabelEn: "Lab / Workshop",
        titleEs: "Cuaderno de prácticas de laboratorio / taller",
        titleEn: "Lab / workshop practice notebook",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "genai-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 abr 2027 (Pruebas 1º Semestre)",
        dueDateLabelEn: "Apr 10–11, 2027 (1st Semester Exams)",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173867",
    guidePdfUrl: "/guides/procesamiento-lenguaje-natural.pdf",
    guideRef: "d430c4f4",
    descriptionEs:
      "1º Semestre · Módulo 5. Tokenización, análisis sintáctico, extracción de características, resolución de ambigüedad semántica y generación de lenguaje natural.",
    descriptionEn:
      "1st Semester · Module 5. Tokenization, syntactic analysis, feature extraction, semantic disambiguation, and natural language generation.",
    professors: {
      M11: "Aurora Cobo Aguilera",
      M12: "Mara Chinea Ríos",
    },
    topics: [
      {
        es: "Técnicas de tokenización y segmentación para el análisis textual",
        en: "Tokenization and segmentation techniques for text analysis",
      },
      {
        es: "Análisis morfológico y sintáctico de estructuras lingüísticas",
        en: "Morphological and syntactic analysis of linguistic structures",
      },
      {
        es: "Extracción de características relevantes en textos complejos",
        en: "Relevant feature extraction from complex text",
      },
      {
        es: "Resolución de ambigüedades semánticas en distintos contextos",
        en: "Semantic ambiguity resolution across contexts",
      },
      {
        es: "Tecnologías avanzadas para la generación de lenguaje natural",
        en: "Advanced technologies for natural language generation",
      },
      {
        es: "Integración de técnicas de PLN en aplicaciones prácticas",
        en: "Integrating NLP techniques into practical applications",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Jurafsky, D., & Martin, J. H. (2026). Speech and Language Processing (3rd ed., online draft). Stanford University.",
      },
      {
        kind: "basic",
        citation:
          "Eisenstein, J. (2019). Introduction to Natural Language Processing. MIT Press.",
      },
      {
        kind: "basic",
        citation:
          "Tunstall, L., von Werra, L., & Wolf, T. (2022). Natural Language Processing with Transformers (rev. ed.). O'Reilly Media.",
      },
      {
        kind: "complementary",
        citation:
          "Bird, S., Klein, E., & Loper, E. (2009). Natural Language Processing with Python. O'Reilly Media.",
      },
      {
        kind: "complementary",
        citation:
          "Manning, C. D., & Schütze, H. (1999). Foundations of Statistical Natural Language Processing. MIT Press.",
      },
      {
        kind: "complementary",
        citation:
          "Goldberg, Y. (2017). Neural Network Methods for Natural Language Processing. Morgan & Claypool.",
      },
      {
        kind: "complementary",
        citation:
          "Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). Efficient estimation of word representations in vector space. arXiv:1301.3781.",
      },
      {
        kind: "complementary",
        citation:
          "Vaswani, A., et al. (2017). Attention is all you need. NeurIPS (Vol. 30, pp. 5998–6008).",
      },
      {
        kind: "complementary",
        citation:
          "Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. NAACL-HLT (pp. 4171–4186).",
      },
      {
        kind: "complementary",
        citation:
          "Gutiérrez-Fandiño, A., et al. (2022). MarIA: Spanish language models. Procesamiento del Lenguaje Natural, 68, 39–60.",
      },
    ],
    grading: [
      {
        id: "nlp-case",
        unitLabelEs: "Caso / problema",
        unitLabelEn: "Case / problem",
        titleEs: "Resolución de caso práctico / problema (evaluación continua)",
        titleEn: "Applied case / problem assignment (continuous assessment)",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "nlp-project",
        unitLabelEs: "Proyecto",
        unitLabelEn: "Project",
        titleEs: "Investigaciones y proyectos",
        titleEn: "Research & project work",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "nlp-lab",
        unitLabelEs: "Laboratorio",
        unitLabelEn: "Lab / Workshop",
        titleEs: "Cuaderno de prácticas de laboratorio / taller",
        titleEn: "Lab / workshop practice notebook",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "nlp-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 abr 2027 (Pruebas 1º Semestre)",
        dueDateLabelEn: "Apr 10–11, 2027 (1st Semester Exams)",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173853",
    guidePdfUrl: "/guides/computer-vision.pdf",
    guideRef: "d1c4dafd",
    descriptionEs:
      "2º Semestre · Módulo 6. Reconocimiento de objetos, segmentación, seguimiento de movimiento, extracción de características y modelos generativos aplicados a visión por computador.",
    descriptionEn:
      "2nd Semester · Module 6. Object recognition, segmentation, motion tracking, visual feature extraction, and generative models applied to computer vision.",
    professors: {
      M11: "Jorge López Fresco",
    },
    topics: [
      {
        es: "Técnicas de reconocimiento de objetos en imágenes y vídeos",
        en: "Object recognition techniques in images and videos",
      },
      {
        es: "Métodos de segmentación para análisis detallado de imágenes",
        en: "Segmentation methods for detailed image analysis",
      },
      {
        es: "Algoritmos de detección y seguimiento de movimiento",
        en: "Motion detection and tracking algorithms",
      },
      {
        es: "Reconocimiento de patrones visuales y extracción de características",
        en: "Visual pattern recognition and feature extraction",
      },
      {
        es: "Modelos generativos aplicados a la visión por computadora",
        en: "Generative models applied to computer vision",
      },
      {
        es: "Aplicaciones prácticas de visión artificial en distintos sectores",
        en: "Practical computer vision applications across industries",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Szeliski, R. (2022). Computer Vision: Algorithms and Applications (2nd ed.). Springer.",
      },
      {
        kind: "basic",
        citation:
          "Torralba, A., Isola, P., & Freeman, W. T. (2024). Foundations of Computer Vision. MIT Press.",
      },
      {
        kind: "basic",
        citation:
          "Prince, S. J. D. (2012). Computer Vision: Models, Learning, and Inference. Cambridge University Press.",
      },
      {
        kind: "complementary",
        citation:
          "He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. CVPR (pp. 770–778).",
      },
      {
        kind: "complementary",
        citation:
          "Redmon, J., Divvala, S., Girshick, R., & Farhadi, A. (2016). You only look once: Unified, real-time object detection. CVPR (pp. 779–788).",
      },
      {
        kind: "complementary",
        citation:
          "Ronneberger, O., Fischer, P., & Brox, T. (2015). U-Net: Convolutional networks for biomedical image segmentation. MICCAI 2015 (pp. 234–241).",
      },
      {
        kind: "complementary",
        citation:
          "He, K., Gkioxari, G., Dollár, P., & Girshick, R. (2017). Mask R-CNN. ICCV (pp. 2961–2969).",
      },
      {
        kind: "complementary",
        citation:
          "Bewley, A., Ge, Z., Ott, L., Ramos, F., & Upcroft, B. (2016). Simple online and realtime tracking. ICIP (pp. 3464–3468).",
      },
      {
        kind: "complementary",
        citation:
          "Dosovitskiy, A., et al. (2021). An image is worth 16x16 words: Transformers for image recognition at scale. ICLR 2021.",
      },
      {
        kind: "complementary",
        citation:
          "Rombach, R., et al. (2022). High-resolution image synthesis with latent diffusion models. CVPR (pp. 10684–10695).",
      },
      {
        kind: "complementary",
        citation:
          "Kirillov, A., et al. (2023). Segment Anything. ICCV (pp. 4015–4026).",
      },
    ],
    grading: [
      {
        id: "cv-case",
        unitLabelEs: "Caso / problema",
        unitLabelEn: "Case / problem",
        titleEs: "Resolución de caso práctico / problema (evaluación continua)",
        titleEn: "Applied case / problem assignment (continuous assessment)",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "cv-project",
        unitLabelEs: "Proyecto",
        unitLabelEn: "Project",
        titleEs: "Investigaciones y proyectos",
        titleEn: "Research & project work",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "cv-lab",
        unitLabelEs: "Laboratorio",
        unitLabelEn: "Lab / Workshop",
        titleEs: "Cuaderno de prácticas de laboratorio / taller",
        titleEn: "Lab / workshop practice notebook",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "cv-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 jul 2027 (Pruebas 2º Semestre)",
        dueDateLabelEn: "Jul 10–11, 2027 (2nd Semester Exams)",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173854",
    guidePdfUrl: "/guides/ia-ciberseguridad.pdf",
    guideRef: "d3e56ca0",
    descriptionEs:
      "2º Semestre · Módulo 7. Amenazas digitales, detección de anomalías e intrusiones basadas en IA, respuestas automáticas, deep learning en seguridad y mitigación de vulnerabilidades.",
    descriptionEn:
      "2nd Semester · Module 7. Digital threats, AI-driven anomaly & intrusion detection, automated incident response, deep learning in cybersecurity, and vulnerability mitigation.",
    professors: {
      M11: "Lidia Contreras Ochando & Daniel Stanislowsky",
    },
    topics: [
      {
        es: "Fundamentos de ciberseguridad y tipos de amenazas digitales",
        en: "Cybersecurity fundamentals and types of digital threats",
      },
      {
        es: "Técnicas de detección de anomalías y análisis de comportamiento",
        en: "Anomaly detection and behavioral analysis techniques",
      },
      {
        es: "Sistemas de detección de intrusiones basados en inteligencia artificial",
        en: "AI-based intrusion detection systems (IDS)",
      },
      {
        es: "Modelos predictivos y respuestas automáticas ante incidentes",
        en: "Predictive models and automated incident response",
      },
      {
        es: "Aplicación de redes neuronales y deep learning en ciberseguridad",
        en: "Neural networks and deep learning applied to cybersecurity",
      },
      {
        es: "Estrategias de mitigación de vulnerabilidades mediante IA entrenada",
        en: "Vulnerability mitigation strategies using trained AI models",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Chio, C., & Freeman, D. (2018). Machine Learning and Security: Protecting Systems with Data and Algorithms. O'Reilly Media.",
      },
      {
        kind: "basic",
        citation:
          "Saxe, J., & Sanders, H. (2018). Malware Data Science: Attack Detection and Attribution. No Starch Press.",
      },
      {
        kind: "basic",
        citation:
          "Apruzzese, G., et al. (2023). The role of machine learning in cybersecurity. Digital Threats: Research and Practice, 4(1), 1–38.",
      },
      {
        kind: "complementary",
        citation:
          "Arp, D., et al. (2022). Dos and don'ts of machine learning in computer security. 31st USENIX Security Symposium (pp. 3971–3988).",
      },
      {
        kind: "complementary",
        citation:
          "Buczak, A. L., & Guven, E. (2016). A survey of data mining and machine learning methods for cyber security intrusion detection. IEEE Comm. Surveys & Tutorials, 18(2), 1153–1176.",
      },
      {
        kind: "complementary",
        citation:
          "Sommer, R., & Paxson, V. (2010). Outside the closed world: On using machine learning for network intrusion detection. IEEE S&P (pp. 305–316).",
      },
      {
        kind: "complementary",
        citation:
          "Sharafaldin, I., Lashkari, A. H., & Ghorbani, A. A. (2018). Toward generating a new intrusion detection dataset and intrusion traffic characterization. ICISSP (pp. 108–116).",
      },
      {
        kind: "complementary",
        citation:
          "Biggio, B., & Roli, F. (2018). Wild patterns: Ten years after the rise of adversarial machine learning. Pattern Recognition, 84, 317–331.",
      },
      {
        kind: "complementary",
        citation:
          "Vassilev, A., et al. (2025). Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations (NIST AI 100-2e2025). NIST.",
      },
    ],
    grading: [
      {
        id: "ciber-case",
        unitLabelEs: "Caso / problema",
        unitLabelEn: "Case / problem",
        titleEs: "Resolución de caso práctico / problema (evaluación continua)",
        titleEn: "Applied case / problem assignment (continuous assessment)",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "ciber-project",
        unitLabelEs: "Proyecto",
        unitLabelEn: "Project",
        titleEs: "Investigaciones y proyectos",
        titleEn: "Research & project work",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "ciber-lab",
        unitLabelEs: "Laboratorio",
        unitLabelEn: "Lab / Workshop",
        titleEs: "Cuaderno de prácticas de laboratorio / taller",
        titleEn: "Lab / workshop practice notebook",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "ciber-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 jul 2027 (Pruebas 2º Semestre)",
        dueDateLabelEn: "Jul 10–11, 2027 (2nd Semester Exams)",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173856",
    guidePdfUrl: "/guides/ia-sociedad-empresa.pdf",
    guideRef: "0ac26ccd",
    descriptionEs:
      "2º Semestre · Módulo 8. Aplicaciones de IA en salud, finanzas, educación, comercio y logística; estrategia empresarial, EU AI Act, GDPR, ética y sostenibilidad.",
    descriptionEn:
      "2nd Semester · Module 8. AI applications in healthcare, finance, education, retail & logistics; business strategy, EU AI Act, GDPR, ethics, and sustainability.",
    professors: {
      M11: "Miguel Ángel Torres",
      M12: "Sonia Montagud Gregori",
    },
    topics: [
      {
        es: "Ámbitos de aplicación de la IA en sectores empresariales y sociales",
        en: "AI application domains across business and societal sectors",
      },
      {
        es: "Soluciones basadas en IA para la toma de decisiones y análisis de riesgos",
        en: "AI-driven solutions for decision-making and risk analysis",
      },
      {
        es: "Aplicaciones de IA en salud, finanzas, educación y recursos humanos",
        en: "AI applications in healthcare, finance, education, and HR",
      },
      {
        es: "Sistemas inteligentes en comercio, marketing y atención al cliente",
        en: "Intelligent systems in retail, marketing, and customer service",
      },
      {
        es: "Optimización de procesos en manufactura, logística y transporte",
        en: "Process optimization in manufacturing, logistics, and transport",
      },
      {
        es: "Impacto de la IA en la transformación digital y la sostenibilidad",
        en: "Impact of AI on digital transformation and sustainability",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Agrawal, A., Gans, J., & Goldfarb, A. (2022). Prediction Machines: The Simple Economics of Artificial Intelligence (updated ed.). Harvard Business Review Press.",
      },
      {
        kind: "basic",
        citation:
          "Iansiti, M., & Lakhani, K. R. (2020). Competing in the Age of AI: Strategy and Leadership When Algorithms and Networks Run the World. Harvard Business Review Press.",
      },
      {
        kind: "basic",
        citation:
          "Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo (EU AI Act / Reglamento de Inteligencia Artificial), DOUE 12 jul 2024.",
      },
      {
        kind: "complementary",
        citation:
          "Davenport, T. H. (2018). The AI Advantage: How to Put the Artificial Intelligence Revolution to Work. MIT Press.",
      },
      {
        kind: "complementary",
        citation:
          "Huyen, C. (2022). Designing Machine Learning Systems. O'Reilly Media.",
      },
      {
        kind: "complementary",
        citation:
          "Sculley, D., et al. (2015). Hidden technical debt in machine learning systems. NeurIPS (Vol. 28, pp. 2503–2511).",
      },
      {
        kind: "complementary",
        citation:
          "Topol, E. J. (2019). High-performance medicine: The convergence of human and artificial intelligence. Nature Medicine, 25(1), 44–56.",
      },
      {
        kind: "complementary",
        citation:
          "Floridi, L., et al. (2018). AI4People—An ethical framework for a good AI society. Minds and Machines, 28(4), 689–707.",
      },
      {
        kind: "complementary",
        citation:
          "Crawford, K. (2021). Atlas of AI: Power, Politics, and the Planetary Costs of Artificial Intelligence. Yale University Press.",
      },
      {
        kind: "complementary",
        citation:
          "O'Neil, C. (2016). Weapons of Math Destruction. Crown.",
      },
      {
        kind: "complementary",
        citation:
          "Reglamento (UE) 2016/679 (RGPD / GDPR), DOUE L 119, 4 mayo 2016.",
      },
    ],
    grading: [
      {
        id: "soc-reports",
        unitLabelEs: "Informes",
        unitLabelEn: "Reports",
        titleEs: "Informes y escritos",
        titleEn: "Written reports & essays",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "soc-case",
        unitLabelEs: "Caso / problema",
        unitLabelEn: "Case / problem",
        titleEs: "Resolución de caso práctico / problema",
        titleEn: "Applied case / problem assignment",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "soc-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 jul 2027 (Pruebas 2º Semestre)",
        dueDateLabelEn: "Jul 10–11, 2027 (2nd Semester Exams)",
      },
    ],
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
    ects: 6,
    workloadHours: 150,
    canvasUrl: "https://campus.europaeducationgroup.es/courses/173862",
    guidePdfUrl: "/guides/metodologia-investigacion.pdf",
    guideRef: "1c51d6e1",
    descriptionEs:
      "2º Semestre · Optativa (itinerario I+D / doctorado frente a Prácticas en empresa). Diseño experimental en IA, análisis de datos, redacción científica, reproducibilidad y ética investigadora.",
    descriptionEn:
      "2nd Semester · Elective (R&D / PhD track vs. Company Internship). Experimental design in AI, data analysis, scientific writing, reproducibility, and research ethics.",
    professors: {
      M11: "Víctor Yeste",
      M12: "Víctor Yeste",
    },
    topics: [
      {
        es: "Fundamentos epistemológicos y metodológicos de la investigación científica",
        en: "Epistemological and methodological foundations of scientific research",
      },
      {
        es: "Diseño de proyectos de investigación en inteligencia artificial",
        en: "Designing research projects in artificial intelligence",
      },
      {
        es: "Técnicas de recolección, análisis e interpretación de datos",
        en: "Data collection, analysis, and interpretation techniques",
      },
      {
        es: "Redacción académica y elaboración de informes científicos",
        en: "Academic writing and scientific report preparation",
      },
      {
        es: "Ética y responsabilidad en la investigación con IA",
        en: "Ethics and responsibility in AI research",
      },
      {
        es: "Evaluación crítica de fuentes y resultados científicos",
        en: "Critical evaluation of scientific sources and findings",
      },
    ],
    passRuleEs:
      "Calificación final ponderada ≥ 5,0/10 en convocatoria ordinaria o extraordinaria. Si no se supera, debe cursarse de nuevo en su totalidad sin conservar notas parciales.",
    passRuleEn:
      "Weighted final grade ≥ 5.0/10 in ordinary or extraordinary sitting. If not passed in either sitting, the full module must be retaken (partial grades do not carry over).",
    bibliography: [
      {
        kind: "basic",
        citation:
          "Hernández-Sampieri, R., & Mendoza Torres, C. P. (2018). Metodología de la investigación: Las rutas cuantitativa, cualitativa y mixta. McGraw-Hill.",
      },
      {
        kind: "basic",
        citation:
          "Zobel, J. (2014). Writing for Computer Science (3rd ed.). Springer.",
      },
      {
        kind: "basic",
        citation:
          "Wohlin, C., et al. (2024). Experimentation in Software Engineering (2nd ed.). Springer.",
      },
      {
        kind: "complementary",
        citation:
          "Booth, W. C., Colomb, G. G., Williams, J. M., Bizup, J., & FitzGerald, W. T. (2024). The Craft of Research (5th ed.). University of Chicago Press.",
      },
      {
        kind: "complementary",
        citation:
          "Cohen, P. R. (1995). Empirical Methods for Artificial Intelligence. MIT Press.",
      },
      {
        kind: "complementary",
        citation:
          "Demšar, J. (2006). Statistical comparisons of classifiers over multiple data sets. JMLR, 7, 1–30.",
      },
      {
        kind: "complementary",
        citation:
          "Dror, R., Baumer, G., Shlomov, S., & Reichart, R. (2018). The hitchhiker's guide to testing statistical significance in NLP. ACL (pp. 1383–1392).",
      },
      {
        kind: "complementary",
        citation:
          "Kitchenham, B., & Charters, S. (2007). Guidelines for performing systematic literature reviews in software engineering (EBSE-2007-01).",
      },
      {
        kind: "complementary",
        citation:
          "Pineau, J., et al. (2021). Improving reproducibility in machine learning research (NeurIPS 2019 Reproducibility Program). JMLR, 22(164), 1–20.",
      },
      {
        kind: "complementary",
        citation:
          "Gebru, T., et al. (2021). Datasheets for datasets. Communications of the ACM, 64(12), 86–92.",
      },
    ],
    grading: [
      {
        id: "met-project",
        unitLabelEs: "Proyecto",
        unitLabelEn: "Project",
        titleEs: "Investigaciones y proyectos",
        titleEn: "Research & project work",
        weightPercent: 20,
        type: "task",
      },
      {
        id: "met-oral",
        unitLabelEs: "Exposición",
        unitLabelEn: "Presentation",
        titleEs: "Exposiciones orales",
        titleEn: "Oral presentations",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "met-reports",
        unitLabelEs: "Informes",
        unitLabelEn: "Reports",
        titleEs: "Informes y escritos",
        titleEn: "Written reports",
        weightPercent: 10,
        type: "task",
      },
      {
        id: "met-final",
        unitLabelEs: "Final",
        unitLabelEn: "Final",
        titleEs: "Pruebas de evaluación virtuales (examen final)",
        titleEn: "Virtual final assessment exam",
        weightPercent: 60,
        type: "exam",
        dueDateLabelEs: "10–11 jul 2027 (Pruebas 2º Semestre)",
        dueDateLabelEn: "Jul 10–11, 2027 (2nd Semester Exams)",
      },
    ],
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
