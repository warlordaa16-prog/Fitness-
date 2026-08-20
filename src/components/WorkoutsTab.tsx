import React, { useState, useEffect, useRef } from 'react';
import {
  Dumbbell,
  Play,
  Timer,
  Flame,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Volume2,
  VolumeX,
  Wind,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Target,
  Coffee,
  AlertCircle
} from 'lucide-react';
import { WorkoutRoutine, ExerciseDetail } from '../types';
import { ExerciseGuideModal } from './ExerciseGuideModal';
import { speakText, playCountdownBeep, playRestCompleteSound } from '../utils/soundManager';

interface WorkoutsTabProps {
  workouts: WorkoutRoutine[];
  onStartWorkout: (workout: WorkoutRoutine) => void;
  activeWorkout: WorkoutRoutine | null;
  onFinishWorkout: (workout: WorkoutRoutine, durationSec: number) => void;
  onCancelWorkout: () => void;
}

export const WorkoutsTab: React.FC<WorkoutsTabProps> = ({
  workouts,
  onStartWorkout,
  activeWorkout,
  onFinishWorkout,
  onCancelWorkout
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingGuideExercise, setViewingGuideExercise] = useState<ExerciseDetail | null>(null);

  // Live workout timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);
  const [activePlayerTab, setActivePlayerTab] = useState<'instructions' | 'breathing' | 'muscles'>('instructions');

  // Rest Interval State
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(30);

  // Interval timer ref for countdown beeps
  const prevRestSeconds = useRef(30);

  // Main workout elapsed timer
  useEffect(() => {
    let timer: any;
    if (activeWorkout && !isPaused && !isResting) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeWorkout, isPaused, isResting]);

  // Rest interval countdown timer
  useEffect(() => {
    let restTimer: any;
    if (isResting && !isPaused) {
      restTimer = setInterval(() => {
        setRestSecondsLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            playRestCompleteSound();
            if (voiceCoachEnabled && activeWorkout) {
              const nextEx = activeWorkout.exercises[exerciseIndex];
              if (nextEx) {
                speakText(`Rest over! Starting ${nextEx.name}. Focus on posture!`);
              }
            }
            return 30;
          }
          if (prev <= 4 && prev > 1) {
            playCountdownBeep(false);
          } else if (prev === 1) {
            playCountdownBeep(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restTimer);
  }, [isResting, isPaused, exerciseIndex, activeWorkout, voiceCoachEnabled]);

  // Reset elapsed timer when a new workout starts
  useEffect(() => {
    if (activeWorkout) {
      setElapsedSeconds(0);
      setExerciseIndex(0);
      setIsPaused(false);
      setIsResting(false);
      const firstEx = activeWorkout.exercises[0];
      if (firstEx && voiceCoachEnabled) {
        speakText(`Starting ${activeWorkout.title}. First exercise is ${firstEx.name}. ${firstEx.formTips[0] || ''}`);
      }
    }
  }, [activeWorkout]);

  const categories = ['All', 'HIIT', 'Strength', 'Cardio', 'Yoga', 'Core'];

  const filteredWorkouts = workouts.filter(w => {
    const matchesCat = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesQuery =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextExercise = () => {
    if (!activeWorkout) return;
    const nextIdx = exerciseIndex + 1;
    if (nextIdx < activeWorkout.exercises.length) {
      // Trigger a 30s instructive rest interval
      setIsResting(true);
      setRestSecondsLeft(30);
      setExerciseIndex(nextIdx);
      if (voiceCoachEnabled) {
        speakText(`Great job. 30 seconds rest. Take deep breaths and grab a sip of water.`);
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    playRestCompleteSound();
    if (activeWorkout && voiceCoachEnabled) {
      const nextEx = activeWorkout.exercises[exerciseIndex];
      if (nextEx) {
        speakText(`Starting ${nextEx.name}. ${nextEx.formTips[0] || ''}`);
      }
    }
  };

  // If user is in Live Workout mode
  if (activeWorkout) {
    const currentEx = activeWorkout.exercises[exerciseIndex] || activeWorkout.exercises[0];
    const progressPercent = Math.round(((exerciseIndex + (isResting ? 0.5 : 1)) / activeWorkout.exercises.length) * 100);

    return (
      <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
        {/* Active Workout Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <button
              onClick={onCancelWorkout}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Exit Session</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setVoiceCoachEnabled(!voiceCoachEnabled)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  voiceCoachEnabled
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Toggle Voice Coach Audio Instructions"
              >
                {voiceCoachEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                <span>Voice Coach {voiceCoachEnabled ? 'ON' : 'OFF'}</span>
              </button>
              <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full">
                <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-400">Instructive Mode</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Routine Status */}
            <div className="space-y-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-500 text-white">
                {activeWorkout.category} Routine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{activeWorkout.title}</h2>
              <p className="text-slate-400 text-sm">{activeWorkout.description}</p>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Instructor: <strong className="text-slate-200">{activeWorkout.instructor}</strong></span>
                  <span>Target: <strong className="text-orange-400">~{activeWorkout.estimatedCalories} kcal</strong></span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-white">
                  <span>Progress</span>
                  <span className="text-orange-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  Exercise {exerciseIndex + 1} of {activeWorkout.exercises.length}
                </div>
              </div>
            </div>

            {/* Center Column: Timer Stopwatch & Rest Interval */}
            <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-inner">
              {isResting ? (
                <div className="text-center space-y-3 w-full animate-fadeIn">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                    <Coffee className="h-3.5 w-3.5" />
                    <span>Guided Rest & Hydration</span>
                  </div>
                  <div className="text-6xl font-mono font-black text-blue-400 tracking-wider">
                    {restSecondsLeft}s
                  </div>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Take deep diaphragmatic breaths through your nose. Sip water and prepare for <strong>{currentEx.name}</strong>.
                  </p>
                  <button
                    onClick={handleSkipRest}
                    className="mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Skip Rest & Begin Exercise
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3 w-full">
                  <div className="text-xs font-medium text-orange-400 uppercase tracking-widest flex items-center justify-center space-x-1.5">
                    <Timer className="h-4 w-4 animate-spin" />
                    <span>Active Session Elapsed</span>
                  </div>
                  <div className="text-5xl sm:text-6xl font-mono font-black text-white tracking-wider">
                    {formatTime(elapsedSeconds)}
                  </div>

                  <div className="flex justify-center space-x-3 mt-4">
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition ${
                        isPaused
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                    >
                      {isPaused ? 'Resume Session' : 'Pause'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Active Exercise & Form Control */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Current Movement
                </span>
                <button
                  onClick={() => setViewingGuideExercise(currentEx)}
                  className="text-xs text-slate-400 hover:text-orange-400 flex items-center space-x-1 transition"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Full Guide</span>
                </button>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">{currentEx.name}</h3>
                <div className="mt-2 text-xs font-semibold text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                  <span>Target: {currentEx.durationSec ? `${currentEx.durationSec}s hold` : `${currentEx.sets || 3} sets × ${currentEx.reps || 12} reps`}</span>
                  <span className="text-orange-400">{currentEx.targetMuscles[0]}</span>
                </div>
              </div>

              {/* Player Tabs: Instructions vs Breathing vs Muscles */}
              <div className="flex border-b border-slate-800 text-xs">
                <button
                  onClick={() => setActivePlayerTab('instructions')}
                  className={`pb-2 px-3 font-semibold transition ${
                    activePlayerTab === 'instructions'
                      ? 'text-orange-400 border-b-2 border-orange-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Form Cues
                </button>
                <button
                  onClick={() => setActivePlayerTab('breathing')}
                  className={`pb-2 px-3 font-semibold transition ${
                    activePlayerTab === 'breathing'
                      ? 'text-orange-400 border-b-2 border-orange-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Breathing Pacer
                </button>
                <button
                  onClick={() => setActivePlayerTab('muscles')}
                  className={`pb-2 px-3 font-semibold transition ${
                    activePlayerTab === 'muscles'
                      ? 'text-orange-400 border-b-2 border-orange-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Target Muscles
                </button>
              </div>

              {/* Tab Contents */}
              {activePlayerTab === 'instructions' && (
                <div className="space-y-2 text-xs text-slate-300 max-h-36 overflow-y-auto pr-1">
                  {currentEx.formTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}

              {activePlayerTab === 'breathing' && (
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-2 text-center">
                  <div className="flex items-center justify-center space-x-2 text-blue-400 text-xs font-bold">
                    <Wind className="h-4 w-4 animate-pulse" />
                    <span>Breathing Rhythm</span>
                  </div>
                  <p className="text-xs text-slate-200">{currentEx.breathingPattern}</p>
                </div>
              )}

              {activePlayerTab === 'muscles' && (
                <div className="flex flex-wrap gap-1.5">
                  {currentEx.targetMuscles.map((muscle, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/20"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              )}

              {/* Next / Finish Action */}
              <div className="pt-2">
                {exerciseIndex < activeWorkout.exercises.length - 1 ? (
                  <button
                    onClick={handleNextExercise}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/25 transition"
                  >
                    Next Exercise & Rest ➔
                  </button>
                ) : (
                  <button
                    onClick={() => onFinishWorkout(activeWorkout, elapsedSeconds)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Finish & Log Routine</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructive Exercise Technique Guide Modal */}
        <ExerciseGuideModal
          exercise={viewingGuideExercise}
          onClose={() => setViewingGuideExercise(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Instructive Guided Routines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Workout Library</h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose a guided routine with audio coaching, posture cues, and breathing synchronization.
          </p>
        </div>
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search workouts or exercises..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map(workout => (
          <div
            key={workout.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                <img
                  src={workout.image}
                  alt={workout.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 z-20 text-xs font-semibold px-3 py-1 rounded-full bg-orange-500 text-white shadow">
                  {workout.category}
                </span>
                <span className="absolute top-4 right-4 z-20 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-950/80 text-slate-300 border border-slate-700">
                  {workout.difficulty}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white">{workout.title}</h3>
                <p className="text-slate-400 text-xs mt-2 line-clamp-2">{workout.description}</p>

                <div className="flex items-center space-x-4 mt-4 text-xs text-slate-300 font-medium">
                  <div className="flex items-center space-x-1">
                    <Timer className="h-4 w-4 text-orange-400" />
                    <span>{workout.durationMins} mins</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-red-400" />
                    <span>~{workout.estimatedCalories} kcal</span>
                  </div>
                </div>

                {/* Exercise Breakdown Preview */}
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Routine Breakdown ({workout.exercises.length} movements):
                  </div>
                  <div className="space-y-1">
                    {workout.exercises.slice(0, 3).map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                        <span className="truncate pr-2">• {ex.name}</span>
                        <button
                          onClick={() => setViewingGuideExercise(ex)}
                          className="text-[11px] text-orange-400 hover:underline shrink-0 font-medium"
                        >
                          Form Guide
                        </button>
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-[11px] text-slate-500 italic">
                        + {workout.exercises.length - 3} more exercises with full instruction
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onStartWorkout(workout)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Start Guided Workout</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Technique Guide Modal */}
      <ExerciseGuideModal
        exercise={viewingGuideExercise}
        onClose={() => setViewingGuideExercise(null)}
      />
    </div>
  );
};
