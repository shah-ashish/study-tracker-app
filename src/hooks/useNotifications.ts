import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { TIME_BLOCKS } from '../constants';
import { StudyDay } from '../types';

// Configure notification handler safely
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  // Graceful ignore in environments where notification handler cannot be set
}

export function useNotifications() {
  const notificationListener = useRef<{ remove: () => void } | null>(null);
  const responseListener = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    registerForPushNotifications();

    try {
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        // Foreground notification
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        // Notification tapped
      });
    } catch (e) {
      // Ignored if listeners unsupported in environment
    }

    return () => {
      try {
        notificationListener.current?.remove();
        responseListener.current?.remove();
      } catch (e) {}
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('study-reminders', {
            name: 'Study Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#10B981',
          });
        } catch (channelErr) {
          // In Expo Go Android SDK 53+, notification channels throw NullPointer — safe to ignore
        }
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch (e) {
      return false;
    }
  };

  // Schedule notifications for all time blocks of a day
  const scheduleBlockReminders = useCallback(async (
    day: StudyDay,
    minutesBefore: number = 5
  ) => {
    try {
      // Cancel all existing notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();

      const now = new Date();

      for (const block of TIME_BLOCKS) {
        const notifDate = new Date(now);
        notifDate.setHours(block.startHour, block.startMin - minutesBefore, 0, 0);

        if (notifDate.getTime() > now.getTime()) {
          const task = day.tasks.find(t => t.blockId === block.id);
          const taskTitle = task?.title || block.title;

          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${block.emoji} ${block.title} in ${minutesBefore} min`,
              body: `Day ${day.day}: ${taskTitle} (${block.time})`,
              data: { dayNumber: day.day, blockId: block.id },
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: notifDate,
            },
          });
        }
      }
    } catch (err) {
      // Expo Go limitations or permission denied
    }
  }, []);

  // Schedule a daily start reminder
  const scheduleDailyReminder = useCallback(async (
    hour: number,
    minute: number,
    dayNumber: number
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Time to start your study day!',
          body: `Day ${dayNumber} of your Backend Roadmap is ready. Let's make progress!`,
          data: { dayNumber },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    } catch (err) {
      // Safe catch
    }
  }, []);

  // Cancel all scheduled notifications
  const cancelAll = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      // Safe catch
    }
  }, []);

  // Send an immediate test notification
  const sendTestNotification = useCallback(async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Study Session Reminder',
          body: 'Morning Code Lab (10:00 – 12:30 PM) starts soon! Time to code.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  return {
    scheduleBlockReminders,
    scheduleDailyReminder,
    cancelAll,
    registerForPushNotifications,
    sendTestNotification,
  };
}
