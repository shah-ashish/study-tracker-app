import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { TIME_BLOCKS, COLORS } from '../constants';

export function SettingsScreen() {
  const {
    settings,
    updateNotifications,
    resetProgress,
    scheduleReminders,
    cancelReminders,
    progress,
  } = useStudy();

  const handleToggleNotifications = async (val: boolean) => {
    await updateNotifications({ enabled: val });
    if (val) {
      await scheduleReminders();
      Alert.alert('Notifications Enabled', 'Reminders will be sent before each study session begins.');
    } else {
      await cancelReminders();
      Alert.alert('Notifications Disabled', 'Study session reminders paused.');
    }
  };

  const handleSetReminderMinutes = async (minutes: number) => {
    await updateNotifications({ reminderMinutesBefore: minutes });
    if (settings.notifications.enabled) {
      await scheduleReminders();
    }
    Alert.alert('Updated', `Reminders will arrive ${minutes} minutes before each session.`);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress?',
      'This will clear completed tasks, streaks, and reset your active day to Day 1. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            Alert.alert('Reset Complete', 'Your study progress has been reset to Day 1.');
          },
        },
      ]
    );
  };

  const leadTimeOptions = [5, 10, 15];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Preferences, 10-hour master rhythm & notifications
          </Text>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Reminders & Alerts</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Session Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive a reminder alert before each study block begins
              </Text>
            </View>
            <Switch
              value={settings.notifications.enabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#262938', true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Lead time selector */}
          {settings.notifications.enabled && (
            <View style={styles.leadTimeSection}>
              <Text style={styles.subLabel}>Lead Time (Minutes Before):</Text>
              <View style={styles.optionsRow}>
                {leadTimeOptions.map(min => {
                  const isSelected = settings.notifications.reminderMinutesBefore === min;
                  return (
                    <TouchableOpacity
                      key={min}
                      onPress={() => handleSetReminderMinutes(min)}
                      style={[styles.leadBtn, isSelected && styles.leadBtnSelected]}
                    >
                      <Text style={[styles.leadBtnText, isSelected && styles.leadBtnTextSelected]}>
                        {min}m before
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* 10-Hour Daily Routine Reference */}
        <Text style={styles.sectionTitle}>10-Hour Master Daily Schedule</Text>
        <View style={styles.card}>
          {TIME_BLOCKS.map((block, idx) => (
            <View
              key={block.id}
              style={[
                styles.blockItem,
                idx === TIME_BLOCKS.length - 1 && styles.blockItemLast,
              ]}
            >
              <Text style={styles.blockEmoji}>{block.emoji}</Text>
              <View style={styles.blockInfo}>
                <View style={styles.blockTitleRow}>
                  <Text style={styles.blockTitle}>{block.title}</Text>
                  <Text style={styles.blockTime}>{block.time}</Text>
                </View>
                <Text style={styles.blockDesc}>{block.description}</Text>
              </View>
              <View style={styles.blockDurationBadge}>
                <Text style={styles.blockDurationText}>{block.duration}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Data & Reset Section */}
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Target</Text>
            <Text style={styles.infoValue}>Day {progress.currentDay} of 90</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tasks Finished</Text>
            <Text style={styles.infoValue}>
              {Object.values(progress.completions).filter(c => c.completed).length} total
            </Text>
          </View>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetProgress}
            activeOpacity={0.75}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            <Text style={styles.dangerButtonText}>Reset All Progress</Text>
          </TouchableOpacity>
        </View>

        {/* About Box */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Backend Developer Master Roadmap</Text>
          <Text style={styles.aboutText}>
            First-principles syllabus covering Node.js, TypeScript, PostgreSQL, Redis, Docker, System Design, and DSA.
          </Text>
          <Text style={styles.aboutFooter}>Frontend-only • Midnight Black & Forest White • No Day Lock</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  settingTextCol: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  leadTimeSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  leadBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.bgCardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  leadBtnSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primary,
  },
  leadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  leadBtnTextSelected: {
    color: '#FFFFFF',
  },
  testButtonsRow: {
    gap: 8,
    marginTop: 12,
  },
  testElectricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00F5FF',
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#00F5FF',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 3,
  },
  testElectricBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#05101A',
    letterSpacing: 0.2,
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.bgCardLight,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testNotificationText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  blockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  blockItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  blockEmoji: {
    fontSize: 16,
  },
  blockInfo: {
    flex: 1,
  },
  blockTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  blockTime: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  blockDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  blockDurationBadge: {
    backgroundColor: COLORS.bgCardLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  blockDurationText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  dangerButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  aboutCard: {
    backgroundColor: '#0C0D12',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  aboutText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  aboutFooter: {
    fontSize: 10,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginTop: 2,
  },
});
