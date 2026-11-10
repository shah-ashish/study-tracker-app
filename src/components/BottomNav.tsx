import React from 'react';
import { Calendar, Compass, BarChart3, Settings } from 'lucide-react';
import { TabType } from './Navbar';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export function BottomNav({ currentTab, onSelectTab }: BottomNavProps) {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'history', label: 'History', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0D13]/95 backdrop-blur-lg border-t border-[#1E222E] px-2 py-1.5 flex items-center justify-around">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-500/15' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
