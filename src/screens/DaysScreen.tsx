import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { STUDY_PLAN } from '../data/studyPlan';
import { COLORS, PHASE_COLORS } from '../constants';
import { DayCard } from '../components/DayCard';
import { Phase } from '../types';

interface DaysScreenProps {
  onSelectDay: (dayNumber: number) => void;
}

type FilterOption = 'all' | Phase;

export function DaysScreen({ onSelectDay }: DaysScreenProps) {
  const { progress, getDayProgress } = useStudy();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions: { id: FilterOption; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: 90 },
    { id: 'foundations', label: 'Phase 1', count: 25 },
    { id: 'core-backend', label: 'Phase 2', count: 30 },
    { id: 'production-devops', label: 'Phase 3', count: 25 },
    { id: 'interview-prep', label: 'Phase 4', count: 10 },
  ];

  const filteredDays = useMemo(() => {
    return STUDY_PLAN.filter(day => {
      if (selectedFilter !== 'all' && day.phase !== selectedFilter) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesSection = day.section.toLowerCase().includes(q);
        const matchesRead = day.readFocus.toLowerCase().includes(q);
        const matchesPractice = day.practiceFocus.toLowerCase().includes(q);
        const matchesDayNumber = `day ${day.day}`.includes(q) || `d${day.day}` === q;
        const matchesTask = day.tasks.some(t => t.title.toLowerCase().includes(q));
        return matchesSection || matchesRead || matchesPractice || matchesDayNumber || matchesTask;
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Roadmap Explorer</Text>
          <Text style={styles.headerSubtitle}>
            90 Days • 28 Master Sections • No Day Lock
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics: Redis, Auth, Docker, SQL..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.filterScroll}>
          {filterOptions.map(opt => {
            const isSelected = selectedFilter === opt.id;
            const phaseColor = opt.id !== 'all' ? PHASE_COLORS[opt.id] : COLORS.primary;

            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setSelectedFilter(opt.id)}
                style={[
                  styles.filterChip,
                  isSelected && {
                    backgroundColor: phaseColor,
                    borderColor: phaseColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {opt.label} ({opt.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Days List */}
        <FlatList
          data={filteredDays}
          keyExtractor={item => `day-${item.day}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const prog = getDayProgress(item.day);
            const isCurrent = progress.currentDay === item.day;

            return (
              <DayCard
                day={item}
                progress={prog}
                isCurrentDay={isCurrent}
                onPress={() => onSelectDay(item.day)}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No topics match your search</Text>
              <Text style={styles.emptySubtitle}>
                Try searching for keywords like "API", "SQL", "Tree", or "Testing"
              </Text>
            </View>
          }
        />
      </View>
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
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 8,
    marginBottom: 12,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 6,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
