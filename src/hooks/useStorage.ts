import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { UserProgress, TaskCompletion, AppSettings, NotificationSettings } from '../types';
import { STORAGE_KEYS } from '../constants';
import { STUDY_PLAN } from '../data/studyPlan';

// ─── Default Values ──────────────────────────────────────────

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  reminderMinutesBefore: 5,
  dailyStartReminder: true,
  dailyStartTime: '06:45',
};

const DEFAULT_SETTINGS: AppSettings = {
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  theme: 'dark',
};

function createDefaultProgress(): UserProgress {
  return {
    currentDay: 1,
    completions: {},
    dayProgress: {},
    startDate: new Date().toISOString(),
    streakDays: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
}

// ─── useProgress Hook ────────────────────────────────────────

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(createDefaultProgress());
  const [loading, setLoading] = useState(true);

  // Load progress from storage
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (updated: UserProgress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
      setProgress(updated);
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  // Toggle task completion
  const toggleTask = useCallback(async (taskId: string, dayNumber: number) => {
    const now = new Date().toISOString();
    const existing = progress.completions[taskId];
    const isCompleting = !existing?.completed;

    const newCompletion: TaskCompletion = {
      taskId,
      dayNumber,
      completed: isCompleting,
      completedAt: isCompleting ? now : null,
    };

    const newCompletions = { ...progress.completions, [taskId]: newCompletion };

    // Recalculate day progress
    const dayData = STUDY_PLAN.find(d => d.day === dayNumber);
    const totalTasks = dayData?.tasks.length || 7;
    const completedTasks = dayData?.tasks.filter(t => newCompletions[t.id]?.completed).length || 0;

    const dayProg = {
      dayNumber,
      totalTasks,
      completedTasks,
      percentage: Math.round((completedTasks / totalTasks) * 100),
      startedAt: progress.dayProgress[dayNumber]?.startedAt || now,
      completedAt: completedTasks === totalTasks ? now : null,
    };

    // Calculate current day (highest accessible day)
    // If a day is fully complete, unlock the next one
    let currentDay = progress.currentDay;
    const updatedDayProgress = { ...progress.dayProgress, [dayNumber]: dayProg };
    
    // Check if current day is completed and unlock next
    if (dayProg.completedAt && dayNumber >= currentDay) {
      currentDay = dayNumber + 1;
      if (currentDay > 90) currentDay = 90;
    }

    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    let streakDays = progress.streakDays;
    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate);
      const todayDate = new Date(today);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (86400000));
      if (diffDays === 1) {
        streakDays += 1;
      } else if (diffDays > 1) {
        streakDays = 1;
      }
    }

    const updated: UserProgress = {
      ...progress,
      currentDay,
      completions: newCompletions,
      dayProgress: updatedDayProgress,
      streakDays,
      lastActiveDate: today,
    };

    await saveProgress(updated);
  }, [progress]);

  // Mark entire day as complete
  const completeDay = useCallback(async (dayNumber: number) => {
    const dayData = STUDY_PLAN.find(d => d.day === dayNumber);
    if (!dayData) return;

    const now = new Date().toISOString();
    const newCompletions = { ...progress.completions };
    
    dayData.tasks.forEach(task => {
      newCompletions[task.id] = {
        taskId: task.id,
        dayNumber,
        completed: true,
        completedAt: now,
      };
    });

    let currentDay = Math.max(progress.currentDay, dayNumber + 1);
    if (currentDay > 90) currentDay = 90;

    const updated: UserProgress = {
      ...progress,
      currentDay,
      completions: newCompletions,
      dayProgress: {
        ...progress.dayProgress,
        [dayNumber]: {
          dayNumber,
          totalTasks: dayData.tasks.length,
          completedTasks: dayData.tasks.length,
          percentage: 100,
          startedAt: progress.dayProgress[dayNumber]?.startedAt || now,
          completedAt: now,
        },
      },
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    await saveProgress(updated);
  }, [progress]);

  // Skip to a specific day
  const skipToDay = useCallback(async (dayNumber: number) => {
    const updated: UserProgress = {
      ...progress,
      currentDay: dayNumber,
    };
    await saveProgress(updated);
  }, [progress]);

  // Reset all progress
  const resetProgress = useCallback(async () => {
    const fresh = createDefaultProgress();
    await saveProgress(fresh);
  }, []);

  // Get completion status for a specific task
  const isTaskComplete = useCallback((taskId: string): boolean => {
    return progress.completions[taskId]?.completed || false;
  }, [progress]);

  // Get day progress
  const getDayProgress = useCallback((dayNumber: number) => {
    return progress.dayProgress[dayNumber] || {
      dayNumber,
      totalTasks: 7,
      completedTasks: 0,
      percentage: 0,
      startedAt: null,
      completedAt: null,
    };
  }, [progress]);

  // Get overall stats
  const getStats = useCallback(() => {
    const totalDays = 90;
    const completedDays = Object.values(progress.dayProgress).filter(d => d.completedAt).length;
    const totalTasks = totalDays * 7; // 7 tasks per day
    const completedTasks = Object.values(progress.completions).filter(c => c.completed).length;
    
    return {
      totalDays,
      completedDays,
      totalTasks,
      completedTasks,
      overallPercentage: Math.round((completedDays / totalDays) * 100),
      taskPercentage: Math.round((completedTasks / totalTasks) * 100),
      streakDays: progress.streakDays,
      currentDay: progress.currentDay,
    };
  }, [progress]);

  return {
    progress,
    loading,
    toggleTask,
    completeDay,
    skipToDay,
    resetProgress,
    isTaskComplete,
    getDayProgress,
    getStats,
  };
}

// ─── useSettings Hook ────────────────────────────────────────

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(updated));
      setSettings(updated);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const updateNotifications = async (updates: Partial<NotificationSettings>) => {
    const updated = {
      ...settings,
      notifications: { ...settings.notifications, ...updates },
    };
    await updateSettings(updated);
  };

  return {
    settings,
    loading,
    updateSettings,
    updateNotifications,
  };
}
