import { TimeBlock } from '../types';

export const COLORS = {
  // Primary
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5A4BD1',

  // Accents
  accent: '#00CEC9',
  accentLight: '#81ECEC',
  warning: '#FDCB6E',
  warningDark: '#F39C12',
  danger: '#FF7675',
  dangerDark: '#D63031',
  success: '#00B894',
  successLight: '#55EFC4',

  // Neutrals
  bg: '#0F0F1A',
  bgCard: '#1A1A2E',
  bgCardLight: '#242442',
  bgElevated: '#2D2D4A',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0CC',
  textMuted: '#6C6C8A',
  border: '#2A2A45',
  borderLight: '#3A3A5A',

  // Phase colors
  phaseFoundations: '#6C5CE7',
  phaseCoreBackend: '#00CEC9',
  phaseProduction: '#FDCB6E',
  phaseInterview: '#FF7675',

  // Task type colors
  taskRead: '#74B9FF',
  taskCode: '#55EFC4',
  taskReview: '#FDCB6E',
  taskDsa: '#FF7675',
  taskProject: '#A29BFE',
  taskJournal: '#FD79A8',
  taskMock: '#E17055',
};

export const PHASE_COLORS: Record<string, string> = {
  'foundations': COLORS.phaseFoundations,
  'core-backend': COLORS.phaseCoreBackend,
  'production-devops': COLORS.phaseProduction,
  'interview-prep': COLORS.phaseInterview,
};

export const TASK_TYPE_COLORS: Record<string, string> = {
  'read': COLORS.taskRead,
  'code': COLORS.taskCode,
  'review': COLORS.taskReview,
  'dsa': COLORS.taskDsa,
  'project': COLORS.taskProject,
  'journal': COLORS.taskJournal,
  'mock': COLORS.taskMock,
};

export const TASK_TYPE_LABELS: Record<string, string> = {
  'read': '📖 Read',
  'code': '💻 Code',
  'review': '🔁 Review',
  'dsa': '🧩 DSA',
  'project': '🏗️ Project',
  'journal': '📝 Journal',
  'mock': '🎤 Mock',
};

// Daily time blocks (shared across all days)
export const TIME_BLOCKS: TimeBlock[] = [
  {
    id: 'morning-read',
    time: '7:00 – 9:30',
    startHour: 7, startMin: 0, endHour: 9, endMin: 30,
    duration: '2.5 hr',
    title: 'Deep Read',
    emoji: '🌅',
    type: 'read',
    description: 'New concept — theory + notes',
  },
  {
    id: 'morning-code',
    time: '10:00 – 12:30',
    startHour: 10, startMin: 0, endHour: 12, endMin: 30,
    duration: '2.5 hr',
    title: 'Code Lab',
    emoji: '💻',
    type: 'code',
    description: 'Implement what you just read',
  },
  {
    id: 'afternoon-review',
    time: '1:30 – 2:30',
    startHour: 13, startMin: 30, endHour: 14, endMin: 30,
    duration: '1 hr',
    title: 'Spaced Recall',
    emoji: '🔁',
    type: 'review',
    description: "Yesterday's + older topics",
  },
  {
    id: 'afternoon-read',
    time: '2:30 – 4:30',
    startHour: 14, startMin: 30, endHour: 16, endMin: 30,
    duration: '2 hr',
    title: 'Deep Read #2',
    emoji: '🧠',
    type: 'read',
    description: 'Second concept or continue morning topic',
  },
  {
    id: 'evening-dsa',
    time: '5:00 – 5:45',
    startHour: 17, startMin: 0, endHour: 17, endMin: 45,
    duration: '45 min',
    title: 'DSA Practice',
    emoji: '🧩',
    type: 'dsa',
    description: 'Solve 3–4 problems',
  },
  {
    id: 'evening-project',
    time: '5:45 – 7:00',
    startHour: 17, startMin: 45, endHour: 19, endMin: 0,
    duration: '1h 15m',
    title: 'Build / Project',
    emoji: '🏗️',
    type: 'project',
    description: 'Add features to your main project',
  },
  {
    id: 'evening-journal',
    time: '7:00 – 7:30',
    startHour: 19, startMin: 0, endHour: 19, endMin: 30,
    duration: '30 min',
    title: 'Journal',
    emoji: '📝',
    type: 'journal',
    description: 'What I learned, what confused me, what to review',
  },
];

export const STORAGE_KEYS = {
  USER_PROGRESS: '@studytracker_progress',
  APP_SETTINGS: '@studytracker_settings',
};
