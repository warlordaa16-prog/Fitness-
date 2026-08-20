import React, { useState } from 'react';
import { Bell, Plus, Clock, Volume2, Sparkles, Check, Trash2, Play, Flame, RefreshCw, Sun, Moon, Dumbbell, Droplet } from 'lucide-react';
import { FitnessAlarm, WorkoutRoutine, DailyGuidanceMilestone } from '../types';
import { playAlarmSound } from '../utils/soundManager';

interface AlarmsTabProps {
  alarms: FitnessAlarm[];
  setAlarms: React.Dispatch<React.SetStateAction<FitnessAlarm[]>>;
  workouts: WorkoutRoutine[];
  milestones: DailyGuidanceMilestone[];
  setMilestones: React.Dispatch<React.SetStateAction<DailyGuidanceMilestone[]>>;
  onTriggerAlarmNow: (alarm: FitnessAlarm) => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onLogWater: (amount: number) => void;
}

export const AlarmsTab: React.FC<AlarmsTabProps> = ({
  alarms,
  setAlarms,
  workouts,
  milestones,
  setMilestones,
  onTriggerAlarmNow,
  onStartRoutine,
  onLogWater
}) => {
  const [isAddingAlarm, setIsAddingAlarm] = useState(false);
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('07:30');
  const [category, setCategory] = useState<'workout' | 'hydration' | 'stretch' | 'meal' | 'recovery'>('workout');
  const [days, setDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [sound, setSound] = useState<'energetic-chime' | 'gentle-bell' | 'marimba' | 'voice-coach'>('energetic-chime');
  const [instructionTip, setInstructionTip] = useState('');
  const [targetRoutineId, setTargetRoutineId] = useState<string>('');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingAlarmId) {
      setAlarms(prev =>
        prev.map(a =>
          a.id === editingAlarmId
            ? {
                ...a,
                title,
                time,
                category,
                days,
                sound,
                instructionTip: instructionTip || 'Stay consistent and focus on correct form!',
                targetRoutineId: targetRoutineId || undefined
              }
            : a
        )
      );
      setEditingAlarmId(null);
    } else {
      const newAlarm: FitnessAlarm = {
        id: `alarm-${Date.now()}`,
        title,
        time,
        category,
        days: days.length > 0 ? days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        enabled: true,
        sound,
        instructionTip: instructionTip || 'Stay consistent and focus on correct form!',
        targetRoutineId: targetRoutineId || undefined
      };
      setAlarms(prev => [...prev, newAlarm]);
    }

    // Reset Form
    setTitle('');
    setTime('07:30');
    setInstructionTip('');
    setTargetRoutineId('');
    setIsAddingAlarm(false);
  };

  const handleEdit = (alarm: FitnessAlarm) => {
    setEditingAlarmId(alarm.id);
    setTitle(alarm.title);
    setTime(alarm.time);
    setCategory(alarm.category);
    setDays(alarm.days);
    setSound(alarm.sound);
    setInstructionTip(alarm.instructionTip);
    setTargetRoutineId(alarm.targetRoutineId || '');
    setIsAddingAlarm(true);
  };

  const handleAddPreset = (preset: {
    title: string;
    time: string;
    category: any;
    sound: any;
    tip: string;
    routineId?: string;
  }) => {
    const newAlarm: FitnessAlarm = {
      id: `alarm-${Date.now()}`,
      title: preset.title,
      time: preset.time,
      category: preset.category,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      sound: preset.sound,
      instructionTip: preset.tip,
      targetRoutineId: preset.routineId
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const toggleMilestone = (id: string) => {
    setMilestones(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleMilestoneAction = (milestone: DailyGuidanceMilestone) => {
    if (milestone.actionType === 'open-workout' && milestone.actionPayload) {
      const routine = workouts.find(w => w.id === milestone.actionPayload);
      if (routine) onStartRoutine(routine);
    } else if (milestone.actionType === 'log-water') {
      const amt = parseInt(milestone.actionPayload || '500');
      onLogWater(amt);
      toggleMilestone(milestone.id);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
            <Bell className="h-3.5 w-3.5" />
            <span>Interactive Alarm & Guidance Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Fitness Reminders & Alarms
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Configure audible reminder alarms with step-by-step fitness instructions to keep your habits on schedule.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => {
              if (alarms.length > 0) {
                onTriggerAlarmNow(alarms[0]);
              }
            }}
            className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center space-x-2"
            title="Test how alarm ringer works"
          >
            <Volume2 className="h-4 w-4" />
            <span>Test Sound Alarm</span>
          </button>
          <button
            onClick={() => {
              setEditingAlarmId(null);
              setTitle('');
              setTime('07:30');
              setInstructionTip('');
              setTargetRoutineId('');
              setIsAddingAlarm(true);
            }}
            className="flex-1 md:flex-initial bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition transform hover:scale-105 text-sm flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Fitness Alarm</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Alarm Modal / Form */}
      {isAddingAlarm && (
        <div className="bg-slate-900 border border-orange-500/50 rounded-3xl p-6 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-400" />
              <span>{editingAlarmId ? 'Edit Fitness Reminder Alarm' : 'Create New Fitness Reminder Alarm'}</span>
            </h3>
            <button
              onClick={() => setIsAddingAlarm(false)}
              className="text-slate-400 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveAlarm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Alarm Title & Purpose</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Morning HIIT Blast / Hydration"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Alarm Time (24h format)</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="workout">Guided Workout</option>
                  <option value="hydration">Hydration & Water</option>
                  <option value="stretch">Stretch & Posture</option>
                  <option value="meal">Nutrition / Pre-workout</option>
                  <option value="recovery">Recovery & Sleep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Audio Chime Sound</label>
                <div className="flex space-x-2">
                  <select
                    value={sound}
                    onChange={e => setSound(e.target.value as any)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="energetic-chime">Energetic Chime</option>
                    <option value="gentle-bell">Gentle Tibetan Bell</option>
                    <option value="marimba">Warm Marimba</option>
                    <option value="voice-coach">Voice Coach Announcement</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => playAlarmSound(sound)}
                    className="px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700"
                    title="Preview Sound"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Link to Guided Routine</label>
                <select
                  value={targetRoutineId}
                  onChange={e => setTargetRoutineId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="">None (Custom Reminder)</option>
                  {workouts.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.durationMins}m)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recurrence Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Repeat On Days</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => {
                  const isSelected = days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructive Coaching Tip */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Instructive Guidance Tip (Read aloud or displayed when alarm fires)
              </label>
              <textarea
                value={instructionTip}
                onChange={e => setInstructionTip(e.target.value)}
                placeholder="e.g., Time for your cardio routine! Drink 250ml water and start with 3 minutes of joint rotations."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddingAlarm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 transition"
              >
                {editingAlarmId ? 'Update Alarm' : 'Save Fitness Alarm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preset Alarms Quick-Add Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Preset Fitness Alarms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: '🌅 Morning Mobility & Water',
              time: '07:00',
              category: 'morning',
              sound: 'gentle-bell',
              tip: 'Drink 500ml of water and do 5 gentle spinal flexes to jumpstart metabolism.',
              routineId: 'w-4'
            },
            {
              title: '🧘 Midday Posture Reset',
              time: '12:30',
              category: 'stretch',
              sound: 'marimba',
              tip: 'Stand up, roll shoulders 10 times, and open chest against a doorway.',
              routineId: 'w-3'
            },
            {
              title: '🔥 Afternoon HIIT Session',
              time: '17:30',
              category: 'workout',
              sound: 'energetic-chime',
              tip: 'Lace up your trainers, fill your water bottle, and start warmups.',
              routineId: 'w-1'
            },
            {
              title: '🌙 Wind-down & Recovery',
              time: '21:30',
              category: 'recovery',
              sound: 'voice-coach',
              tip: 'Turn off screens, dim lights, and do 3 minutes of deep box breathing.',
              routineId: 'w-4'
            }
          ].map((preset, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold text-orange-400">{preset.time}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    Preset
                  </span>
                </div>
                <div className="text-sm font-bold text-white mb-1">{preset.title}</div>
                <p className="text-xs text-slate-400 line-clamp-2">{preset.tip}</p>
              </div>
              <button
                onClick={() => handleAddPreset(preset)}
                className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold border border-slate-700 hover:border-orange-500/30 transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Preset</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alarms List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Configured Alarms ({alarms.length})
        </h3>

        {alarms.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <Bell className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium">No alarms configured yet.</p>
            <p className="text-xs text-slate-500 mt-1">Add your first reminder alarm to start receiving instructive alerts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alarms.map(alarm => {
              const linkedRoutine = alarm.targetRoutineId
                ? workouts.find(w => w.id === alarm.targetRoutineId)
                : null;

              return (
                <div
                  key={alarm.id}
                  className={`border rounded-3xl p-5 transition-all shadow-xl flex flex-col justify-between ${
                    alarm.enabled
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div>
                    {/* Top Row: Time & Toggle Switch */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                          {alarm.time}
                        </span>
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-semibold border border-slate-700">
                          <Volume2 className="h-3.5 w-3.5" />
                          <span className="capitalize">{alarm.sound.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {/* Custom Toggle switch */}
                      <button
                        onClick={() => handleToggleAlarm(alarm.id)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                          alarm.enabled ? 'bg-orange-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition" />
                      </button>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-white">{alarm.title}</h4>

                    {/* Days badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {weekDays.map(d => {
                        const active = alarm.days.includes(d);
                        return (
                          <span
                            key={d}
                            className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold ${
                              active
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {d}
                          </span>
                        );
                      })}
                    </div>

                    {/* Instructive Tip */}
                    <div className="mt-3.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-amber-400">Coaching Note: </span>
                      {alarm.instructionTip}
                    </div>

                    {/* Linked Routine preview if any */}
                    {linkedRoutine && (
                      <div className="mt-3 flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-800">
                        <Dumbbell className="h-3.5 w-3.5 text-orange-400" />
                        <span>Launches: </span>
                        <strong className="text-slate-200">{linkedRoutine.title}</strong>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                    <button
                      onClick={() => onTriggerAlarmNow(alarm)}
                      className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center space-x-1.5 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20 transition"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Trigger Alarm Now</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(alarm)}
                        className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAlarm(alarm.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                        title="Delete Alarm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Instructive Guidance Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Today's Guided Milestones & Form Schedule</span>
            </h3>
            <p className="text-xs text-slate-400">Step-by-step physical benchmarks throughout the day</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-orange-400 border border-slate-700">
            {milestones.filter(m => m.completed).length} / {milestones.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                milestone.completed
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`h-6 w-6 rounded-lg flex items-center justify-center mt-0.5 transition ${
                    milestone.completed
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 border border-slate-700 text-transparent hover:border-orange-500'
                  }`}
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-orange-400">{milestone.time}</span>
                    <span className={`text-sm font-bold ${milestone.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {milestone.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{milestone.instructions}</p>
                </div>
              </div>

              {!milestone.completed && (
                <button
                  onClick={() => handleMilestoneAction(milestone)}
                  className="shrink-0 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
                >
                  {milestone.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
