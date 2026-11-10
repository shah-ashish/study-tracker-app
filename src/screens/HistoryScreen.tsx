import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { STUDY_PLAN } from '../data/studyPlan';
import { COLORS, PHASE_COLORS } from '../constants';
import { StatsCard } from '../components/StatsCard';
import { ProgressBar } from '../components/ProgressBar';
import { Phase } from '../types';

interface HistoryScreenProps {
  onSelectDay: (dayNumber: number) => void;
}

export function HistoryScreen({ onSelectDay }: HistoryScreenProps) {
  const { progress, getStats } = useStudy();
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('completed');

  const stats = getStats();

  const phaseStats = useMemo(() => {
    const phases: { phase: Phase; label: string; days: number; color: string }[] = [
      { phase: 'foundations', label: 'Phase 1: Foundations', days: 25, color: PHASE_COLORS['foundations'] },
      { phase: 'core-backend', label: 'Phase 2: Core Backend', days: 30, color: PHASE_COLORS['core-backend'] },
      { phase: 'production-devops', label: 'Phase 3: Production & DevOps', days: 25, color: PHASE_COLORS['production-devops'] },
      { phase: 'interview-prep', label: 'Phase 4: Interview Prep', days: 10, color: PHASE_COLORS['interview-prep'] },
    ];

    return phases.map(p => {
      const phaseDays = STUDY_PLAN.filter(d => d.phase === p.phase);
      const completedDaysCount = phaseDays.filter(d => {
        const prog = progress.dayProgress[d.day];
        return prog && prog.percentage === 100;
      }).length;

      const totalPhaseTasks = phaseDays.length * 7;
      let completedPhaseTasks = 0;
      phaseDays.forEach(d => {
        d.tasks.forEach(t => {
          if (progress.completions[t.id]?.completed) {
            completedPhaseTasks++;
          }
        });
      });

      return {
        ...p,
        completedDaysCount,
        percentage: Math.round((completedDaysCount / p.days) * 100),
        completedPhaseTasks,
        totalPhaseTasks,
      };
    });
  }, [progress]);

  const historyList = useMemo(() => {
    return STUDY_PLAN.filter(d => {
      const prog = progress.dayProgress[d.day];
      if (!prog) return false;
      if (activeTab === 'completed') {
        return prog.percentage === 100 || prog.completedTasks === d.tasks.length;
      }
      return prog.completedTasks > 0;
    }).sort((a, b) => {
      const dateA = progress.dayProgress[a.day]?.completedAt || '';
      const dateB = progress.dayProgress[b.day]?.completedAt || '';
      return dateB.localeCompare(dateA);
    });
  }, [progress, activeTab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learning History</Text>
          <Text style={styles.headerSubtitle}>
            Completed milestones, streaks & phase mastery
          </Text>
        </View>

        {/* 4 Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              value={`${stats.completedDays}/${stats.totalDays}`}
              label="Days Complete"
              icon="calendar-outline"
              color={COLORS.primaryLight}
              subtext={`${stats.overallPercentage}% finished`}
            />
            <StatsCard
              value={`${stats.streakDays} Days`}
              label="Active Streak"
              icon="flame-outline"
              color={COLORS.warning}
              subtext="Consistent progress"
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              value={`${stats.completedTasks}`}
              label="Tasks Finished"
              icon="checkmark-done-circle-outline"
              color={COLORS.success}
              subtext={`of ${stats.totalTasks} total`}
            />
            <StatsCard
              value={`Day ${progress.currentDay}`}
              label="Current Day"
              icon="compass-outline"
              color={COLORS.accent}
              subtext="Active in syllabus"
            />
          </View>
        </View>

        {/* Overall Completion Bar Card */}
        <View style={styles.overallCard}>
          <View style={styles.overallCardHeader}>
            <Text style={styles.overallCardTitle}>Roadmap Mastery</Text>
            <Text style={styles.overallPercentageText}>{stats.overallPercentage}%</Text>
          </View>
          <ProgressBar
            percentage={stats.overallPercentage}
            color={COLORS.primary}
            height={8}
            showLabels={false}
          />
          <Text style={styles.overallCardSub}>
            {stats.completedDays} of 90 full study days finished
          </Text>
        </View>

        {/* Phase Breakdown */}
        <Text style={styles.sectionTitle}>Phase Progress</Text>
        <View style={styles.phasesContainer}>
          {phaseStats.map(p => (
            <View key={p.phase} style={styles.phaseCard}>
              <View style={styles.phaseCardTop}>
                <View style={styles.phaseTitleRow}>
                  <View style={[styles.phaseDot, { backgroundColor: p.color }]} />
                  <Text style={styles.phaseName}>{p.label}</Text>
                </View>
                <Text style={[styles.phaseRatio, { color: p.color }]}>
                  {p.completedDaysCount}/{p.days} Days
                </Text>
              </View>

              <ProgressBar
                percentage={p.percentage}
                color={p.color}
                height={5}
                showLabels={false}
              />

              <View style={styles.phaseFooterRow}>
                <Text style={styles.phaseTaskCount}>
                  {p.completedPhaseTasks} of {p.totalPhaseTasks} tasks done
                </Text>
                <Text style={styles.phasePercent}>{p.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Completed Topics History */}
        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionTitle}>Topic History</Text>
          <View style={styles.tabToggle}>
            <TouchableOpacity
              onPress={() => setActiveTab('completed')}
              style={[styles.toggleBtn, activeTab === 'completed' && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'completed' && styles.toggleBtnTextActive]}>
                Completed ({stats.completedDays})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('all')}
              style={[styles.toggleBtn, activeTab === 'all' && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'all' && styles.toggleBtnTextActive]}>
                Active ({Object.keys(progress.dayProgress).length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {historyList.length === 0 ? (
          <View style={styles.emptyHistoryBox}>
            <Ionicons name="time-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyHistoryTitle}>No completed topics yet</Text>
            <Text style={styles.emptyHistorySubtitle}>
              Check off tasks in Day 1 to record your completed milestones!
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {historyList.map(item => {
              const dayProg = progress.dayProgress[item.day];
              const isFull = dayProg?.percentage === 100;
              const completedDate = dayProg?.completedAt
                ? new Date(dayProg.completedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'In Progress';

              return (
                <TouchableOpacity
                  key={`hist-${item.day}`}
                  activeOpacity={0.7}
                  onPress={() => onSelectDay(item.day)}
                  style={styles.historyCard}
                >
                  <View style={styles.historyLeft}>
                    <View
                      style={[
                        styles.historyDayBadge,
                        { backgroundColor: isFull ? COLORS.success : COLORS.bgElevated },
                      ]}
                    >
                      <Text style={styles.historyDayText}>D{item.day}</Text>
                    </View>
                    <View style={styles.historyTextContainer}>
                      <Text style={styles.historySectionTitle}>
                        {item.section}
                      </Text>
                      <Text style={styles.historySubtitle}>
                        {dayProg?.completedTasks || 0}/7 tasks • {completedDate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyRight}>
                    {isFull ? (
                      <View style={styles.doneBadge}>
                        <Ionicons name="checkmark" size={13} color={COLORS.success} />
                        <Text style={styles.doneBadgeText}>Done</Text>
                      </View>
                    ) : (
                      <Text style={styles.partialText}>{dayProg?.percentage || 0}%</Text>
                    )}
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
    paddingTop: 8,
    paddingBottom: 32,
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
  statsGrid: {
    gap: 8,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  overallCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
  },
  overallCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  overallPercentageText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primaryLight,
  },
  overallCardSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  phasesContainer: {
    gap: 8,
    marginBottom: 18,
  },
  phaseCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  phaseCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  phaseName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  phaseRatio: {
    fontSize: 11,
    fontWeight: '800',
  },
  phaseFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  phaseTaskCount: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  phasePercent: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primaryDark,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  historyList: {
    gap: 8,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  historyDayBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDayText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  historyTextContainer: {
    flex: 1,
  },
  historySectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  doneBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
  },
  partialText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  emptyHistoryBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  emptyHistoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyHistorySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
