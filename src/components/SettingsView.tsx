import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  Zap,
  Info,
  Check,
  AlertTriangle,
  Github
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { TIME_BLOCKS, TASK_TYPE_COLORS, TASK_TYPE_LABELS } from '../constants';

export function SettingsView() {
  const {
    settings,
    updateNotifications,
    resetProgress,
    requestNotificationPermission,
    sendTestBrowserNotification,
    triggerTestElectricAlert,
    exportProgressJSON,
    importProgressJSON,
    progress,
  } = useStudy();

  const [copiedNotification, setCopiedNotification] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      updateNotifications({ enabled: granted });
    } else {
      updateNotifications({ enabled: false });
    }
  };

  const handleExport = () => {
    const json = exportProgressJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studytracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importProgressJSON(importText);
    if (success) {
      alert('Progress imported successfully!');
      setImportText('');
      setShowImportBox(false);
    } else {
      alert('Failed to parse progress JSON. Please check formatting.');
    }
  };

  const leadTimeOptions = [5, 10, 15];

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Clock className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            System & Routine
          </span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Settings & Schedule</h2>
        <p className="text-xs text-slate-400">
          Notification preferences, data management, and 10-hour daily master schedule
        </p>
      </div>

      {/* Notifications Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-[#1E222E] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Study Session Reminders</h3>
              <p className="text-xs text-slate-400">
                Receive browser alerts before each study session begins
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.enabled}
              onChange={e => handleToggleNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#181B24] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Lead time buttons */}
        <div className="pt-4 border-t border-[#1E222E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-0.5">
              Reminder Lead Time
            </span>
            <span className="text-xs text-slate-500">
              How many minutes before a block starts to notify you
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#08090D] p-1 rounded-xl border border-[#1E222E]">
            {leadTimeOptions.map(min => {
              const isSelected = settings.notifications.reminderMinutesBefore === min;
              return (
                <button
                  key={min}
                  onClick={() => updateNotifications({ reminderMinutesBefore: min })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {min} min
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Testing Buttons */}
        <div className="pt-4 border-t border-[#1E222E] flex flex-wrap items-center gap-2.5">
          <button
            onClick={sendTestBrowserNotification}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            Test Browser Notification
          </button>

          <button
            onClick={triggerTestElectricAlert}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-bold transition flex items-center gap-2 border border-cyan-500/30"
          >
            <Zap className="w-3.5 h-3.5" />
            Trigger In-App Electric Banner
          </button>
        </div>
      </div>

      {/* Daily 10-Hour Master Rhythm Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-[#1E222E] space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Daily 10-Hour Rhythm Schedule</h3>
          <p className="text-xs text-slate-400">
            Structured daily blocks designed to prevent cognitive fatigue and maximize retention
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E222E] text-slate-500 uppercase tracking-wider font-bold">
                <th className="pb-3 pl-2">Time</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Session</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Rhythm Goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E222E]">
              {TIME_BLOCKS.map(b => {
                const color = TASK_TYPE_COLORS[b.type] || '#10B981';
                return (
                  <tr key={b.id} className="hover:bg-[#181B24]/40 transition">
                    <td className="py-3 pl-2 font-mono font-bold text-slate-200 whitespace-nowrap">
                      <span className="mr-1.5">{b.emoji}</span>
                      {b.time}
                    </td>
                    <td className="py-3 font-mono text-slate-400">{b.duration}</td>
                    <td className="py-3 font-semibold text-white">{b.title}</td>
                    <td className="py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                        }}
                      >
                        {TASK_TYPE_LABELS[b.type]}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{b.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Management (Export, Import, Reset) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-[#1E222E] space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Data Management & Backup</h3>
          <p className="text-xs text-slate-400">
            Your progress is safely stored in your browser's local storage. Export a backup or transfer to another device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export Backup (JSON)
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            Import Backup
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 text-xs font-bold transition border border-red-500/30 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>

        {/* Import JSON Box */}
        {showImportBox && (
          <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E222E] space-y-3">
            <label className="text-xs font-bold text-slate-300 block">
              Paste JSON Progress Payload:
            </label>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder='{"currentDay": 1, "completions": { ... }}'
              rows={4}
              className="w-full bg-[#11131A] border border-[#1E222E] rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
              >
                Restore Progress
              </button>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D0F16] border border-red-500/40 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Reset Study Progress?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will clear all completed tasks, streaks, and reset your active routine back to Day 1. This action cannot be undone unless you have exported a JSON backup.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetProgress();
                    setShowResetConfirm(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About App Footer Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-[#1E222E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-slate-950 font-black">
            ST
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">StudyTracker Web Edition</h4>
            <p className="text-xs text-slate-400">
              Designed for serious backend software engineers & architects
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/shah-ashish/study-tracker-app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
          >
            <Github className="w-4 h-4" /> GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
}
