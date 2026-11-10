// ─── Core Types ───────────────────────────────────────────────

export type Phase = 'foundations' | 'core-backend' | 'production-devops' | 'interview-prep';

export type TaskType = 'read' | 'code' | 'review' | 'dsa' | 'project' | 'journal' | 'mock';

export type Priority = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface TimeBlock {
  id: string;
  time: string;        // e.g. "7:00 – 9:30"
  startHour: number;   // 7
  startMin: number;    // 0
  endHour: number;     // 9
  endMin: number;      // 30
  duration: string;    // "2.5 hr"
  title: string;       // "Deep Read"
  emoji: string;       // "🌅"
  type: TaskType;
  description: string;
}

export interface StudyTask {
  id: string;
  dayNumber: number;
  blockId: string;     // references TimeBlock.id
  title: string;
  description: string;
  type: TaskType;
}

export interface StudyDay {
  day: number;
  phase: Phase;
  phaseLabel: string;
  section: string;     // e.g. "§1 CS & Networking"
  readFocus: string;
  practiceFocus: string;
  tasks: StudyTask[];
}

export interface TaskCompletion {
  taskId: string;
  dayNumber: number;
  completed: boolean;
  completedAt: string | null; // ISO date
}

export interface DayProgress {
  dayNumber: number;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  startedAt: string | null;
  completedAt: string | null; // when all tasks done
}

export interface UserProgress {
  currentDay: number;          // highest unlocked day
  completions: Record<string, TaskCompletion>; // taskId -> completion
  dayProgress: Record<number, DayProgress>;
  startDate: string;           // ISO date when user started
  streakDays: number;
  lastActiveDate: string;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderMinutesBefore: number; // minutes before block starts
  dailyStartReminder: boolean;
  dailyStartTime: string;       // "06:45"
}

export interface AppSettings {
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'system';
}
