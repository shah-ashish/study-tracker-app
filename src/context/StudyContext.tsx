import React, { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { useProgress, useSettings } from '../hooks/useStorage';
import { useNotifications } from '../hooks/useNotifications';
import { UserProgress, AppSettings, DayProgress } from '../types';
import { getDayByNumber } from '../data/studyPlan';
import { TIME_BLOCKS } from '../constants';
import { InAppNotificationData } from '../components/ElectricNotificationCard';

interface StudyContextType {
  // Progress
  progress: UserProgress;
  progressLoading: boolean;
  toggleTask: (taskId: string, dayNumber: number) => Promise<void>;
  completeDay: (dayNumber: number) => Promise<void>;
  skipToDay: (dayNumber: number) => Promise<void>;
  resetProgress: () => Promise<void>;
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
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  updateNotifications: (updates: Partial<import('../types').NotificationSettings>) => Promise<void>;

  // System Notifications
  scheduleReminders: () => Promise<void>;
  cancelReminders: () => Promise<void>;
  sendTestNotification: () => Promise<boolean>;

  // Big Electric In-App Notification
  inAppAlert: InAppNotificationData | null;
  triggerTestElectricAlert: () => void;
  dismissElectricAlert: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const {
    progress, loading: progressLoading,
    toggleTask, completeDay, skipToDay, resetProgress,
    isTaskComplete, getDayProgress, getStats,
  } = useProgress();

  const {
    settings, loading: settingsLoading,
    updateSettings, updateNotifications,
  } = useSettings();

  const {
    scheduleBlockReminders,
    scheduleDailyReminder,
    cancelAll,
    sendTestNotification,
  } = useNotifications();

  // In-App Electric Alert State
  const [inAppAlert, setInAppAlert] = useState<InAppNotificationData | null>(null);
  const dismissedAlertsRef = useRef<Set<string>>(new Set());

  const triggerTestElectricAlert = () => {
    const currentDay = getDayByNumber(progress.currentDay) || getDayByNumber(1)!;
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
  };

  const dismissElectricAlert = () => {
    if (inAppAlert) {
      dismissedAlertsRef.current.add(inAppAlert.id);
    }
    setInAppAlert(null);
  };

  // Check schedule every 30 seconds for upcoming blocks to show the big electric card
  useEffect(() => {
    if (!settings.notifications.enabled) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const leadTime = settings.notifications.reminderMinutesBefore || 5;

      const currentDay = getDayByNumber(progress.currentDay);
      if (!currentDay) return;

      for (const block of TIME_BLOCKS) {
        const startMinutes = block.startHour * 60 + block.startMin;
        const alertTriggerMinute = startMinutes - leadTime;
        const blockEndMinute = block.endHour * 60 + block.endMin;

        // If we are within lead-time window or just entering the session
        const isApproaching = currentMinutes >= alertTriggerMinute && currentMinutes <= startMinutes;
        const isJustStarted = currentMinutes >= startMinutes && currentMinutes <= startMinutes + 3;

        if (isApproaching || isJustStarted) {
          const alertKey = `day-${currentDay.day}-${block.id}-${now.toISOString().split('T')[0]}`;
          if (!dismissedAlertsRef.current.has(alertKey)) {
            const task = currentDay.tasks.find(t => t.blockId === block.id);
            setInAppAlert({
              id: alertKey,
              title: isJustStarted ? `⚡ ${block.title} Starting Now` : `⚡ ${block.title} in ${leadTime}m`,
              time: block.time,
              duration: block.duration,
              taskTitle: task?.title || block.title,
              dayNumber: currentDay.day,
              type: task?.type || block.type,
            });
            break;
          }
        }
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [progress.currentDay, settings.notifications.enabled, settings.notifications.reminderMinutesBefore]);

  // System notification scheduling
  const scheduleReminders = async () => {
    if (!settings.notifications.enabled) return;
    const currentDay = getDayByNumber(progress.currentDay);
    if (currentDay) {
      await scheduleBlockReminders(currentDay, settings.notifications.reminderMinutesBefore);
      if (settings.notifications.dailyStartReminder) {
        const [h, m] = settings.notifications.dailyStartTime.split(':').map(Number);
        await scheduleDailyReminder(h, m, progress.currentDay);
      }
    }
  };

  useEffect(() => {
    if (!progressLoading && !settingsLoading) {
      scheduleReminders();
    }
  }, [progress.currentDay, settings.notifications.enabled]);

  return (
    <StudyContext.Provider value={{
      progress, progressLoading,
      toggleTask, completeDay, skipToDay, resetProgress,
      isTaskComplete, getDayProgress, getStats,
      settings, settingsLoading,
      updateSettings, updateNotifications,
      scheduleReminders,
      cancelReminders: cancelAll,
      sendTestNotification,
      inAppAlert,
      triggerTestElectricAlert,
      dismissElectricAlert,
    }}>
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
