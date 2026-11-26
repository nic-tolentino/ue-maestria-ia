import type { Assignment } from "@/types/calendar";

/**
 * Assignment & quiz submission deadlines (Europe/Madrid).
 * Update `stream` from "M12" to "BOTH" once confirmed that M11 shares the same deadlines.
 */
export const ASSIGNMENTS: Assignment[] = [
  {
    id: "ids-act-1",
    moduleId: "intro-ds-ia",
    titleEs: "Actividad 1. Del dataset real a la respuesta de negocio",
    titleEn: "Activity 1. From real dataset to business answer",
    type: "task",
    dueDate: "2026-11-23",
    dueTime: "18:00",
    points: 10,
    stream: "M12",
    notesEs: "Confirmado para M12 (pendiente confirmar si aplica igual a M11).",
    notesEn: "Confirmed for M12 (pending confirmation for M11).",
  },
  {
    id: "ids-act-2",
    moduleId: "intro-ds-ia",
    titleEs: "Actividad 2. Cuestionario unidad 3",
    titleEn: "Activity 2. Unit 3 Quiz",
    type: "quiz",
    dueDate: "2026-11-23",
    dueTime: "18:00",
    points: 10,
    stream: "M12",
    notesEs: "Confirmado para M12 (pendiente confirmar si aplica igual a M11).",
    notesEn: "Confirmed for M12 (pending confirmation for M11).",
  },
  {
    id: "ids-act-3",
    moduleId: "intro-ds-ia",
    titleEs: "Actividad 3. Cuestionario unidad 4",
    titleEn: "Activity 3. Unit 4 Quiz",
    type: "quiz",
    dueDate: "2026-11-23",
    dueTime: "18:00",
    points: 10,
    stream: "M12",
    notesEs: "Confirmado para M12 (pendiente confirmar si aplica igual a M11).",
    notesEn: "Confirmed for M12 (pending confirmation for M11).",
  },
  {
    id: "ids-act-4",
    moduleId: "intro-ds-ia",
    titleEs: "Actividad 4. Desarrollo de un caso de IA aplicada",
    titleEn: "Activity 4. Applied AI case development",
    type: "task",
    dueDate: "2026-11-30",
    dueTime: "18:00",
    points: 10,
    stream: "M12",
    notesEs:
      "Disponible y fecha de entrega hasta el 30 nov a las 18:00 (M12; pendiente confirmar para M11).",
    notesEn:
      "Available and due until Nov 30 at 18:00 (M12; pending confirmation for M11).",
  },
];
