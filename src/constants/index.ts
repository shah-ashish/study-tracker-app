import { TimeBlock } from '../types';

export const COLORS = {
  // Midnight Black palette
  bg: '#08090D',               // Deep Midnight Black
  bgCard: '#11131A',           // Dark Charcoal Card
  bgCardLight: '#181B24',      // Elevated Card
  bgElevated: '#202430',       // Highlighted surface
  border: '#1E222E',           // Subtle dark border
  borderLight: '#2C3244',      // Light border

  // Forest White & Neutral Text
  textPrimary: '#F8FAFC',       // Crisp Forest White
  textSecondary: '#94A3B8',     // Slate Secondary White
  textMuted: '#64748B',         // Subtle Muted Slate

  // Accents
  primary: '#10B981',          // Forest Emerald
  primaryLight: '#34D399',     // Mint Emerald Light
  primaryDark: '#059669',      // Deep Forest Green
  accent: '#38BDF8',           // Sky Blue Accent
  accentLight: '#7DD3FC',

  // Status colors
  success: '#10B981',
  successLight: '#6EE7B7',
  warning: '#FBBF24',
  danger: '#F87171',

  // Phase accents
  phaseFoundations: '#10B981', // Forest Emerald
  phaseCoreBackend: '#38BDF8', // Sky Cyan
  phaseProduction: '#A78BFA',  // Violet
  phaseInterview: '#F472B6',   // Rose
};

export const PHASE_COLORS: Record<string, string> = {
  'foundations': COLORS.phaseFoundations,
  'core-backend': COLORS.phaseCoreBackend,
  'production-devops': COLORS.phaseProduction,
  'interview-prep': COLORS.phaseInterview,
};

export const TASK_TYPE_COLORS: Record<string, string> = {
  'read': '#38BDF8',    // Sky
  'code': '#10B981',    // Emerald
  'review': '#FBBF24',  // Amber
  'dsa': '#F472B6',     // Rose
  'project': '#A78BFA', // Violet
  'journal': '#34D399', // Mint
  'mock': '#FB923C',    // Orange
};

export const TASK_TYPE_LABELS: Record<string, string> = {
  'read': 'Reading',
  'code': 'Coding',
  'review': 'Review',
  'dsa': 'DSA',
  'project': 'Project',
  'journal': 'Journal',
  'mock': 'Mock',
};

// Daily time blocks (10 Hours Total)
export const TIME_BLOCKS: TimeBlock[] = [
  {
    id: 'morning-read',
    time: '7:00 – 9:30 AM',
    startHour: 7, startMin: 0, endHour: 9, endMin: 30,
    duration: '2.5h',
    title: 'Deep Read',
    emoji: '📖',
    type: 'read',
    description: 'Master new backend concept theory & notes',
  },
  {
    id: 'morning-code',
    time: '10:00 – 12:30 PM',
    startHour: 10, startMin: 0, endHour: 12, endMin: 30,
    duration: '2.5h',
    title: 'Code Lab',
    emoji: '💻',
    type: 'code',
    description: 'Implement today\'s concept from first principles',
  },
  {
    id: 'afternoon-review',
    time: '1:30 – 2:30 PM',
    startHour: 13, startMin: 30, endHour: 14, endMin: 30,
    duration: '1.0h',
    title: 'Spaced Recall',
    emoji: '🔁',
    type: 'review',
    description: 'Revisit flashcards & explain concepts aloud',
  },
  {
    id: 'afternoon-read',
    time: '2:30 – 4:30 PM',
    startHour: 14, startMin: 30, endHour: 16, endMin: 30,
    duration: '2.0h',
    title: 'Deep Read #2',
    emoji: '🧠',
    type: 'read',
    description: 'Study second backend architecture topic',
  },
  {
    id: 'evening-dsa',
    time: '5:00 – 5:45 PM',
    startHour: 17, startMin: 0, endHour: 17, endMin: 45,
    duration: '45m',
    title: 'DSA Pattern Drill',
    emoji: '🧩',
    type: 'dsa',
    description: 'Solve 3–4 targeted LeetCode pattern problems',
  },
  {
    id: 'evening-project',
    time: '5:45 – 7:00 PM',
    startHour: 17, startMin: 45, endHour: 19, endMin: 0,
    duration: '1h 15m',
    title: 'Project Build',
    emoji: '🏗️',
    type: 'project',
    description: 'Ship features into your core portfolio project',
  },
  {
    id: 'evening-journal',
    time: '7:00 – 7:30 PM',
    startHour: 19, startMin: 0, endHour: 19, endMin: 30,
    duration: '30m',
    title: 'Daily Journal',
    emoji: '📝',
    type: 'journal',
    description: 'Log takeaways, tricky points & review list',
  },
];

export const STORAGE_KEYS = {
  USER_PROGRESS: '@studytracker_progress',
  APP_SETTINGS: '@studytracker_settings',
};
