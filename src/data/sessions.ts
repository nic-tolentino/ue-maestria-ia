import type { ClassSession } from "@/types/calendar";

/**
 * Full schedule for UE Online Master's in AI (2026–2027).
 * Both M11 and M12 share the exact same dates & times (Europe/Madrid),
 * with stream-specific professors/links resolved via `streamUrls` or module defaults.
 *
 * To assign a module to a Monday/Thursday class, update `moduleId` to one of the IDs in `src/data/modules.ts`.
 * To add a one-off Teams link for a single class, add `streamUrls: { M11: "...", M12: "..." }` or `meetingUrl: "..."`.
 */
export const SESSIONS: ClassSession[] = [
  // ===================== NOVEMBER 2026 =====================
  {
    id: "2026-11-02-mon",
    date: "2026-11-02",
    startTime: "18:30",
    endTime: "20:30",
    moduleId: "intro-ds-ia",
    title: "Clase 1 · Introducción al Data Science y a la IA",
    titleEn: "Class 1 · Introduction to Data Science & AI",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001101M1201/Documentos%20compartidos/General/Recordings/Introducci%C3%B3n%20al%20Data%20Science%20y%20a%20la%20Inteligencia%20Artificial%20-%20Clase%2002112026-20261102_183740-Meeting%20Recording.mp4?d=w8fa9682321cd49509b5a198cf5a17631&csf=1&web=1&e=DTK723",
    },
  },
  {
    id: "2026-11-03-tue",
    date: "2026-11-03",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "intro-ds-ia",
    title: "Clase 2 · Introducción al Data Science y a la IA",
    titleEn: "Class 2 · Introduction to Data Science & AI",
    notesEs: "Intercambiada con la sesión de Certificaciones AWS del jueves 5 nov.",
    notesEn: "Swapped with the AWS Certifications session on Thu Nov 5.",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001101M1201/Documentos%20compartidos/General/Recordings/M1%20Intro%20a%20Ciencia%20Datos%20-%20Clase%202%20-%203%20Nov-20261103_184222-Meeting%20Recording.mp4?d=wb1fea1fce7d34f5caa39bce2026f19b9&csf=1&web=1&e=oDXHU7",
    },
  },
  {
    id: "2026-11-05-thu",
    date: "2026-11-05",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 1 · Introducción a Certificaciones Cloud & IA",
    titleEn: "Class 1 · Cloud & AI Certifications Kickoff",
    notesEs: "Intercambiada con la clase de Intro a Data Science del martes 3 nov.",
    notesEn: "Swapped with Intro to Data Science on Tue Nov 3.",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:f:/r/sites/CertificacionesAICloudAWSAzure2627-GrupoOnlinemartesMoiss/Documentos%20compartidos/Grabaciones?d=w50d7f258d6ca4847a5e338c297563f3e&csf=1&web=1&e=LsZvpd",
    },
  },

  {
    id: "2026-11-09-mon",
    date: "2026-11-09",
    startTime: "18:30",
    endTime: "20:30",
    moduleId: "intro-ds-ia",
    title: "Clase 3 · Introducción al Data Science y a la IA",
    titleEn: "Class 3 · Introduction to Data Science & AI",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001101M1201/Documentos%20compartidos/General/Recordings/M1%20Intro%20a%20Ciencia%20Datos%20-%20Clase%203%20%5B9%20Nov%5D-20261109_183256-Meeting%20Recording.mp4?d=wf1422ac121d245b0a2a79b53e1008c95&csf=1&web=1&e=PfABFz",
    },
  },
  {
    id: "2026-11-10-tue",
    date: "2026-11-10",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 2 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 2 · AWS Certified AI Practitioner (AIF-C01)",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:f:/r/sites/CertificacionesAICloudAWSAzure2627-GrupoOnlinemartesMoiss/Documentos%20compartidos/Grabaciones?d=w50d7f258d6ca4847a5e338c297563f3e&csf=1&web=1&e=MkRp7t",
    },
  },
  {
    id: "2026-11-12-thu",
    date: "2026-11-12",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "intro-ds-ia",
    title: "Clase 4 · Introducción al Data Science y a la IA",
    titleEn: "Class 4 · Introduction to Data Science & AI",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001101M1201/Documentos%20compartidos/General/Recordings/M1%20Intro%20a%20Ciencia%20Datos%20-%20Clase%204%20%5B12%20Nov%5D-20261112_183841-Meeting%20Recording.mp4?d=w2292e55180914976a0ed7f8171959388&csf=1&web=1&e=19GHlt",
    },
  },

  {
    id: "2026-11-16-mon",
    date: "2026-11-16",
    startTime: "18:30",
    endTime: "20:30",
    moduleId: "intro-ds-ia",
    title: "Clase 5 · Introducción al Data Science y a la IA",
    titleEn: "Class 5 · Introduction to Data Science & AI",
    recordingUrls: {
      M12: [
        {
          url: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001101M1201/Documentos%20compartidos/General/Recordings/M1%20Intro%20Ciencia%20Datos%20-%20Clase%205%20Parte%201%20-%20Lunes%2016%20Nov-20261116_184607-Meeting%20Recording.mp4?d=wd58b4c6a2eda4542b401578df9adaa17&csf=1&web=1&e=baCzAO",
          labelEs: "Parte 1",
          labelEn: "Part 1",
        },
        {
          url: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001101M1201/Documentos%20compartidos/General/Recordings/M1%20Intro%20Ciencia%20Datos%20-%20Clase%205%20Parte%202%20-%20Lunes%2016%20Nov-20261116_195036-Meeting%20Recording.mp4?d=we09ccf08aabc4d7c8bae04fe1af16ba2&csf=1&web=1&e=yEhujf",
          labelEs: "Parte 2",
          labelEn: "Part 2",
        },
      ],
    },
  },
  {
    id: "2026-11-17-tue",
    date: "2026-11-17",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 3 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 3 · AWS Certified AI Practitioner (AIF-C01)",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:f:/r/sites/CertificacionesAICloudAWSAzure2627-GrupoOnlinemartesMoiss/Documentos%20compartidos/Grabaciones?d=w50d7f258d6ca4847a5e338c297563f3e&csf=1&web=1&e=DTg3kL",
    },
  },
  {
    id: "2026-11-19-thu",
    date: "2026-11-19",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "intro-ds-ia",
    title: "Clase 6 · Introducción al Data Science y a la IA",
    titleEn: "Class 6 · Introduction to Data Science & AI",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001101M1201/Documentos%20compartidos/General/Recordings/M1%20Intro%20Ciencia%20Datos%20-%20Clase%206%20-%20Jueves%2019%20Nov-20261119_184117-Meeting%20Recording.mp4?d=wfbe5b128f14f47468828e2cd8308839b&csf=1&web=1&e=pycyrb",
    },
  },

  {
    id: "2026-11-23-mon",
    date: "2026-11-23",
    startTime: "18:30",
    endTime: "20:30",
    moduleId: "ml",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:v:/r/sites/2026PBMY001102M1201/Documentos%20compartidos/General/Recordings/Primera%20Sesion-20261123_183043-Grabaci%C3%B3n%20de%20la%20reuni%C3%B3n.mp4?d=w690e960fd8be4ee6aca88234577c2c96&csf=1&web=1&e=jl5sXo",
    },
  },
  {
    id: "2026-11-24-tue",
    date: "2026-11-24",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 4 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 4 · AWS Certified AI Practitioner (AIF-C01)",
    recordingUrls: {
      M12: "https://univeuropeaes.sharepoint.com/:f:/r/sites/CertificacionesAICloudAWSAzure2627-GrupoOnlinemartesMoiss/Documentos%20compartidos/Grabaciones?d=w50d7f258d6ca4847a5e338c297563f3e&csf=1&web=1&e=DTMmcT",
    },
  },
  { id: "2026-11-26-thu", date: "2026-11-26", startTime: "18:30", endTime: "21:30", moduleId: "ml" },

  { id: "2026-11-30-mon", date: "2026-11-30", startTime: "18:30", endTime: "20:30", moduleId: "ml" },

  // ===================== DECEMBER 2026 =====================
  {
    id: "2026-12-01-tue",
    date: "2026-12-01",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 5 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 5 · AWS Certified AI Practitioner (AIF-C01)",
  },
  { id: "2026-12-03-thu", date: "2026-12-03", startTime: "18:30", endTime: "21:30", moduleId: "ml" },

  // Note: Mon Dec 7 & Tue Dec 8 skipped (Puente de la Constitución / Inmaculada)
  { id: "2026-12-10-thu", date: "2026-12-10", startTime: "18:30", endTime: "21:30", moduleId: "ml" },

  {
    id: "2026-12-14-mon",
    date: "2026-12-14",
    startTime: "18:30",
    endTime: "20:30",
    moduleId: "ml",
    notesEs: "Última sesión del módulo de Machine Learning.",
    notesEn: "Final session of the Machine Learning module.",
  },
  {
    id: "2026-12-15-tue",
    date: "2026-12-15",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 6 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 6 · AWS Certified AI Practitioner (AIF-C01)",
  },
  {
    id: "2026-12-17-thu",
    date: "2026-12-17",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "tbd",
    notesEs:
      "Por confirmar si habrá clase o qué módulo empieza tras finalizar Machine Learning el 14 dic.",
    notesEn:
      "TBD whether this session will run or which module starts after Machine Learning ends on Dec 14.",
  },

  // ===================== JANUARY 2027 =====================
  { id: "2027-01-07-thu", date: "2027-01-07", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-01-11-mon", date: "2027-01-11", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-01-12-tue",
    date: "2027-01-12",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 7 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 7 · AWS Certified AI Practitioner (AIF-C01)",
  },
  { id: "2027-01-14-thu", date: "2027-01-14", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-01-18-mon", date: "2027-01-18", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-01-19-tue",
    date: "2027-01-19",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 8 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 8 · AWS Certified AI Practitioner (AIF-C01)",
  },
  { id: "2027-01-21-thu", date: "2027-01-21", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-01-25-mon", date: "2027-01-25", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-01-26-tue",
    date: "2027-01-26",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 9 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 9 · AWS Certified AI Practitioner (AIF-C01)",
  },
  { id: "2027-01-28-thu", date: "2027-01-28", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  // ===================== FEBRUARY 2027 =====================
  { id: "2027-02-01-mon", date: "2027-02-01", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-02-02-tue",
    date: "2027-02-02",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-aws",
    title: "Clase 10 · AWS Certified AI Practitioner (AIF-C01)",
    titleEn: "Class 10 · AWS Certified AI Practitioner (AIF-C01)",
  },
  { id: "2027-02-04-thu", date: "2027-02-04", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-02-08-mon", date: "2027-02-08", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-02-09-tue",
    date: "2027-02-09",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 11 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 11 · Microsoft Azure AI Fundamentals (AI-901)",
  },
  { id: "2027-02-11-thu", date: "2027-02-11", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-02-15-mon", date: "2027-02-15", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-02-16-tue",
    date: "2027-02-16",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 12 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 12 · Microsoft Azure AI Fundamentals (AI-901)",
  },
  { id: "2027-02-18-thu", date: "2027-02-18", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-02-22-mon", date: "2027-02-22", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-02-23-tue",
    date: "2027-02-23",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 13 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 13 · Microsoft Azure AI Fundamentals (AI-901)",
  },
  { id: "2027-02-25-thu", date: "2027-02-25", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  // ===================== MARCH 2027 =====================
  { id: "2027-03-01-mon", date: "2027-03-01", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-03-02-tue",
    date: "2027-03-02",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 14 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 14 · Microsoft Azure AI Fundamentals (AI-901)",
  },
  { id: "2027-03-04-thu", date: "2027-03-04", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-03-08-mon", date: "2027-03-08", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-03-09-tue",
    date: "2027-03-09",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 15 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 15 · Microsoft Azure AI Fundamentals (AI-901)",
  },
  { id: "2027-03-11-thu", date: "2027-03-11", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-03-22-mon", date: "2027-03-22", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-03-23-tue",
    date: "2027-03-23",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 16 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 16 · Microsoft Azure AI Fundamentals (AI-901)",
  },

  // ===================== APRIL 2027 =====================
  // Note: 1st Semester Evaluation Exams are Apr 10–11, 2027
  { id: "2027-04-12-mon", date: "2027-04-12", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-04-13-tue",
    date: "2027-04-13",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 17 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 17 · Microsoft Azure AI Fundamentals (AI-901)",
  },
  { id: "2027-04-15-thu", date: "2027-04-15", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-04-19-mon", date: "2027-04-19", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  {
    id: "2027-04-20-tue",
    date: "2027-04-20",
    startTime: "18:30",
    endTime: "21:30",
    moduleId: "cert-azure",
    title: "Clase 18 · Microsoft Azure AI Fundamentals (AI-901)",
    titleEn: "Class 18 · Microsoft Azure AI Fundamentals (AI-901)",
  },
  { id: "2027-04-22-thu", date: "2027-04-22", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-04-26-mon", date: "2027-04-26", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-04-27-tue", date: "2027-04-27", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-04-29-thu", date: "2027-04-29", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  // ===================== MAY 2027 =====================
  { id: "2027-05-03-mon", date: "2027-05-03", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-05-04-tue", date: "2027-05-04", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-05-06-thu", date: "2027-05-06", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-05-10-mon", date: "2027-05-10", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-05-11-tue", date: "2027-05-11", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-05-13-thu", date: "2027-05-13", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-05-17-mon", date: "2027-05-17", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-05-18-tue", date: "2027-05-18", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-05-20-thu", date: "2027-05-20", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-05-24-mon", date: "2027-05-24", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-05-25-tue", date: "2027-05-25", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-05-27-thu", date: "2027-05-27", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-05-31-mon", date: "2027-05-31", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },

  // ===================== JUNE 2027 =====================
  { id: "2027-06-01-tue", date: "2027-06-01", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-06-03-thu", date: "2027-06-03", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-06-07-mon", date: "2027-06-07", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-06-08-tue", date: "2027-06-08", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-06-10-thu", date: "2027-06-10", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-06-14-mon", date: "2027-06-14", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-06-15-tue", date: "2027-06-15", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
  { id: "2027-06-17-thu", date: "2027-06-17", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },

  { id: "2027-06-21-mon", date: "2027-06-21", startTime: "18:30", endTime: "20:30", moduleId: "tbd" },
  { id: "2027-06-22-tue", date: "2027-06-22", startTime: "18:30", endTime: "21:30", moduleId: "tbd" },
];
