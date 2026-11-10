import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { getDayByNumber } from '../data/studyPlan';
import { TIME_BLOCKS, COLORS, PHASE_COLORS } from '../constants';
import { TaskCard } from '../components/TaskCard';
import { ProgressBar } from '../components/ProgressBar';

interface DayDetailScreenProps {
  dayNumber: number;
  onBack: () => void;
  onSetAsCurrent?: (dayNumber: number) => void;
}

export function DayDetailScreen({ dayNumber, onBack, onSetAsCurrent }: DayDetailScreenProps) {
  const {
    progress,
    toggleTask,
    completeDay,
    skipToDay,
    isTaskComplete,
    getDayProgress,
  } = useStudy();

  const day = getDayByNumber(dayNumber);
  const dayProg = getDayProgress(dayNumber);

  if (!day) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Day {dayNumber} not found</Text>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const phaseColor = PHASE_COLORS[day.phase] || COLORS.primary;
  const isAllDone = dayProg.completedTasks === day.tasks.length;
  const isCurrentDay = progress.currentDay === dayNumber;

  const handleCompleteAll = () => {
    Alert.alert(
      'Complete All Tasks',
      `Mark all 7 tasks for Day ${dayNumber} as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Done',
          onPress: () => completeDay(dayNumber),
        },
      ]
    );
  };

  const handleMakeActiveToday = () => {
    skipToDay(dayNumber);
    if (onSetAsCurrent) {
      onSetAsCurrent(dayNumber);
    } else {
      Alert.alert('Active Day Updated', `Day ${dayNumber} is now set as your active study routine!`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onBack} style={styles.navBackButton}>
            <Ionicons name="arrow-back" size={18} color={COLORS.textPrimary} />
            <Text style={styles.navBackText}>Back</Text>
          </TouchableOpacity>

          {!isCurrentDay && (
            <TouchableOpacity onPress={handleMakeActiveToday} style={styles.setActiveButton}>
              <Ionicons name="radio-button-on" size={14} color={COLORS.primaryLight} />
              <Text style={styles.setActiveText}>Set as Active Today</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Header Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={[styles.dayBadge, { backgroundColor: phaseColor }]}>
              <Text style={styles.dayBadgeText}>Day {day.day}</Text>
            </View>
            <View style={[styles.phaseBadge, { borderColor: phaseColor, backgroundColor: phaseColor + '20' }]}>
              <Text style={[styles.phaseBadgeText, { color: phaseColor }]}>{day.phaseLabel}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{day.section}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBox}>
            <ProgressBar
              percentage={dayProg.percentage}
              completedTasks={dayProg.completedTasks}
              totalTasks={day.tasks.length}
              color={isAllDone ? COLORS.success : phaseColor}
              height={6}
              showLabels={true}
            />
          </View>

          {isAllDone && (
            <View style={styles.completeBanner}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.completeBannerText}>All sessions completed for this day!</Text>
            </View>
          )}
        </View>

        {/* Read & Practice Focus */}
        <View style={styles.focusContainer}>
          <View style={styles.focusItem}>
            <View style={styles.focusItemHeader}>
              <Ionicons name="book-outline" size={15} color={COLORS.accent} />
              <Text style={[styles.focusItemLabel, { color: COLORS.accent }]}>Read Focus</Text>
            </View>
            <Text style={styles.focusItemContent}>{day.readFocus}</Text>
          </View>

          <View style={styles.focusItem}>
            <View style={styles.focusItemHeader}>
              <Ionicons name="code-slash-outline" size={15} color={COLORS.primaryLight} />
              <Text style={[styles.focusItemLabel, { color: COLORS.primaryLight }]}>Practice Focus</Text>
            </View>
            <Text style={styles.focusItemContent}>{day.practiceFocus}</Text>
          </View>
        </View>

        {/* Tasks Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.tasksSectionTitle}>Schedule (7 Blocks)</Text>
          {!isAllDone && (
            <TouchableOpacity onPress={handleCompleteAll} style={styles.markAllBtn}>
              <Text style={styles.markAllBtnText}>Mark All Done</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tasks List */}
        <View style={styles.tasksList}>
          {day.tasks.map(task => {
            const timeBlock = TIME_BLOCKS.find(b => b.id === task.blockId) || TIME_BLOCKS[0];
            const isCompleted = isTaskComplete(task.id);
            const completionData = progress.completions[task.id];

            return (
              <TaskCard
                key={task.id}
                task={task}
                timeBlock={timeBlock}
                isComplete={isCompleted}
                completedAt={completionData?.completedAt}
                onToggle={() => toggleTask(task.id, day.day)}
              />
            );
          })}
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navBackText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  setActiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  setActiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  heroCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dayBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  phaseBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 10,
    lineHeight: 24,
  },
  progressBox: {
    marginTop: 2,
  },
  completeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  completeBannerText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  focusContainer: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    gap: 12,
  },
  focusItem: {
    gap: 4,
  },
  focusItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  focusItemLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  focusItemContent: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    paddingLeft: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tasksSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  markAllBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  markAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  tasksList: {
    marginBottom: 16,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  backButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
