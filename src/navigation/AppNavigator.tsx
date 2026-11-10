import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TodayScreen, DaysScreen, DayDetailScreen, HistoryScreen, SettingsScreen } from '../screens';
import { ElectricNotificationCard } from '../components/ElectricNotificationCard';
import { useStudy } from '../context/StudyContext';
import { COLORS } from '../constants';

export type TabName = 'today' | 'days' | 'history' | 'settings';

interface NavigationState {
  currentTab: TabName;
  detailDayNumber: number | null;
  previousTabForDetail: TabName;
}

export function AppNavigator() {
  const { inAppAlert, dismissElectricAlert } = useStudy();

  const [navState, setNavState] = useState<NavigationState>({
    currentTab: 'today',
    detailDayNumber: null,
    previousTabForDetail: 'days',
  });

  const handleSelectTab = (tab: TabName) => {
    setNavState({
      currentTab: tab,
      detailDayNumber: null,
      previousTabForDetail: tab,
    });
  };

  const handleOpenDayDetail = (dayNumber: number) => {
    setNavState(prev => ({
      ...prev,
      detailDayNumber: dayNumber,
      previousTabForDetail: prev.currentTab,
    }));
  };

  const handleBackFromDetail = () => {
    setNavState(prev => ({
      ...prev,
      detailDayNumber: null,
      currentTab: prev.previousTabForDetail,
    }));
  };

  const renderActiveScreen = () => {
    if (navState.detailDayNumber !== null) {
      return (
        <DayDetailScreen
          dayNumber={navState.detailDayNumber}
          onBack={handleBackFromDetail}
          onSetAsCurrent={() => {
            setNavState({
              currentTab: 'today',
              detailDayNumber: null,
              previousTabForDetail: 'today',
            });
          }}
        />
      );
    }

    switch (navState.currentTab) {
      case 'today':
        return (
          <TodayScreen
            onNavigateToDay={handleOpenDayDetail}
            onNavigateToDaysList={() => handleSelectTab('days')}
          />
        );
      case 'days':
        return <DaysScreen onSelectDay={handleOpenDayDetail} />;
      case 'history':
        return <HistoryScreen onSelectDay={handleOpenDayDetail} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TodayScreen onNavigateToDay={handleOpenDayDetail} />;
    }
  };

  const tabs: { id: TabName; label: string; activeIcon: keyof typeof Ionicons.glyphMap; inactiveIcon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'today', label: 'Today', activeIcon: 'calendar', inactiveIcon: 'calendar-outline' },
    { id: 'days', label: 'Roadmap', activeIcon: 'list', inactiveIcon: 'list-outline' },
    { id: 'history', label: 'History', activeIcon: 'time', inactiveIcon: 'time-outline' },
    { id: 'settings', label: 'Settings', activeIcon: 'settings', inactiveIcon: 'settings-outline' },
  ];

  return (
    <View style={styles.root}>
      {/* Big Electric In-App Notification (Hard to miss, Light Electric Cyan Glow) */}
      <ElectricNotificationCard
        notification={inAppAlert}
        onDismiss={dismissElectricAlert}
        onAction={() => handleSelectTab('today')}
      />

      {/* Screen Container */}
      <View style={styles.screenWrapper}>
        {renderActiveScreen()}
      </View>

      {/* Modern Bottom Tab Bar (Tailwind Midnight Aesthetic) */}
      <SafeAreaView style={styles.tabBarSafeArea} edges={['bottom']}>
        <View style={styles.tabBar}>
          {tabs.map(tab => {
            const isActive = navState.currentTab === tab.id && navState.detailDayNumber === null;
            const iconName = isActive ? tab.activeIcon : tab.inactiveIcon;
            const tintColor = isActive ? COLORS.primary : COLORS.textMuted;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleSelectTab(tab.id)}
                activeOpacity={0.7}
                style={styles.tabButton}
              >
                <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                  <Ionicons name={iconName} size={20} color={tintColor} />
                </View>
                <Text style={[styles.tabLabel, { color: tintColor }, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screenWrapper: {
    flex: 1,
  },
  tabBarSafeArea: {
    backgroundColor: COLORS.bgCard,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 58 : 62,
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    padding: 3,
    borderRadius: 8,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  tabLabelActive: {
    fontWeight: '800',
  },
});
