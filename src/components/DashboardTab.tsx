import React from 'react';
import {
  Flame,
  Footprints,
  Zap,
  Droplet,
  Scale,
  Trophy,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Dumbbell,
  Bell,
  Volume2,
  Clock,
  Check,
  CheckCircle
} from 'lucide-react';
import { UserStats, UserGoals, WorkoutRoutine, FitnessAlarm, DailyGuidanceMilestone } from '../types';
import { speakText } from '../utils/soundManager';

interface DashboardTabProps {
  stats: UserStats;
  goals: UserGoals;
  workouts: WorkoutRoutine[];
  alarms: FitnessAlarm[];
  milestones: DailyGuidanceMilestone[];
  setMilestones: React.Dispatch<React.SetStateAction<DailyGuidanceMilestone[]>>;
  onOpenQuickLog: () => void;
  onStartWorkout: (workout: WorkoutRoutine) => void;
  setActiveTab: (tab: string) => void;
  onTriggerAlarmNow: (alarm: FitnessAlarm) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  stats,
  goals,
  workouts,
  alarms,
  milestones,
  setMilestones,
  onOpenQuickLog,
  onStartWorkout,
  setActiveTab,
  onTriggerAlarmNow
}) => {
  const stepsPercent = Math.min(100, Math.round((stats.steps / goals.dailySteps) * 100));
  const caloriesPercent = Math.min(100, Math.round((stats.caloriesBurned / goals.dailyCalories) * 100));
  const activeMinsPercent = Math.min(100, Math.round((stats.activeMinutes / goals.activeMinutes) * 100));
  const waterPercent = Math.min(100, Math.round((stats.waterIntakeMl / goals.waterMl) * 100));

  // Find next upcoming active alarm
  const nextAlarm = alarms.find(a => a.enabled) || alarms[0];

  const handleSpeakFormTip = () => {
    speakText(
      'Form Tip: During squats and lunges, ensure your knees track in line with your second toe and your chest stays proud.'
    );
  };

  const toggleMilestone = (id: string) => {
    setMilestones(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-400 via-amber-500 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instructive Guided Fitness Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, Alex! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              You're on a <span className="text-orange-400 font-semibold">{stats.streakDays}-day streak</span>! Your fitness alarms and daily guidance are primed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('alarms')}
              className="bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl transition text-sm flex items-center justify-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>Manage Alarms</span>
            </button>
            <button
              onClick={onOpenQuickLog}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition transform hover:scale-105 text-sm flex items-center justify-center space-x-2"
            >
              <Flame className="h-4 w-4" />
              <span>Log Workout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instructive Reminder Alarm Callout Banner */}
      {nextAlarm && (
        <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Bell className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                  Next Scheduled Reminder
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">
                  {nextAlarm.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{nextAlarm.title}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                "{nextAlarm.instructionTip}"
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => onTriggerAlarmNow(nextAlarm)}
              className="flex-1 md:flex-initial bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition flex items-center justify-center space-x-1.5"
            >
              <Volume2 className="h-4 w-4" />
              <span>Test Alarm Tone</span>
            </button>
            <button
              onClick={() => setActiveTab('alarms')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-700 transition"
            >
              Configure
            </button>
          </div>
        </div>
      )}

      {/* Daily Progress Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Today's Metrics</span>
            <span className="text-xs font-normal text-slate-400">(Real-time updates)</span>
          </h2>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1"
          >
            <span>View Analytics</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Steps Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Footprints className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {stepsPercent}%
              </span>
            </div>
            <div className="text-slate-400 text-xs font-medium">Daily Steps</div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats.steps.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {goals.dailySteps.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stepsPercent}%` }}
              />
            </div>
          </div>

          {/* Calories Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <Flame className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {caloriesPercent}%
              </span>
            </div>
            <div className="text-slate-400 text-xs font-medium">Calories Burned</div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats.caloriesBurned} <span className="text-xs font-normal text-slate-500">/ {goals.dailyCalories} kcal</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${caloriesPercent}%` }}
              />
            </div>
          </div>

          {/* Active Minutes Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {activeMinsPercent}%
              </span>
            </div>
            <div className="text-slate-400 text-xs font-medium">Active Minutes</div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats.activeMinutes} <span className="text-xs font-normal text-slate-500">/ {goals.activeMinutes} mins</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${activeMinsPercent}%` }}
              />
            </div>
          </div>

          {/* Water Intake Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Droplet className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {waterPercent}%
              </span>
            </div>
            <div className="text-slate-400 text-xs font-medium">Water Intake</div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats.waterIntakeMl} <span className="text-xs font-normal text-slate-500">/ {goals.waterMl} ml</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column: Recommended Workout & Instructive Guided Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Workout */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Dumbbell className="h-5 w-5 text-orange-400" />
              <span>Recommended Guided Routine</span>
            </h3>
            <button
              onClick={() => setActiveTab('workouts')}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1"
            >
              <span>Explore All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {workouts.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
              <img
                src={workouts[0].image}
                alt={workouts[0].title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500 text-white">
                      {workouts[0].category}
                    </span>
                    <span className="text-xs font-medium text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
                      {workouts[0].durationMins} mins • {workouts[0].estimatedCalories} kcal
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">{workouts[0].title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-1">{workouts[0].description}</p>
                </div>
                <button
                  onClick={() => onStartWorkout(workouts[0])}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/30 flex items-center space-x-2 transition transform hover:scale-105 shrink-0"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start Guided Routine</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guided Daily Checklist & Form Cues */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Today's Milestones</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {milestones.filter(m => m.completed).length}/{milestones.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {milestones.slice(0, 3).map(m => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    m.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] ${
                        m.completed
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'border border-slate-700 bg-slate-800 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {m.title}
                      </div>
                      <div className="text-[10px] text-orange-400 font-mono">{m.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Tip of the Day */}
            <div className="mt-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Form Tip of the Day</span>
                </span>
                <button
                  onClick={handleSpeakFormTip}
                  className="text-amber-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                  title="Listen to Form Tip"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                During squats and lunges, ensure your knees track directly over your middle toes to prevent valgus collapse and protect your meniscus.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai-coach')}
            className="w-full mt-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-3 rounded-xl border border-slate-700/80 transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span>Consult AI Form & Nutrition Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
