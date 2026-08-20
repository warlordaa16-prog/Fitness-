import React from 'react';
import { Flame, Plus, Bell } from 'lucide-react';
import { UserStats, FitnessAlarm } from '../types';

interface NavbarProps {
  stats: UserStats;
  alarms: FitnessAlarm[];
  onOpenQuickLog: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ stats, alarms, onOpenQuickLog, activeTab, setActiveTab }) => {
  const activeAlarmsCount = alarms.filter(a => a.enabled).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Flame className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-400 bg-clip-text text-transparent">
              FitPulse
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 border border-orange-500/20">
              Pro Active
            </span>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/60">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'alarms', label: 'Alarms & Reminders', badge: activeAlarmsCount },
            { id: 'workouts', label: 'Workouts' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'community', label: 'Community' },
            { id: 'ai-coach', label: 'AI Coach' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white text-orange-600'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions: Streak & Quick Log */}
        <div className="flex items-center space-x-3">
          {/* Quick Alarms bell toggle button for mobile/compact */}
          <button
            onClick={() => setActiveTab('alarms')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-orange-400 border border-slate-700 transition relative"
            title="Fitness Reminder Alarms"
          >
            <Bell className="h-4 w-4" />
            {activeAlarmsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-slate-900">
                {activeAlarmsCount}
              </span>
            )}
          </button>

          {/* Streak Badge */}
          <div className="flex items-center space-x-1.5 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-full">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs sm:text-sm font-bold text-orange-400">{stats.streakDays}d Streak</span>
          </div>

          {/* Quick Log Button */}
          <button
            onClick={onOpenQuickLog}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium shadow-md shadow-orange-500/25 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Log</span>
          </button>
        </div>
      </div>
    </header>
  );
};
