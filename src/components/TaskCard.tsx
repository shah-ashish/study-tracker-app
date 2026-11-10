import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyTask, TimeBlock } from '../types';
import { COLORS, TASK_TYPE_COLORS, TASK_TYPE_LABELS } from '../constants';

interface TaskCardProps {
  task: StudyTask;
  timeBlock: TimeBlock;
  isComplete: boolean;
  completedAt?: string | null;
  isActiveNow?: boolean;
  onToggle: () => void;
}

export function TaskCard({
  task,
  timeBlock,
  isComplete,
  completedAt,
  isActiveNow = false,
  onToggle,
}: TaskCardProps) {
  const typeColor = TASK_TYPE_COLORS[task.type] || COLORS.primary;
  const typeLabel = TASK_TYPE_LABELS[task.type] || task.type.toUpperCase();

  const formattedCompletedTime = completedAt
    ? new Date(completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.card,
        isComplete && styles.cardCompleted,
        isActiveNow && styles.cardActiveNow,
      ]}
    >
      <View
        style={[
          styles.accentBar,
          { backgroundColor: isComplete ? COLORS.success : typeColor },
        ]}
      />

      <View style={styles.contentContainer}>
        {/* Top row: Block info & active pill */}
        <View style={styles.topRow}>
          <View style={styles.timeBadgeContainer}>
            <Text style={styles.blockEmoji}>{timeBlock.emoji}</Text>
            <Text style={styles.blockTime}>{timeBlock.time}</Text>
            <View style={styles.durationPill}>
              <Text style={styles.durationText}>{timeBlock.duration}</Text>
            </View>
          </View>

          {isActiveNow && (
            <View style={styles.activePill}>
              <View style={styles.pulsingDot} />
              <Text style={styles.activeText}>NOW</Text>
            </View>
          )}

          <View style={[styles.typePill, { borderColor: typeColor + '40', backgroundColor: typeColor + '15' }]}>
            <Text style={[styles.typePillText, { color: typeColor }]}>{typeLabel}</Text>
          </View>
        </View>

        {/* Middle row: Task details & Checkbox */}
        <View style={styles.bodyRow}>
          <View style={styles.textDetails}>
            <Text
              style={[
                styles.taskTitle,
                isComplete && styles.taskTitleCompleted,
              ]}
            >
              {task.title}
            </Text>
            <Text
              style={[
                styles.taskDescription,
                isComplete && styles.taskDescriptionCompleted,
              ]}
            >
              {task.description}
            </Text>
          </View>

          {/* Interactive Checkbox */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.checkbox,
              isComplete && styles.checkboxCompleted,
            ]}
          >
            {isComplete && <Ionicons name="checkmark-sharp" size={15} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>

        {/* Footer status if complete */}
        {isComplete && formattedCompletedTime && (
          <View style={styles.footerRow}>
            <Ionicons name="checkmark-circle-outline" size={12} color={COLORS.success} />
            <Text style={styles.completedTimestamp}>
              Completed today at {formattedCompletedTime}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardCompleted: {
    backgroundColor: '#0C0D13',
    borderColor: '#191C27',
    opacity: 0.75,
  },
  cardActiveNow: {
    borderColor: COLORS.primaryLight,
    borderWidth: 1.5,
  },
  accentBar: {
    width: 4,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  timeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blockEmoji: {
    fontSize: 14,
  },
  blockTime: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  durationPill: {
    backgroundColor: COLORS.bgCardLight,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: COLORS.primaryLight,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  pulsingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
  },
  activeText: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
  },
  typePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textDetails: {
    flex: 1,
    paddingRight: 10,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 19,
    marginBottom: 3,
  },
  taskTitleCompleted: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  taskDescriptionCompleted: {
    color: COLORS.textMuted,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 4,
  },
  completedTimestamp: {
    fontSize: 11,
    color: COLORS.successLight,
    fontWeight: '500',
  },
});
