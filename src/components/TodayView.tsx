import React, { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Zap,
  Play,
  CheckCheck,
  BookOpen,
  Code,
  Flame,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getDayByNumber, STUDY_PLAN } from '../data/studyPlan';
import { TIME_BLOCKS, PHASE_COLORS, TASK_TYPE_COLORS, TASK_TYPE_LABELS } from '../constants';
import { FocusTimerWidget } from './FocusTimerWidget';

interface TodayViewProps {
  onOpenDayDetail: (dayNumber: number) => void;
  onNavigateToRoadmap: () => void;
}

export function TodayView({ onOpenDayDetail, onNavigateToRoadmap }: TodayViewProps) {
  const {
    progress,
    toggleTask,
    completeDay,
    skipToDay,
    isTaskComplete,
    getDayProgress,
    startFocusTimer,
  } = useStudy();

  const currentDayNumber = progress.currentDay || 1;
  const currentDay = useMemo(
    () => getDayByNumber(currentDayNumber) || STUDY_PLAN[0],
    [currentDayNumber]
  );
  const dayProg = getDayProgress(currentDayNumber);
  const phaseColor = PHASE_COLORS[currentDay.phase] || '#10B981';

  // Determine current active time block based on wall-clock time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const { activeOrNextTask, activeTimeBlock, isCurrentlyActiveWindow } = useMemo(() => {
    let activeBlock = null;
    let isCurrentWindow = false;

    for (const block of TIME_BLOCKS) {
      const start = block.startHour * 60 + block.startMin;
      const end = block.endHour * 60 + block.endMin;
      if (currentMinutes >= start && currentMinutes < end) {
        activeBlock = block;
        isCurrentWindow = true;
        break;
      }
    }

    let targetedTask = null;
    if (activeBlock) {
      targetedTask = currentDay.tasks.find(t => t.blockId === activeBlock.id);
    }

    if (!targetedTask) {
      targetedTask = currentDay.tasks.find(t => !isTaskComplete(t.id));
    }

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

  const isAllDone = dayProg.completedTasks === currentDay.tasks.length;
  const isHeroTaskDone = activeOrNextTask ? isTaskComplete(activeOrNextTask.id) : false;
  const heroTypeColor = activeOrNextTask
    ? TASK_TYPE_COLORS[activeOrNextTask.type] || '#10B981'
    : '#10B981';

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-[#11131A] border border-[#1E222E] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-20 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: phaseColor }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${phaseColor}20`,
                  color: phaseColor,
                  border: `1px solid ${phaseColor}40`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: phaseColor }} />
                {currentDay.phaseLabel}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentDay.section}
            </h2>
          </div>

          {/* Day Navigation Controls */}
          <div className="flex items-center gap-2 bg-[#0B0D13] p-1.5 rounded-2xl border border-[#1E222E]">
            <button
              onClick={() => currentDayNumber > 1 && skipToDay(currentDayNumber - 1)}
              disabled={currentDayNumber <= 1}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181B24] disabled:opacity-30 disabled:hover:bg-transparent transition"
              title="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-3 text-center min-w-[90px]">
              <span className="text-sm font-black text-white">Day {currentDay.day}</span>
              <span className="text-[10px] text-slate-500 block -mt-0.5">of 90 Days</span>
            </div>

            <button
              onClick={() => currentDayNumber < 90 && skipToDay(currentDayNumber + 1)}
              disabled={currentDayNumber >= 90}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181B24] disabled:opacity-30 disabled:hover:bg-transparent transition"
              title="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onOpenDayDetail(currentDay.day)}
              className="ml-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              title="View Complete Curriculum Details"
            >
              Details
            </button>
          </div>
        </div>

        {/* Read & Practice Focus Quick Highlights */}
        <div className="mt-4 pt-4 border-t border-[#1E222E] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#181B24]/70 border border-[#222736]">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300 block mb-0.5">Reading Core:</span>
              <span className="text-slate-400 leading-relaxed">{currentDay.readFocus}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#181B24]/70 border border-[#222736]">
            <Code className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300 block mb-0.5">Hands-on Practice:</span>
              <span className="text-slate-400 leading-relaxed">{currentDay.practiceFocus}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Mark All Complete */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">
                {dayProg.completedTasks} of {currentDay.tasks.length} Daily Tasks Finished
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {dayProg.percentage}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#0B0D13] rounded-full overflow-hidden p-0.5 border border-[#1E222E]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${dayProg.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isAllDone ? (
              <button
                onClick={() => completeDay(currentDayNumber)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-bold transition"
              >
                <CheckCheck className="w-4 h-4" />
                Complete All 7 Tasks
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
                Day {currentDay.day} Mastered!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Focus Timer Embedded Widget */}
      <FocusTimerWidget />

      {/* ACTIVE SESSION HERO CARD */}
      {activeOrNextTask && (
        <div
          className={`rounded-2xl border p-5 sm:p-6 transition-all ${
            isHeroTaskDone
              ? 'bg-[#11131A] border-[#1E222E]'
              : isCurrentlyActiveWindow
              ? 'bg-gradient-to-br from-[#111726] to-[#0d141e] border-cyan-500/50 shadow-[0_0_25px_rgba(56,189,248,0.2)]'
              : 'bg-[#11131A] border-[#1E222E]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isCurrentlyActiveWindow
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {isAllDone
                  ? 'Day Complete'
                  : isCurrentlyActiveWindow
                  ? 'Active Session Right Now'
                  : 'Up Next Session'}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeTimeBlock.time} ({activeTimeBlock.duration})
              </span>
            </div>

            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg border w-fit"
              style={{
                backgroundColor: `${heroTypeColor}15`,
                color: heroTypeColor,
                borderColor: `${heroTypeColor}35`,
              }}
            >
              {TASK_TYPE_LABELS[activeOrNextTask.type]}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeTimeBlock.emoji}</span>
                <h3
                  className={`text-lg sm:text-xl font-bold ${
                    isHeroTaskDone ? 'text-slate-400 line-through' : 'text-white'
                  }`}
                >
                  {activeOrNextTask.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-9">
                {activeOrNextTask.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pl-9 md:pl-0 shrink-0">
              <button
                onClick={() =>
                  startFocusTimer(
                    25 * 60,
                    activeOrNextTask.title,
                    `${activeTimeBlock.emoji} ${activeTimeBlock.title}`
                  )
                }
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
                title="Start 25m Focus Timer for this task"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Focus Timer
              </button>

              <button
                onClick={() => toggleTask(activeOrNextTask.id, currentDayNumber)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                  isHeroTaskDone
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isHeroTaskDone ? (
                  <>
                    <RotateCcw className="w-4 h-4" /> Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Mark as Done
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7-TASK COMPLETE DAILY RHYTHM CHECKLIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Daily 10-Hour Rhythm Schedule
            </h3>
            <p className="text-xs text-slate-400">
              7 Structured Master Blocks for Maximum Retention
            </p>
          </div>

          <button
            onClick={onNavigateToRoadmap}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Explore 90 Days <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {currentDay.tasks.map(task => {
            const timeBlock =
              TIME_BLOCKS.find(b => b.id === task.blockId) || TIME_BLOCKS[0];
            const isDone = isTaskComplete(task.id);
            const typeColor = TASK_TYPE_COLORS[task.type] || '#10B981';
            const typeLabel = TASK_TYPE_LABELS[task.type] || task.type.toUpperCase();

            return (
              <div
                key={task.id}
                className={`group rounded-xl border p-3.5 sm:p-4 transition-all flex items-start justify-between gap-3 ${
                  isDone
                    ? 'bg-[#11131A]/60 border-[#1E222E] opacity-75'
                    : 'bg-[#11131A] border-[#1E222E] hover:border-[#2C3244]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id, currentDayNumber)}
                    className="mt-0.5 text-slate-500 hover:text-emerald-400 transition shrink-0"
                    title={isDone ? 'Mark Incomplete' : 'Mark Done'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-emerald-400" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    {/* Time & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm">{timeBlock.emoji}</span>
                      <span className="text-xs font-semibold text-slate-300 font-mono">
                        {timeBlock.time}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {timeBlock.duration}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${typeColor}15`,
                          color: typeColor,
                          borderColor: `${typeColor}30`,
                        }}
                      >
                        {typeLabel}
                      </span>
                    </div>

                    {/* Task Title & Description */}
                    <h4
                      className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer ${
                        isDone ? 'text-slate-400 line-through' : 'text-slate-100 hover:text-white'
                      }`}
                      onClick={() => toggleTask(task.id, currentDayNumber)}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Right Timer Trigger */}
                <div className="shrink-0 flex items-center">
                  <button
                    onClick={() =>
                      startFocusTimer(
                        25 * 60,
                        task.title,
                        `${timeBlock.emoji} ${timeBlock.title}`
                      )
                    }
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Start 25m Timer for this task"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
