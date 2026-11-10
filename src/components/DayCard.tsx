import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyDay, DayProgress } from '../types';
import { COLORS, PHASE_COLORS } from '../constants';
import { ProgressBar } from './ProgressBar';

interface DayCardProps {
  day: StudyDay;
  progress: DayProgress;
  isCurrentDay: boolean;
  onPress: () => void;
}

export function DayCard({
  day,
  progress,
  isCurrentDay,
  onPress,
}: DayCardProps) {
  const phaseColor = PHASE_COLORS[day.phase] || COLORS.primary;
  const isComplete = progress.percentage === 100 || progress.completedTasks === day.tasks.length;
  const hasStarted = progress.completedTasks > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        isCurrentDay && styles.currentCard,
        isComplete && styles.completedCard,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.leftHeader}>
          <View
            style={[
              styles.dayBadge,
              { backgroundColor: isComplete ? COLORS.success : phaseColor },
            ]}
          >
            <Text style={styles.dayBadgeText}>D{day.day}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>
              {day.section}
            </Text>
            <Text style={styles.phaseSubtitle}>
              {day.phaseLabel}
            </Text>
          </View>
        </View>

        <View style={styles.statusIndicator}>
          {isComplete ? (
            <View style={styles.statusPillCompleted}>
              <Ionicons name="checkmark" size={12} color={COLORS.success} />
              <Text style={styles.statusPillTextCompleted}>Done</Text>
            </View>
          ) : isCurrentDay ? (
            <View style={styles.statusPillCurrent}>
              <Text style={styles.statusPillTextCurrent}>Active</Text>
            </View>
          ) : hasStarted ? (
            <View style={styles.statusPillInProgress}>
              <Text style={styles.statusPillTextInProgress}>{progress.percentage}%</Text>
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          )}
        </View>
      </View>

      <View style={styles.focusContainer}>
        <View style={styles.focusRow}>
          <Text style={styles.focusLabel}>Read:</Text>
          <Text style={styles.focusText}>
            {day.readFocus}
          </Text>
        </View>
        <View style={styles.focusRow}>
          <Text style={styles.focusLabel}>Code:</Text>
          <Text style={styles.focusText}>
            {day.practiceFocus}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarWrapper}>
        <ProgressBar
          percentage={progress.percentage}
          completedTasks={progress.completedTasks}
          totalTasks={day.tasks.length}
          color={isComplete ? COLORS.success : phaseColor}
          height={4}
          showLabels={hasStarted || isComplete}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  currentCard: {
    borderColor: COLORS.primaryLight,
    borderWidth: 1.5,
  },
  completedCard: {
    borderColor: '#192821',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  dayBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  titleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  phaseSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  statusIndicator: {
    marginLeft: 6,
  },
  statusPillCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillTextCompleted: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
  },
  statusPillCurrent: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillTextCurrent: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusPillInProgress: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillTextInProgress: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  focusContainer: {
    backgroundColor: '#0D0E14',
    padding: 8,
    borderRadius: 8,
    gap: 3,
    marginVertical: 4,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  focusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  focusText: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
  },
  progressBarWrapper: {
    marginTop: 4,
  },
});
