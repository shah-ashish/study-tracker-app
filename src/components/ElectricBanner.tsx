import React from 'react';
import { Zap, X, ArrowRight, Clock } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

interface ElectricBannerProps {
  onNavigateToToday: () => void;
}

export function ElectricBanner({ onNavigateToToday }: ElectricBannerProps) {
  const { inAppAlert, dismissElectricAlert } = useStudy();

  if (!inAppAlert) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-xl animate-bounce-subtle">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-cyan-950/90 border-2 border-emerald-400/60 p-4 shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-xl">
        {/* Glow ambient background */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
              <Zap className="w-6 h-6 animate-pulse" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {inAppAlert.title}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {inAppAlert.time} ({inAppAlert.duration})
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">
                Day {inAppAlert.dayNumber}: {inAppAlert.taskTitle}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onNavigateToToday();
                dismissElectricAlert();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md hover:shadow-emerald-500/25"
            >
              Start <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={dismissElectricAlert}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
