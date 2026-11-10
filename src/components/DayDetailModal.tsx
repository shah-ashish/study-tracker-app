import React from 'react';
import { X, CheckCircle2, Circle, BookOpen, Code, Clock, CheckCheck, Play, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getDayByNumber } from '../data/studyPlan';
import { TIME_BLOCKS, PHASE_COLORS, TASK_TYPE_COLORS, TASK_TYPE_LABELS } from '../constants';

interface DayDetailModalProps {
  dayNumber: number;
  onClose: () => void;
  onSetAsCurrent: (dayNumber: number) => void;
}

export function DayDetailModal({ dayNumber, onClose, onSetAsCurrent }: DayDetailModalProps) {
  const {
    progress,
    toggleTask,
    completeDay,
    isTaskComplete,
    getDayProgress,
    startFocusTimer,
  } = useStudy();

  const day = getDayByNumber(dayNumber);
  if (!day) return null;

  const dayProg = getDayProgress(dayNumber);
  const phaseColor = PHASE_COLORS[day.phase] || '#10B981';
  const isCurrent = progress.currentDay === dayNumber;
  const isAllDone = dayProg.completedTasks === day.tasks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0D0F16] border border-[#1E222E] shadow-2xl overflow-hidden">
        {/* Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: phaseColor }}
        />

        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 border-b border-[#1E222E] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black font-mono text-white px-2.5 py-0.5 rounded-lg bg-[#11131A] border border-[#1E222E]">
                Day {day.day}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                style={{
                  backgroundColor: `${phaseColor}20`,
                  color: phaseColor,
                  border: `1px solid ${phaseColor}40`,
                }}
              >
                {day.phaseLabel}
              </span>
              {isCurrent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Active Today
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{day.section}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181B24] transition shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Detailed Read & Practice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#11131A] border border-[#1E222E] space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Reading Deep Dive</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{day.readFocus}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#11131A] border border-[#1E222E] space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Code className="w-4 h-4" />
                <span>Hands-on Practice Focus</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{day.practiceFocus}</p>
            </div>
          </div>

          {/* Progress summary row */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-400">
              Completed Tasks: <strong className="text-white">{dayProg.completedTasks}</strong> of {day.tasks.length}
            </span>
            <span className="font-mono font-bold text-emerald-400">{dayProg.percentage}% Done</span>
          </div>

          {/* 7 Daily Tasks */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daily Master Tasks
            </h4>

            {day.tasks.map(task => {
              const timeBlock = TIME_BLOCKS.find(b => b.id === task.blockId) || TIME_BLOCKS[0];
              const isDone = isTaskComplete(task.id);
              const typeColor = TASK_TYPE_COLORS[task.type] || '#10B981';
              const typeLabel = TASK_TYPE_LABELS[task.type] || task.type;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition ${
                    isDone
                      ? 'bg-[#11131A]/60 border-[#1E222E] opacity-75'
                      : 'bg-[#11131A] border-[#1E222E]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id, day.day)}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400 transition shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-emerald-400" />
                      )}
                    </button>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span>{timeBlock.emoji}</span>
                        <span className="font-mono text-slate-300 font-semibold">{timeBlock.time}</span>
                        <span
                          className="px-1.5 py-0.2 rounded font-bold uppercase text-[9px]"
                          style={{
                            backgroundColor: `${typeColor}15`,
                            color: typeColor,
                          }}
                        >
                          {typeLabel}
                        </span>
                      </div>
                      <h5
                        className={`text-sm font-semibold cursor-pointer ${
                          isDone ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                        onClick={() => toggleTask(task.id, day.day)}
                      >
                        {task.title}
                      </h5>
                      <p className="text-xs text-slate-400 leading-snug">{task.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      startFocusTimer(25 * 60, task.title, `${timeBlock.emoji} ${timeBlock.title}`);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition shrink-0"
                    title="Focus Timer"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#1E222E] bg-[#0B0D13] flex flex-wrap items-center justify-between gap-3">
          {!isCurrent && (
            <button
              onClick={() => {
                onSetAsCurrent(day.day);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Set as Today's Routine
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {!isAllDone && (
              <button
                onClick={() => completeDay(day.day)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
              >
                <CheckCheck className="w-4 h-4" />
                Complete All 7 Tasks
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
