import React from 'react';
import { Calendar, Compass, BarChart3, Settings, Flame, Zap, Github } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export type TabType = 'today' | 'roadmap' | 'history' | 'settings';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export function Navbar({ currentTab, onSelectTab }: NavbarProps) {
  const { progress, triggerTestElectricAlert } = useStudy();

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'today', label: 'Today Routine', icon: Calendar },
    { id: 'roadmap', label: '90-Day Roadmap', icon: Compass },
    { id: 'history', label: 'Analytics & History', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E222E] bg-[#08090D]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('today')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <span className="text-lg">ST</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white">StudyTracker</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO 90D
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
              Backend Systems & Architecture Mastery
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#11131A] p-1 rounded-xl border border-[#1E222E]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#181B24]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Streak & Quick Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Alert Trigger */}
          <button
            onClick={triggerTestElectricAlert}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-medium transition"
            title="Preview Live Electric Alert"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Alert Sim</span>
          </button>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span className="text-xs font-bold font-mono">{progress.streakDays || 1}d Streak</span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/shah-ashish/study-tracker-app"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181B24] transition border border-transparent hover:border-[#1E222E]"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
