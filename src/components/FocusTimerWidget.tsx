import React from 'react';
import { Play, Pause, RotateCcw, X, Clock } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export function FocusTimerWidget() {
  const { focusTimer, pauseFocusTimer, resumeFocusTimer, resetFocusTimer, startFocusTimer } = useStudy();

  const minutes = Math.floor(focusTimer.timeLeftSeconds / 60);
  const seconds = focusTimer.timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((focusTimer.initialSeconds - focusTimer.timeLeftSeconds) / focusTimer.initialSeconds) * 100;

  return (
    <div className="rounded-2xl bg-[#11131A] border border-[#1E222E] p-4 relative overflow-hidden">
      {/* Background progress fill */}
      <div
        className="absolute bottom-0 left-0 top-0 bg-emerald-500/5 transition-all duration-1000 ease-linear pointer-events-none"
        style={{ width: `${progressPercent}%` }}
      />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className={`w-5 h-5 ${focusTimer.isActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Focus Mode
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 line-clamp-1">{focusTimer.blockTitle}</span>
            </div>
            <p className="text-sm font-medium text-slate-200 line-clamp-1 max-w-sm">
              {focusTimer.taskTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-3xl font-mono font-bold tracking-tight text-white">
            {formattedTime}
          </div>

          <div className="flex items-center gap-1.5">
            {focusTimer.isActive ? (
              <button
                onClick={pauseFocusTimer}
                className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition border border-amber-500/30"
                title="Pause Timer"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={resumeFocusTimer}
                className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                title="Start Timer"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              onClick={resetFocusTimer}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Quick Presets */}
            <div className="hidden sm:flex items-center gap-1 ml-2 border-l border-slate-800 pl-2">
              <button
                onClick={() => startFocusTimer(25 * 60, focusTimer.taskTitle, focusTimer.blockTitle)}
                className="px-2 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono"
              >
                25m
              </button>
              <button
                onClick={() => startFocusTimer(50 * 60, focusTimer.taskTitle, focusTimer.blockTitle)}
                className="px-2 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono"
              >
                50m
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
