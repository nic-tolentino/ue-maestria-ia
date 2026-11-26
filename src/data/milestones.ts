import type { Milestone } from "@/types/calendar";

export const MILESTONES: Milestone[] = [
  {
    id: "exam-sem-1",
    startDate: "2027-04-10",
    endDate: "2027-04-11",
    titleEs: "Pruebas Evaluativas del 1º Semestre",
    titleEn: "1st Semester Evaluation Exams",
    type: "exam",
  },
  {
    id: "exam-sem-2",
    startDate: "2027-07-10",
    endDate: "2027-07-11",
    titleEs: "Pruebas Evaluativas del 2º Semestre",
    titleEn: "2nd Semester Evaluation Exams",
    type: "exam",
  },
  {
    id: "exam-extraordinaria",
    startDate: "2027-09-11",
    endDate: "2027-09-12",
    titleEs: "Convocatoria Extraordinaria",
    titleEn: "Extraordinary Exam Session",
    type: "extraordinary",
  },
  {
    id: "tfm-ordinaria",
    startDate: "2027-10-16",
    endDate: "2027-10-21",
    titleEs: "Defensa de TFM Ordinaria",
    titleEn: "Master's Thesis (TFM) Defense — Ordinary",
    type: "tfm",
  },
  {
    id: "tfm-extraordinaria",
    startDate: "2027-11-13",
    endDate: "2027-11-18",
    titleEs: "Defensa de TFM Extraordinaria",
    titleEn: "Master's Thesis (TFM) Defense — Extraordinary",
    type: "tfm",
  },
];
