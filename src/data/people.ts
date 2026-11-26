import { MODULES } from "@/data/modules";
import type { CommentStream, ModuleInfo, Stream } from "@/types/calendar";

export interface ProgramStaffMember {
  id: string;
  name: string;
  roleEs: string;
  roleEn: string;
  badgeEs: string;
  badgeEn: string;
  stream: CommentStream;
  noteEs: string;
  noteEn: string;
  /** Optional related module IDs (clickable to jump to Course & Units) */
  relatedModuleIds?: string[];
  email?: string;
}

export interface ClassRepresentative {
  id: string;
  name: string;
  roleEs: string;
  roleEn: string;
  isDeputy?: boolean;
  stream: Stream;
}

export interface SupportContact {
  id: string;
  nameEs: string;
  nameEn: string;
  email: string;
  noteEs: string;
  noteEn: string;
}

export interface FacultyAssignment {
  module: ModuleInfo;
  streams: Stream[];
}

export interface FacultyMember {
  name: string;
  assignments: FacultyAssignment[];
  /** Extra leadership title if this professor is also a program co-director */
  leadershipRoleEs?: string;
  leadershipRoleEn?: string;
}

/**
 * University leadership, academic coordination, and online tutoring.
 * Update here whenever additional tutors or coordinators are announced.
 */
export const PROGRAM_LEADERSHIP: ProgramStaffMember[] = [
  {
    id: "david-garde",
    name: "David Garde",
    roleEs: "Tutor Online",
    roleEn: "Online Tutor",
    badgeEs: "Tutoría",
    badgeEn: "Tutoring",
    stream: "BOTH",
    noteEs:
      "Referente principal para seguimiento del curso, Aula Tutor, avisos generales, elecciones de delegados y consultas administrativas (Portal del Estudiante).",
    noteEn:
      "Primary point of contact for course logistics, Aula Tutor announcements, class representative elections, and Student Portal administrative requests.",
    relatedModuleIds: ["aula-tutor"],
  },
  {
    id: "victor-yeste",
    name: "Víctor Yeste Moreno",
    roleEs: "Codirector del Máster",
    roleEn: "Master's Co-director",
    badgeEs: "Dirección",
    badgeEn: "Leadership",
    stream: "BOTH",
    noteEs:
      "Codirector académico del Máster Universitario en Inteligencia Artificial (UE Valencia) y docente coordinador de Metodología de la Investigación.",
    noteEn:
      "Academic co-director of the Online Master's in AI (UE Valencia) and lead coordinator for Research Methodology.",
    relatedModuleIds: ["aula-tutor", "metodologia"],
  },
  {
    id: "idir-ouhab",
    name: "Idir Ouhab",
    roleEs: "Codirector del Máster",
    roleEn: "Master's Co-director",
    badgeEs: "Dirección",
    badgeEn: "Leadership",
    stream: "BOTH",
    noteEs:
      "Codirector académico del Máster Universitario en Inteligencia Artificial (UE Valencia) y docente coordinador de IA Generativa (M12).",
    noteEn:
      "Academic co-director of the Online Master's in AI (UE Valencia) and lead coordinator for Generative AI (M12).",
    relatedModuleIds: ["aula-tutor", "genai"],
  },
];

/**
 * Elected student representatives per stream (announced by David Garde via Aula Tutor).
 */
export const CLASS_REPRESENTATIVES: ClassRepresentative[] = [
  {
    id: "rep-m11-delegate",
    name: "Tomás Pérez Vellarino",
    roleEs: "Delegado del grupo M11",
    roleEn: "M11 Class Representative",
    stream: "M11",
  },
  {
    id: "rep-m11-subdelegate",
    name: "Carlos Luis Madueño López",
    roleEs: "Subdelegado del grupo M11",
    roleEn: "M11 Deputy Representative",
    isDeputy: true,
    stream: "M11",
  },
  {
    id: "rep-m12-delegate",
    name: "William Matiz Delgado",
    roleEs: "Delegado del grupo M12",
    roleEn: "M12 Class Representative",
    stream: "M12",
  },
];

export const STUDENT_SUPPORT_CONTACTS: SupportContact[] = [
  {
    id: "odi-valencia",
    nameEs: "Unidad de Orientación Educativa y Diversidad (ODI · UE Valencia)",
    nameEn: "Educational Guidance & Diversity Unit (ODI · UE Valencia)",
    email: "orientacioneducativa.uev@universidadeuropea.es",
    noteEs:
      "Acompañamiento académico, planes personalizados, ajustes metodológicos para necesidades específicas y orientación vocacional.",
    noteEn:
      "Academic mentoring, personalized study plans, curricular accommodations for specific learning needs, and career guidance.",
  },
  {
    id: "odi-alicante",
    nameEs: "ODI · Universidad Europea de Valencia (Alicante)",
    nameEn: "ODI · Universidad Europea de Valencia (Alicante)",
    email: "orientacioneducativa.alc@universidadeuropea.es",
    noteEs: "Contacto de apoyo educativo del campus de Alicante.",
    noteEn: "Educational support contact for the Alicante campus.",
  },
];

/**
 * Automatically builds the Faculty directory from src/data/modules.ts so
 * professor updates in modules.ts stay in sync without duplicating data.
 */
export function buildFacultyDirectory(): FacultyMember[] {
  const byName = new Map<string, FacultyMember>();

  const leadershipByName = new Map(
    PROGRAM_LEADERSHIP.map((staff) => [staff.name.toLowerCase(), staff]),
  );

  for (const mod of MODULES) {
    if (!mod.professors) continue;

    for (const stream of ["M11", "M12"] as Stream[]) {
      const rawName = mod.professors[stream];
      if (!rawName) continue;

      // Split co-taught entries like "Lidia Contreras Ochando & Daniel Stanislowsky"
      const individualNames = rawName
        .split(/\s*&\s*/)
        .map((n) => n.trim())
        .filter(Boolean);

      for (const name of individualNames) {
        const key = name.toLowerCase();
        let member = byName.get(key);
        if (!member) {
          const leadership = leadershipByName.get(key);
          member = {
            name,
            assignments: [],
            leadershipRoleEs: leadership?.roleEs,
            leadershipRoleEn: leadership?.roleEn,
          };
          byName.set(key, member);
        }

        const existingAssignment = member.assignments.find(
          (a) => a.module.id === mod.id,
        );
        if (existingAssignment) {
          if (!existingAssignment.streams.includes(stream)) {
            existingAssignment.streams.push(stream);
          }
        } else {
          member.assignments.push({ module: mod, streams: [stream] });
        }
      }
    }
  }

  return Array.from(byName.values());
}
