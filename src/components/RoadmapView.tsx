import React, { useState, useMemo } from 'react';
import { Search, X, CheckCircle2, Circle, ArrowRight, BookOpen, Code, Compass, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { STUDY_PLAN } from '../data/studyPlan';
import { PHASE_COLORS } from '../constants';
import { Phase } from '../types';

interface RoadmapViewProps {
  onOpenDayDetail: (dayNumber: number) => void;
  onSetCurrentDay: (dayNumber: number) => void;
}

type FilterPhase = 'all' | Phase;

export function RoadmapView({ onOpenDayDetail, onSetCurrentDay }: RoadmapViewProps) {
  const { progress, getDayProgress } = useStudy();
  const [selectedFilter, setSelectedFilter] = useState<FilterPhase>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions: { id: FilterPhase; label: string; count: number; color?: string }[] = [
    { id: 'all', label: 'All 90 Days', count: 90 },
    { id: 'foundations', label: 'Phase 1: Foundations', count: 25, color: PHASE_COLORS['foundations'] },
    { id: 'core-backend', label: 'Phase 2: Core Backend', count: 30, color: PHASE_COLORS['core-backend'] },
    { id: 'production-devops', label: 'Phase 3: Production & DevOps', count: 25, color: PHASE_COLORS['production-devops'] },
    { id: 'interview-prep', label: 'Phase 4: Interview Prep', count: 10, color: PHASE_COLORS['interview-prep'] },
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
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Complete Curriculum
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">90-Day Roadmap Explorer</h2>
          <p className="text-xs text-slate-400">
            90 Days • 28 Deep Architecture Sections • 630 Practical Tasks • Unlocked Access
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search: Redis, Auth, Docker, SQL, TCP..."
            className="w-full bg-[#11131A] border border-[#1E222E] focus:border-emerald-500/50 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Phase Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterOptions.map(opt => {
          const isSelected = selectedFilter === opt.id;
          const chipColor = opt.color || '#10B981';

          return (
            <button
              key={opt.id}
              onClick={() => setSelectedFilter(opt.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-[#11131A] text-slate-400 border-[#1E222E] hover:border-[#2C3244] hover:text-slate-200'
              }`}
            >
              {opt.color && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#000000' : chipColor }}
                />
              )}
              {opt.label}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Days Grid */}
      {filteredDays.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#11131A] border border-[#1E222E]">
          <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Study Days Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No days matched "{searchQuery}". Try searching for other concepts like Kafka, Redis, gRPC, or SQL.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredDays.map(day => {
            const prog = getDayProgress(day.day);
            const isCompleted = prog.percentage === 100;
            const isCurrent = progress.currentDay === day.day;
            const phaseColor = PHASE_COLORS[day.phase] || '#10B981';

            return (
              <div
                key={day.day}
                className={`group rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-[#11131A] border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-[#11131A]/70 border-[#1E222E] hover:border-emerald-500/30'
                    : 'bg-[#11131A] border-[#1E222E] hover:border-[#2C3244]'
                }`}
                onClick={() => onOpenDayDetail(day.day)}
              >
                <div>
                  {/* Top Day Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-mono text-white px-2 py-0.5 rounded-lg bg-[#08090D] border border-[#1E222E]">
                        Day {day.day}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{
                          backgroundColor: `${phaseColor}15`,
                          color: phaseColor,
                          border: `1px solid ${phaseColor}30`,
                        }}
                      >
                        {day.phaseLabel.split(':')[0]}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20" /> Done
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 animate-pulse">
                        <Sparkles className="w-3 h-3" /> Today
                      </span>
                    ) : prog.completedTasks > 0 ? (
                      <span className="text-[11px] font-mono text-slate-400">
                        {prog.completedTasks}/7 Tasks
                      </span>
                    ) : null}
                  </div>

                  {/* Section Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition mb-3 line-clamp-2">
                    {day.section}
                  </h3>

                  {/* Read & Practice Focus */}
                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <div className="flex items-start gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{day.readFocus}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Code className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{day.practiceFocus}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Progress line & Action */}
                <div className="pt-3 border-t border-[#1E222E] flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="w-full h-1.5 bg-[#08090D] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!isCurrent && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSetCurrentDay(day.day);
                        }}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition"
                        title="Set as Today's Active Routine"
                      >
                        Set Active
                      </button>
                    )}

                    <span className="p-1 text-slate-500 group-hover:text-white transition">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
