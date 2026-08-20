import React, { useEffect } from 'react';
import { Bell, Flame, Play, Clock, CheckCircle, Volume2, VolumeX, X, Sparkles } from 'lucide-react';
import { FitnessAlarm, WorkoutRoutine } from '../types';
import { startAlarmRinger, stopAlarmRinger } from '../utils/soundManager';

interface AlarmTriggerModalProps {
  alarm: FitnessAlarm | null;
  workouts: WorkoutRoutine[];
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
}

export const AlarmTriggerModal: React.FC<AlarmTriggerModalProps> = ({
  alarm,
  workouts,
  onDismiss,
  onSnooze,
  onStartRoutine
}) => {
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    if (alarm) {
      if (!isMuted) {
        startAlarmRinger(alarm.sound, alarm.instructionTip);
      }
    }
    return () => {
      stopAlarmRinger();
    };
  }, [alarm, isMuted]);

  if (!alarm) return null;

  const linkedRoutine = alarm.targetRoutineId
    ? workouts.find(w => w.id === alarm.targetRoutineId)
    : null;

  const handleStartWorkout = () => {
    stopAlarmRinger();
    if (linkedRoutine) {
      onStartRoutine(linkedRoutine);
    }
    onDismiss();
  };

  const handleDismiss = () => {
    stopAlarmRinger();
    onDismiss();
  };

  const handleSnooze = () => {
    stopAlarmRinger();
    onSnooze(5);
  };

  const toggleMute = () => {
    if (isMuted) {
      startAlarmRinger(alarm.sound);
      setIsMuted(false);
    } else {
      stopAlarmRinger();
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-orange-500/80 rounded-3xl w-full max-w-lg shadow-2xl shadow-orange-500/20 overflow-hidden text-white relative">
        {/* Glow Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-bounce">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold opacity-90">Fitness Reminder Alarm</span>
              <h3 className="text-lg font-extrabold">{alarm.title}</h3>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 animate-pulse" />}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Time & Alert status */}
          <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium">Scheduled Time</div>
              <div className="text-3xl font-black font-mono text-orange-400 mt-0.5">{alarm.time}</div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
                <Flame className="h-3.5 w-3.5" />
                <span>Active Reminder</span>
              </span>
            </div>
          </div>

          {/* Instructive Tip Card */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Instructive Guidance & Next Action</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              "{alarm.instructionTip}"
            </p>
          </div>

          {/* Linked Guided Workout if available */}
          {linkedRoutine && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={linkedRoutine.image}
                  alt={linkedRoutine.title}
                  className="h-12 w-12 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs text-orange-400 font-semibold">{linkedRoutine.category} Routine</div>
                  <div className="text-sm font-bold text-white">{linkedRoutine.title}</div>
                  <div className="text-[11px] text-slate-400">{linkedRoutine.durationMins} mins • {linkedRoutine.estimatedCalories} kcal</div>
                </div>
              </div>
              <button
                onClick={handleStartWorkout}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 flex items-center space-x-1.5 transition transform hover:scale-105"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Start Now</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSnooze}
              className="py-3 px-4 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center space-x-2"
            >
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Snooze (5 Mins)</span>
            </button>
            <button
              onClick={handleDismiss}
              className="py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark Completed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
