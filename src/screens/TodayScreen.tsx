import React, { useState, useMemo } from 'react';
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
import { getDayByNumber, STUDY_PLAN } from '../data/studyPlan';
import { TIME_BLOCKS, COLORS, PHASE_COLORS, TASK_TYPE_COLORS, TASK_TYPE_LABELS } from '../constants';
import { ProgressBar } from '../components/ProgressBar';

interface TodayScreenProps {
  onNavigateToDay?: (dayNumber: number) => void;
  onNavigateToDaysList?: () => void;
}

export function TodayScreen({ onNavigateToDay, onNavigateToDaysList }: TodayScreenProps) {
  const {
    progress,
    toggleTask,
    completeDay,
    skipToDay,
    isTaskComplete,
    getDayProgress,
  } = useStudy();

  const [showAllBlocks, setShowAllBlocks] = useState(false);

  const currentDayNumber = progress.currentDay || 1;
  const currentDay = useMemo(() => getDayByNumber(currentDayNumber) || STUDY_PLAN[0], [currentDayNumber]);
  const dayProg = getDayProgress(currentDayNumber);
  const phaseColor = PHASE_COLORS[currentDay.phase] || COLORS.primary;

  // Determine which time block is active right now
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find active time block or upcoming incomplete task
  const { activeOrNextTask, activeTimeBlock, isCurrentlyActiveWindow } = useMemo(() => {
    let activeBlock = null;
    let isCurrentWindow = false;

    // Check if right now is within any block
    for (const block of TIME_BLOCKS) {
      const start = block.startHour * 60 + block.startMin;
      const end = block.endHour * 60 + block.endMin;
      if (currentMinutes >= start && currentMinutes < end) {
        activeBlock = block;
        isCurrentWindow = true;
        break;
      }
    }

    // Find the task corresponding to active block, OR the first incomplete task
    let targetedTask = null;
    if (activeBlock) {
      targetedTask = currentDay.tasks.find(t => t.blockId === activeBlock.id);
    }

    if (!targetedTask) {
      // Find first incomplete task
      targetedTask = currentDay.tasks.find(t => !isTaskComplete(t.id));
    }

    // If all tasks complete, select the last task
    if (!targetedTask && currentDay.tasks.length > 0) {
      targetedTask = currentDay.tasks[currentDay.tasks.length - 1];
    }

    const matchedBlock = targetedTask
      ? TIME_BLOCKS.find(b => b.id === targetedTask?.blockId) || TIME_BLOCKS[0]
      : TIME_BLOCKS[0];

    return {
      activeOrNextTask: targetedTask,
      activeTimeBlock: matchedBlock,
      isCurrentlyActiveWindow: isCurrentWindow && targetedTask?.blockId === activeBlock?.id,
    };
  }, [currentMinutes, currentDay, isTaskComplete]);

  const handlePrevDay = () => {
    if (currentDayNumber > 1) {
      skipToDay(currentDayNumber - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDayNumber < 90) {
      skipToDay(currentDayNumber + 1);
    }
  };

  const handleCompleteAll = () => {
    Alert.alert(
      'Complete All Tasks',
      `Mark all 7 tasks for Day ${currentDayNumber} as finished?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Done',
          onPress: () => completeDay(currentDayNumber),
        },
      ]
    );
  };

  const isAllDone = dayProg.completedTasks === currentDay.tasks.length;
  const isHeroTaskDone = activeOrNextTask ? isTaskComplete(activeOrNextTask.id) : false;
  const heroTypeColor = activeOrNextTask ? TASK_TYPE_COLORS[activeOrNextTask.type] || COLORS.primary : COLORS.primary;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Minimal Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingTitle}>Daily Routine</Text>
            <Text style={styles.dateSubtitle}>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Streak Badge */}
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{progress.streakDays || 1}</Text>
          </View>
        </View>

        {/* Sleek Day Selector (No Day Lock) */}
        <View style={styles.daySelector}>
          <TouchableOpacity
            style={[styles.selectorArrow, currentDayNumber <= 1 && styles.selectorArrowDisabled]}
            onPress={handlePrevDay}
            disabled={currentDayNumber <= 1}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={currentDayNumber <= 1 ? COLORS.textMuted : COLORS.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.selectorCenter}>
            <View style={styles.dayTagRow}>
              <Text style={styles.dayNumberText}>Day {currentDay.day}</Text>
              <View style={[styles.phaseDot, { backgroundColor: phaseColor }]} />
              <Text style={[styles.phaseName, { color: phaseColor }]}>{currentDay.phaseLabel}</Text>
            </View>
            <Text style={styles.sectionTitleText}>
              {currentDay.section}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.selectorArrow, currentDayNumber >= 90 && styles.selectorArrowDisabled]}
            onPress={handleNextDay}
            disabled={currentDayNumber >= 90}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={currentDayNumber >= 90 ? COLORS.textMuted : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Minimal Progress Line */}
        <View style={styles.progressCard}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>
              {dayProg.completedTasks} of {currentDay.tasks.length} tasks completed
            </Text>
            <Text style={styles.progressPercentage}>{dayProg.percentage}%</Text>
          </View>
          <ProgressBar
            percentage={dayProg.percentage}
            color={COLORS.primary}
            height={6}
            showLabels={false}
          />
        </View>

        {/* HERO CARD: SHOW CURRENT OR UPCOMING TASK ONLY (Uncluttered) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            {isAllDone ? 'Day Completed' : isCurrentlyActiveWindow ? 'Current Active Session' : 'Up Next'}
          </Text>
          <Text style={styles.timeScheduleHint}>{activeTimeBlock.time}</Text>
        </View>

        {activeOrNextTask && (
          <View style={[styles.heroCard, isHeroTaskDone && styles.heroCardDone]}>
            {/* Top pill bar inside hero */}
            <View style={styles.heroTopRow}>
              <View
                style={[
                  styles.statusPill,
                  isCurrentlyActiveWindow && styles.statusPillActive,
                  isHeroTaskDone && styles.statusPillDone,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: isHeroTaskDone
                        ? COLORS.success
                        : isCurrentlyActiveWindow
                        ? COLORS.primaryLight
                        : COLORS.warning,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    {
                      color: isHeroTaskDone
                        ? COLORS.success
                        : isCurrentlyActiveWindow
                        ? COLORS.primaryLight
                        : COLORS.warning,
                    },
                  ]}
                >
                  {isHeroTaskDone
                    ? 'COMPLETED'
                    : isCurrentlyActiveWindow
                    ? 'LIVE NOW'
                    : 'UPCOMING'}
                </Text>
              </View>

              <View style={styles.durationBadge}>
                <Text style={styles.durationBadgeText}>{activeTimeBlock.duration}</Text>
              </View>
            </View>

            {/* Hero Main Content */}
            <View style={styles.heroBody}>
              <View style={styles.heroTypeRow}>
                <Text style={styles.heroEmoji}>{activeTimeBlock.emoji}</Text>
                <Text style={[styles.heroTypeLabel, { color: heroTypeColor }]}>
                  {TASK_TYPE_LABELS[activeOrNextTask.type] || activeOrNextTask.type} • {activeTimeBlock.title}
                </Text>
              </View>

              <Text
                style={[
                  styles.heroTaskTitle,
                  isHeroTaskDone && styles.heroTaskTitleDone,
                ]}
              >
                {activeOrNextTask.title}
              </Text>

              <Text style={styles.heroTaskDescription}>
                {activeOrNextTask.description}
              </Text>
            </View>

            {/* Big Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleTask(activeOrNextTask.id, currentDayNumber)}
              style={[
                styles.actionBtn,
                isHeroTaskDone ? styles.actionBtnDone : styles.actionBtnIncomplete,
              ]}
            >
              <Ionicons
                name={isHeroTaskDone ? 'checkmark-circle' : 'checkmark-sharp'}
                size={20}
                color={isHeroTaskDone ? COLORS.textSecondary : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  isHeroTaskDone && styles.actionBtnTextDone,
                ]}
              >
                {isHeroTaskDone ? 'Completed • Tap to Undo' : 'Mark Task Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Read & Practice Focus Quick Pills */}
        <View style={styles.focusContainer}>
          <View style={styles.focusCard}>
            <View style={styles.focusCardHeader}>
              <Ionicons name="book-outline" size={14} color={COLORS.accent} />
              <Text style={styles.focusCardTitle}>Reading Focus</Text>
            </View>
            <Text style={styles.focusCardDesc}>
              {currentDay.readFocus}
            </Text>
          </View>

          <View style={styles.focusCard}>
            <View style={styles.focusCardHeader}>
              <Ionicons name="code-slash-outline" size={14} color={COLORS.primaryLight} />
              <Text style={styles.focusCardTitle}>Practice Focus</Text>
            </View>
            <Text style={styles.focusCardDesc}>
              {currentDay.practiceFocus}
            </Text>
          </View>
        </View>

        {/* Clean Collapsible Full Schedule */}
        <TouchableOpacity
          style={styles.toggleScheduleBtn}
          activeOpacity={0.7}
          onPress={() => setShowAllBlocks(!showAllBlocks)}
        >
          <View style={styles.toggleScheduleLeft}>
            <Ionicons
              name={showAllBlocks ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color={COLORS.textSecondary}
            />
            <Text style={styles.toggleScheduleText}>
              {showAllBlocks ? 'Hide Full Daily Schedule' : `View All ${currentDay.tasks.length} Sessions for Day ${currentDayNumber}`}
            </Text>
          </View>
          <Text style={styles.toggleCountBadge}>
            {dayProg.completedTasks}/{currentDay.tasks.length} Done
          </Text>
        </TouchableOpacity>

        {showAllBlocks && (
          <View style={styles.allBlocksList}>
            {currentDay.tasks.map((task, idx) => {
              const timeBlock = TIME_BLOCKS.find(b => b.id === task.blockId) || TIME_BLOCKS[idx] || TIME_BLOCKS[0];
              const isDone = isTaskComplete(task.id);
              const typeColor = TASK_TYPE_COLORS[task.type] || COLORS.primary;

              return (
                <TouchableOpacity
                  key={task.id}
                  activeOpacity={0.75}
                  onPress={() => toggleTask(task.id, currentDayNumber)}
                  style={[styles.miniBlockCard, isDone && styles.miniBlockCardDone]}
                >
                  <View style={styles.miniBlockLeft}>
                    <TouchableOpacity
                      onPress={() => toggleTask(task.id, currentDayNumber)}
                      style={[styles.miniCheckbox, isDone && styles.miniCheckboxDone]}
                    >
                      {isDone && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </TouchableOpacity>

                    <View style={styles.miniBlockText}>
                      <View style={styles.miniBlockHeaderRow}>
                        <Text style={styles.miniBlockTime}>{timeBlock.time}</Text>
                        <Text style={[styles.miniBlockType, { color: typeColor }]}>
                          {TASK_TYPE_LABELS[task.type]}
                        </Text>
                      </View>
                      <Text
                        style={[styles.miniBlockTitle, isDone && styles.miniBlockTitleDone]}
                      >
                        {task.title}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {!isAllDone && (
              <TouchableOpacity
                onPress={handleCompleteAll}
                style={styles.markAllDoneLink}
              >
                <Text style={styles.markAllDoneLinkText}>Mark entire day as done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Quick Advance Button */}
        {currentDayNumber < 90 && (
          <TouchableOpacity
            style={styles.advanceCard}
            activeOpacity={0.8}
            onPress={handleNextDay}
          >
            <View>
              <Text style={styles.advanceSub}>Next on your roadmap</Text>
              <Text style={styles.advanceTitle}>Day {currentDayNumber + 1} →</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={COLORS.primaryLight} />
          </TouchableOpacity>
        )}
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
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  dateSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakCount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.warning,
  },
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  selectorArrow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorArrowDisabled: {
    opacity: 0.25,
  },
  selectorCenter: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 6,
  },
  dayTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  phaseName: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    gap: 8,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryLight,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  timeScheduleHint: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  heroCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  heroCardDone: {
    backgroundColor: '#0D1117',
    borderColor: '#1B2A22',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  statusPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPillDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  durationBadge: {
    backgroundColor: COLORS.bgCardLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationBadgeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  heroBody: {
    marginBottom: 18,
  },
  heroTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  heroEmoji: {
    fontSize: 18,
  },
  heroTypeLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  heroTaskTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 25,
    marginBottom: 8,
  },
  heroTaskTitleDone: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  heroTaskDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnIncomplete: {
    backgroundColor: COLORS.primaryDark,
  },
  actionBtnDone: {
    backgroundColor: COLORS.bgCardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtnTextDone: {
    color: COLORS.textSecondary,
  },
  focusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  focusCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  focusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  focusCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  focusCardDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  toggleScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  toggleScheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  toggleScheduleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  toggleCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  allBlocksList: {
    gap: 8,
    marginBottom: 16,
  },
  miniBlockCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  miniBlockCardDone: {
    opacity: 0.6,
  },
  miniBlockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCheckboxDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  miniBlockText: {
    flex: 1,
  },
  miniBlockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  miniBlockTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  miniBlockType: {
    fontSize: 10,
    fontWeight: '800',
  },
  miniBlockTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  miniBlockTitleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  markAllDoneLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  markAllDoneLinkText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  advanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  advanceSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  advanceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});
