export type Stream = "M11" | "M12";
export type StreamFilter = "ALL" | Stream;
export type CommentStream = Stream | "BOTH";
export type Locale = "es" | "en";
export type CalendarViewMode = "month" | "week" | "agenda" | "units";

export type SessionStatus = "scheduled" | "cancelled" | "moved" | "tbd";

export type ModuleColorKey =
  | "amber"
  | "sky"
  | "violet"
  | "rose"
  | "emerald"
  | "indigo"
  | "cyan"
  | "fuchsia"
  | "teal"
  | "orange"
  | "slate"
  | "blue";

export interface StreamUrlMap {
  M11?: string;
  M12?: string;
}

export interface RecordingLink {
  url: string;
  labelEs?: string;
  labelEn?: string;
}

export type StreamRecordingValue = string | RecordingLink[];

export interface StreamRecordingMap {
  M11?: StreamRecordingValue;
  M12?: StreamRecordingValue;
}

export interface StreamProfessorMap {
  M11?: string;
  M12?: string;
}

export interface GradingItem {
  id: string;
  unitLabelEs?: string;
  unitLabelEn?: string;
  titleEs: string;
  titleEn?: string;
  /** Weight percentage out of 100 (0 for non-graded units) */
  weightPercent: number;
  type: "task" | "quiz" | "exam" | "none";
  /** Optional ID linking to an entry in src/data/assignments.ts */
  assignmentId?: string;
  /** Optional direct URL to the Canvas assignment description */
  descriptionUrl?: string;
  /** Optional due date text (e.g. for semester exams) */
  dueDateLabelEs?: string;
  dueDateLabelEn?: string;
}

export interface BilingualText {
  es: string;
  en: string;
}

export interface BibliographyItem {
  citation: string;
  kind: "basic" | "complementary";
}

export interface ProgramHighlight {
  titleEs: string;
  titleEn: string;
  detailEs: string;
  detailEn: string;
}

export interface ProgramOverview {
  coDirectors: string;
  welcomeEs: string;
  welcomeEn: string;
  tools: string[];
  methodologyEs: string;
  methodologyEn: string;
  beyondClassroom: ProgramHighlight[];
  supportEmail: string;
  supportNoteEs: string;
  supportNoteEn: string;
}

export interface ModuleInfo {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  shortName: string;
  shortNameEn?: string;
  color: ModuleColorKey;
  category: "general" | "core" | "certification" | "tfm" | "unassigned";
  semester?: "general" | 1 | 2 | "cert" | "tfm";
  descriptionEs?: string;
  descriptionEn?: string;
  /** Official ECTS credit count (e.g. 6 for a core unit, 60 for program overview) */
  ects?: number;
  /** Total official student workload in hours (e.g. 150) */
  workloadHours?: number;
  /** Canvas portal homepage URL for this module */
  canvasUrl?: string;
  /** Path to the official Teaching Guide PDF under /public/guides/ */
  guidePdfUrl?: string;
  /** Official UE guide reference code (e.g. "6496b3ee") */
  guideRef?: string;
  /** Key syllabus topics from Section 4 (Contenidos) of the Teaching Guide */
  topics?: BilingualText[];
  /** Official passing criteria note from Section 7.1 */
  passRuleEs?: string;
  passRuleEn?: string;
  /** Recommended basic and complementary bibliography from Section 8 */
  bibliography?: BibliographyItem[];
  /** Program-wide overview metadata (used by Aula Tutor) */
  programOverview?: ProgramOverview;
  /** Grading breakdown & assessment weights */
  grading?: GradingItem[];
  /** Recurring link shared by both M11 and M12 (if any) */
  defaultMeetingUrl?: string;
  /** Recurring links specific to M11 or M12 */
  streamUrls?: StreamUrlMap;
  /** Optional professor names per stream */
  professors?: StreamProfessorMap;
}

export interface ClassSession {
  /** Stable ID used for deep links and comments, e.g. "2026-11-26-thu" */
  id: string;
  /** YYYY-MM-DD in Europe/Madrid */
  date: string;
  /** HH:mm in 24h Europe/Madrid */
  startTime: string;
  /** HH:mm in 24h Europe/Madrid */
  endTime: string;
  moduleId: string;
  /** Optional specific session title (e.g. "Class 4 · AWS AI Practitioner") */
  title?: string;
  titleEn?: string;
  /** Optional per-session link shared by both streams */
  meetingUrl?: string;
  /** Optional per-session links specific to M11 or M12 */
  streamUrls?: StreamUrlMap;
  /** Optional recording link(s) shared by both streams */
  recordingUrl?: StreamRecordingValue;
  /** Optional recording link(s) specific to M11 or M12 */
  recordingUrls?: StreamRecordingMap;
  status?: SessionStatus;
  notesEs?: string;
  notesEn?: string;
}

export interface Milestone {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (inclusive)
  titleEs: string;
  titleEn: string;
  type: "exam" | "extraordinary" | "tfm";
  notesEs?: string;
  notesEn?: string;
}

export interface Assignment {
  id: string;
  moduleId: string;
  titleEs: string;
  titleEn?: string;
  type: "task" | "quiz";
  /** YYYY-MM-DD in Europe/Madrid */
  dueDate: string;
  /** HH:mm in 24h Europe/Madrid */
  dueTime: string;
  points?: number;
  /** Which group(s) this deadline is confirmed for */
  stream: CommentStream;
  notesEs?: string;
  notesEn?: string;
}

export type ReportReason =
  | "spam"
  | "wrong_link"
  | "inappropriate"
  | "outdated"
  | "other";

export interface CommentReport {
  reason: ReportReason;
  details?: string;
  createdAt: string;
}

export interface SessionComment {
  id: string;
  sessionId: string;
  authorName: string;
  /** Which group the poster belongs to (or BOTH if applies to all) */
  stream: CommentStream;
  body: string;
  /** Optional Teams / conference URL shared by the student */
  sharedUrl?: string;
  upvotes: number;
  reportCount: number;
  reports?: CommentReport[];
  isPinned?: boolean;
  createdAt: string; // ISO string
}

export interface ResolvedMeetingLink {
  url: string;
  source: "session" | "recurring" | "student";
  stream: CommentStream;
  sharedBy?: string;
  sharedAt?: string;
  upvotes?: number;
}
