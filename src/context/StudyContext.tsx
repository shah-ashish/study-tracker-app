import React, { createContext, useContext, ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, AppSettings, DayProgress, StudyDay, NotificationSettings } from '../types';
import { STUDY_PLAN, getDayByNumber } from '../data/studyPlan';
import { TIME_BLOCKS, STORAGE_KEYS } from '../constants';

export interface InAppNotificationData {
  id: string;
  title: string;
  time: string;
  duration: string;
  taskTitle: string;
  dayNumber: number;
  type: string;
}

export interface FocusTimerState {
  isActive: boolean;
  timeLeftSeconds: number;
  initialSeconds: number;
  taskTitle: string;
  blockTitle: string;
}

interface StudyContextType {
  // Progress
  progress: UserProgress;
  progressLoading: boolean;
  toggleTask: (taskId: string, dayNumber: number) => void;
  completeDay: (dayNumber: number) => void;
  skipToDay: (dayNumber: number) => void;
  resetProgress: () => void;
  exportProgressJSON: () => string;
  importProgressJSON: (jsonString: string) => boolean;
  isTaskComplete: (taskId: string) => boolean;
  getDayProgress: (dayNumber: number) => DayProgress;
  getStats: () => {
    totalDays: number;
    completedDays: number;
    totalTasks: number;
    completedTasks: number;
    overallPercentage: number;
    taskPercentage: number;
    streakDays: number;
    currentDay: number;
  };

  // Settings
  settings: AppSettings;
  settingsLoading: boolean;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;

  // Browser Notifications
  requestNotificationPermission: () => Promise<boolean>;
  sendTestBrowserNotification: () => void;

  // In-App Electric Alert
  inAppAlert: InAppNotificationData | null;
  triggerTestElectricAlert: () => void;
  dismissElectricAlert: () => void;

  // Focus Timer
  focusTimer: FocusTimerState;
  startFocusTimer: (seconds: number, taskTitle: string, blockTitle: string) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  resetFocusTimer: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: true,
    reminderMinutesBefore: 5,
    dailyStartReminder: true,
    dailyStartTime: '06:45',
  },
  theme: 'dark',
};

function createDefaultProgress(): UserProgress {
  return {
    currentDay: 1,
    completions: {},
    dayProgress: {},
    startDate: new Date().toISOString(),
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  // ─── Progress State ───────────────────────────────────────────
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading user progress from localStorage:', e);
    }
    return createDefaultProgress();
  });
  const [progressLoading, setProgressLoading] = useState(false);

  // ─── Settings State ───────────────────────────────────────────
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading app settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed saving user progress to localStorage:', e);
    }
  }, [progress]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed saving app settings to localStorage:', e);
    }
  }, [settings]);

  // Streak verification on load
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== todayStr) {
      const lastDate = new Date(progress.lastActiveDate);
      const todayDate = new Date(todayStr);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        setProgress(p => ({ ...p, lastActiveDate: todayStr }));
      } else if (diffDays > 1) {
        // Broke streak
        setProgress(p => ({ ...p, streakDays: 1, lastActiveDate: todayStr }));
      }
    }
  }, [progress.lastActiveDate]);

  // ─── Task & Day Progress Handlers ─────────────────────────────
  const isTaskComplete = useCallback((taskId: string) => {
    return !!progress.completions[taskId]?.completed;
  }, [progress.completions]);

  const getDayProgress = useCallback((dayNumber: number): DayProgress => {
    const dayData = STUDY_PLAN.find(d => d.day === dayNumber);
    const totalTasks = dayData?.tasks.length || 7;
    let completedTasks = 0;

    if (dayData) {
      dayData.tasks.forEach(task => {
        if (progress.completions[task.id]?.completed) {
          completedTasks++;
        }
      });
    }

    const percentage = Math.round((completedTasks / totalTasks) * 100);
    const storedProg = progress.dayProgress[dayNumber];

    return {
      dayNumber,
      totalTasks,
      completedTasks,
      percentage,
      startedAt: storedProg?.startedAt || null,
      completedAt: storedProg?.completedAt || (completedTasks === totalTasks ? new Date().toISOString() : null),
    };
  }, [progress]);

  const toggleTask = useCallback((taskId: string, dayNumber: number) => {
    const now = new Date().toISOString();
    const isCurrentlyDone = !!progress.completions[taskId]?.completed;
    const newStatus = !isCurrentlyDone;

    const newCompletions = {
      ...progress.completions,
      [taskId]: {
        taskId,
        dayNumber,
        completed: newStatus,
        completedAt: newStatus ? now : null,
      },
    };

    const dayData = STUDY_PLAN.find(d => d.day === dayNumber);
    const totalTasks = dayData?.tasks.length || 7;
    const completedTasks = dayData?.tasks.filter(t => newCompletions[t.id]?.completed).length || 0;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    const isDayCompletedNow = completedTasks === totalTasks;

    const dayProg: DayProgress = {
      dayNumber,
      totalTasks,
      completedTasks,
      percentage,
      startedAt: progress.dayProgress[dayNumber]?.startedAt || now,
      completedAt: isDayCompletedNow ? now : null,
    };

    let nextCurrentDay = progress.currentDay;
    if (isDayCompletedNow && dayNumber >= progress.currentDay && dayNumber < 90) {
      nextCurrentDay = dayNumber + 1;
    }

    if (isDayCompletedNow) {
      // Fire celebration confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#38BDF8', '#FBBF24', '#A78BFA'],
        });
      } catch (e) {}
    }

    setProgress(prev => ({
      ...prev,
      currentDay: nextCurrentDay,
      completions: newCompletions,
      dayProgress: {
        ...prev.dayProgress,
        [dayNumber]: dayProg,
      },
      lastActiveDate: new Date().toISOString().split('T')[0],
    }));
  }, [progress]);

  const completeDay = useCallback((dayNumber: number) => {
    const now = new Date().toISOString();
    const dayData = STUDY_PLAN.find(d => d.day === dayNumber);
    if (!dayData) return;

    const newCompletions = { ...progress.completions };
    dayData.tasks.forEach(task => {
      newCompletions[task.id] = {
        taskId: task.id,
        dayNumber,
        completed: true,
        completedAt: now,
      };
    });

    const dayProg: DayProgress = {
      dayNumber,
      totalTasks: dayData.tasks.length,
      completedTasks: dayData.tasks.length,
      percentage: 100,
      startedAt: progress.dayProgress[dayNumber]?.startedAt || now,
      completedAt: now,
    };

    let nextCurrentDay = progress.currentDay;
    if (dayNumber >= progress.currentDay && dayNumber < 90) {
      nextCurrentDay = dayNumber + 1;
    }

    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#10B981', '#38BDF8', '#FBBF24', '#F472B6'],
      });
    } catch (e) {}

    setProgress(prev => ({
      ...prev,
      currentDay: nextCurrentDay,
      completions: newCompletions,
      dayProgress: {
        ...prev.dayProgress,
        [dayNumber]: dayProg,
      },
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakDays: prev.streakDays + 1,
    }));
  }, [progress]);

  const skipToDay = useCallback((dayNumber: number) => {
    if (dayNumber >= 1 && dayNumber <= 90) {
      setProgress(prev => ({ ...prev, currentDay: dayNumber }));
    }
  }, []);

  const resetProgress = useCallback(() => {
    const defaultData = createDefaultProgress();
    setProgress(defaultData);
  }, []);

  const exportProgressJSON = useCallback(() => {
    return JSON.stringify(progress, null, 2);
  }, [progress]);

  const importProgressJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.currentDay === 'number' && parsed.completions) {
        setProgress(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid progress JSON:', e);
    }
    return false;
  }, []);

  const getStats = useCallback(() => {
    const totalDays = 90;
    const totalTasks = totalDays * 7;
    let completedTasks = 0;
    let completedDays = 0;

    STUDY_PLAN.forEach(day => {
      let dayDone = 0;
      day.tasks.forEach(task => {
        if (progress.completions[task.id]?.completed) {
          completedTasks++;
          dayDone++;
        }
      });
      if (dayDone === day.tasks.length) {
        completedDays++;
      }
    });

    return {
      totalDays,
      completedDays,
      totalTasks,
      completedTasks,
      overallPercentage: Math.round((completedDays / totalDays) * 100),
      taskPercentage: Math.round((completedTasks / totalTasks) * 100),
      streakDays: progress.streakDays || 1,
      currentDay: progress.currentDay,
    };
  }, [progress]);

  // ─── Settings Handlers ─────────────────────────────────────────
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateNotifications = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  }, []);

  // ─── Web Notifications ─────────────────────────────────────────
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }, []);

  const sendTestBrowserNotification = useCallback(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('⚡ StudyTracker Reminder', {
        body: 'Deep Read session begins in 5 minutes! Master TCP socket states.',
        icon: './assets/favicon.png',
      });
    } else {
      Notification.requestPermission().then(p => {
        if (p === 'granted') {
          new Notification('⚡ StudyTracker Reminder', {
            body: 'Notifications enabled! You will be alerted before sessions start.',
            icon: './assets/favicon.png',
          });
        }
      });
    }
  }, []);

  // ─── Electric In-App Alert ─────────────────────────────────────
  const [inAppAlert, setInAppAlert] = useState<InAppNotificationData | null>(null);
  const dismissedAlertsRef = useRef<Set<string>>(new Set());

  const triggerTestElectricAlert = useCallback(() => {
    const currentDay = getDayByNumber(progress.currentDay) || STUDY_PLAN[0];
    const block = TIME_BLOCKS[1] || TIME_BLOCKS[0]; // Code Lab
    const task = currentDay.tasks.find(t => t.blockId === block.id) || currentDay.tasks[0];

    setInAppAlert({
      id: `alert-test-${Date.now()}`,
      title: `${block.emoji} ${block.title}`,
      time: block.time,
      duration: block.duration,
      taskTitle: task.title,
      dayNumber: currentDay.day,
      type: task.type,
    });
  }, [progress.currentDay]);

  const dismissElectricAlert = useCallback(() => {
    if (inAppAlert) {
      dismissedAlertsRef.current.add(inAppAlert.id);
    }
    setInAppAlert(null);
  }, [inAppAlert]);

  // Check schedule every 30 seconds for upcoming blocks
  useEffect(() => {
    if (!settings.notifications.enabled) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;
      const leadTime = settings.notifications.reminderMinutesBefore || 5;

      const currentDay = getDayByNumber(progress.currentDay) || STUDY_PLAN[0];

      for (const block of TIME_BLOCKS) {
        const blockStartTotalMin = block.startHour * 60 + block.startMin;
        const diff = blockStartTotalMin - currentTotalMin;

        // Fire alert when current time is within leadTime before start or right when starting
        if (diff >= 0 && diff <= leadTime) {
          const alertKey = `alert-${progress.currentDay}-${block.id}-${now.toDateString()}`;
          if (!dismissedAlertsRef.current.has(alertKey)) {
            const task = currentDay.tasks.find(t => t.blockId === block.id) || currentDay.tasks[0];
            setInAppAlert({
              id: alertKey,
              title: `${block.emoji} ${block.title} ${diff === 0 ? 'Starting Now!' : `in ${diff}m`}`,
              time: block.time,
              duration: block.duration,
              taskTitle: task.title,
              dayNumber: currentDay.day,
              type: task.type,
            });

            // Also fire browser notification if allowed
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`${block.emoji} ${block.title} starting!`, {
                body: `Day ${currentDay.day}: ${task.title} (${block.time})`,
                icon: './assets/favicon.png',
              });
            }
            break;
          }
        }
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [settings.notifications.enabled, settings.notifications.reminderMinutesBefore, progress.currentDay]);

  // ─── Focus Timer (Pomodoro / Stopwatch) ─────────────────────────
  const [focusTimer, setFocusTimer] = useState<FocusTimerState>({
    isActive: false,
    timeLeftSeconds: 25 * 60,
    initialSeconds: 25 * 60,
    taskTitle: 'Deep Read',
    blockTitle: 'Morning Session',
  });

  useEffect(() => {
    let interval: any = null;
    if (focusTimer.isActive && focusTimer.timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setFocusTimer(prev => ({
          ...prev,
          timeLeftSeconds: Math.max(0, prev.timeLeftSeconds - 1),
        }));
      }, 1000);
    } else if (focusTimer.isActive && focusTimer.timeLeftSeconds === 0) {
      // Completed timer!
      setFocusTimer(prev => ({ ...prev, isActive: false }));
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Session Complete!', {
          body: `Great job on: ${focusTimer.taskTitle}. Time for a quick break!`,
          icon: './assets/favicon.png',
        });
      }
    }
    return () => clearInterval(interval);
  }, [focusTimer.isActive, focusTimer.timeLeftSeconds, focusTimer.taskTitle]);

  const startFocusTimer = useCallback((seconds: number, taskTitle: string, blockTitle: string) => {
    setFocusTimer({
      isActive: true,
      timeLeftSeconds: seconds,
      initialSeconds: seconds,
      taskTitle,
      blockTitle,
    });
  }, []);

  const pauseFocusTimer = useCallback(() => {
    setFocusTimer(prev => ({ ...prev, isActive: false }));
  }, []);

  const resumeFocusTimer = useCallback(() => {
    setFocusTimer(prev => ({ ...prev, isActive: true }));
  }, []);

  const resetFocusTimer = useCallback(() => {
    setFocusTimer(prev => ({
      ...prev,
      isActive: false,
      timeLeftSeconds: prev.initialSeconds,
    }));
  }, []);

  return (
    <StudyContext.Provider
      value={{
        progress,
        progressLoading,
        toggleTask,
        completeDay,
        skipToDay,
        resetProgress,
        exportProgressJSON,
        importProgressJSON,
        isTaskComplete,
        getDayProgress,
        getStats,
        settings,
        settingsLoading,
        updateSettings,
        updateNotifications,
        requestNotificationPermission,
        sendTestBrowserNotification,
        inAppAlert,
        triggerTestElectricAlert,
        dismissElectricAlert,
        focusTimer,
        startFocusTimer,
        pauseFocusTimer,
        resumeFocusTimer,
        resetFocusTimer,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
