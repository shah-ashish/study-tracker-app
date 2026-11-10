import React, { useState, useMemo } from 'react';
import { BarChart3, CheckCircle2, Clock, Flame, Calendar, Trophy, ArrowRight, Award } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { STUDY_PLAN } from '../data/studyPlan';
import { PHASE_COLORS } from '../constants';
import { Phase } from '../types';

interface HistoryViewProps {
  onOpenDayDetail: (dayNumber: number) => void;
}

export function HistoryView({ onOpenDayDetail }: HistoryViewProps) {
  const { progress, getStats } = useStudy();
  const [activeTab, setActiveTab] = useState<'completed' | 'in-progress'>('completed');

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
        taskPercentage: Math.round((completedPhaseTasks / totalPhaseTasks) * 100),
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
      return prog.completedTasks > 0 && prog.percentage < 100;
    }).sort((a, b) => {
      const dateA = progress.dayProgress[a.day]?.completedAt || '';
      const dateB = progress.dayProgress[b.day]?.completedAt || '';
      return dateB.localeCompare(dateA);
    });
  }, [progress, activeTab]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Performance Metrics
          </span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Analytics & Study History</h2>
        <p className="text-xs text-slate-400">
          Track consistency, 630-task mastery progression, and phase completion milestones
        </p>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#11131A] border border-[#1E222E] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Day</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            Day {stats.currentDay}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">of 90-Day Curriculum</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#11131A] border border-[#1E222E]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Days Mastered</span>
            <Trophy className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.completedDays} <span className="text-sm font-normal text-slate-500">/ 90</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
            {stats.overallPercentage}% Curriculum Completed
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#11131A] border border-[#1E222E]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tasks Done</span>
            <Award className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.completedTasks} <span className="text-sm font-normal text-slate-500">/ 630</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {stats.taskPercentage}% Tasks Finished
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#11131A] border border-[#1E222E]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono flex items-center gap-1">
            {stats.streakDays} <span className="text-sm font-normal text-slate-500">Days</span>
          </div>
          <span className="text-[11px] text-orange-400 mt-1 block font-semibold">
            🔥 Keep up the daily rhythm
          </span>
        </div>
      </div>

      {/* Phase Completion Progress Breakdown */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-[#1E222E] space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-white">4-Phase Curriculum Progression</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phaseStats.map(p => (
            <div key={p.phase} className="p-4 rounded-xl bg-[#08090D] border border-[#1E222E] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{p.label}</span>
                <span className="text-xs font-mono font-bold" style={{ color: p.color }}>
                  {p.completedDaysCount} / {p.days} Days ({p.percentage}%)
                </span>
              </div>

              <div className="w-full h-2 bg-[#181B24] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: p.color,
                    width: `${p.percentage}%`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{p.completedPhaseTasks} of {p.totalPhaseTasks} Tasks Done</span>
                <span>{p.taskPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study History Timeline */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-[#1E222E] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Study Activity Log</h3>
            <p className="text-xs text-slate-400">Review days you've marked complete or worked on</p>
          </div>

          <div className="flex items-center gap-1 bg-[#08090D] p-1 rounded-xl border border-[#1E222E]">
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'completed'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ({stats.completedDays})
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'in-progress'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              In Progress
            </button>
          </div>
        </div>

        {historyList.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#08090D] border border-[#1E222E]">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              {activeTab === 'completed'
                ? 'No days fully completed yet. Start working on your daily tasks in Today Routine!'
                : 'No partially completed days found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {historyList.map(day => {
              const prog = progress.dayProgress[day.day];
              const phaseColor = PHASE_COLORS[day.phase] || '#10B981';

              return (
                <div
                  key={day.day}
                  onClick={() => onOpenDayDetail(day.day)}
                  className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E222E] hover:border-emerald-500/40 transition flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-[#11131A] border border-[#1E222E] flex items-center justify-center font-mono font-bold text-xs text-white">
                      D{day.day}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                        {day.section}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span style={{ color: phaseColor }}>{day.phaseLabel}</span>
                        <span>•</span>
                        <span>{prog?.completedTasks || 0} of 7 Tasks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {prog?.completedAt && (
                      <span className="text-[10px] text-slate-500 hidden sm:inline">
                        {new Date(prog.completedAt).toLocaleDateString()}
                      </span>
                    )}
                    <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
