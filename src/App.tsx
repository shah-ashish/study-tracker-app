import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navbar, TabType } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ElectricBanner } from './components/ElectricBanner';
import { TodayView } from './components/TodayView';
import { RoadmapView } from './components/RoadmapView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { DayDetailModal } from './components/DayDetailModal';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<TabType>('today');
  const [detailDayNumber, setDetailDayNumber] = useState<number | null>(null);
  const { skipToDay } = useStudy();

  const handleOpenDayDetail = (dayNumber: number) => {
    setDetailDayNumber(dayNumber);
  };

  const handleCloseDayDetail = () => {
    setDetailDayNumber(null);
  };

  const handleSetCurrentDay = (dayNumber: number) => {
    skipToDay(dayNumber);
    setCurrentTab('today');
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Floating Glowing Electric Alert */}
      <ElectricBanner onNavigateToToday={() => setCurrentTab('today')} />

      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'today' && (
          <TodayView
            onOpenDayDetail={handleOpenDayDetail}
            onNavigateToRoadmap={() => setCurrentTab('roadmap')}
          />
        )}

        {currentTab === 'roadmap' && (
          <RoadmapView
            onOpenDayDetail={handleOpenDayDetail}
            onSetCurrentDay={handleSetCurrentDay}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView onOpenDayDetail={handleOpenDayDetail} />
        )}

        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* Day Detail Inspector Modal */}
      {detailDayNumber !== null && (
        <DayDetailModal
          dayNumber={detailDayNumber}
          onClose={handleCloseDayDetail}
          onSetAsCurrent={handleSetCurrentDay}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <MainApp />
    </StudyProvider>
  );
}
