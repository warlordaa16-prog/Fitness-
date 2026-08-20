import React from 'react';
import { X, CheckCircle2, AlertTriangle, Wind, Target, Dumbbell, Sparkles, Volume2 } from 'lucide-react';
import { ExerciseDetail } from '../types';
import { speakText } from '../utils/soundManager';

interface ExerciseGuideModalProps {
  exercise: ExerciseDetail | null;
  onClose: () => void;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({ exercise, onClose }) => {
  if (!exercise) return null;

  const handleReadAloud = () => {
    const speech = `${exercise.name}. Form tips: ${exercise.formTips.join('. ')}. Breathing: ${exercise.breathingPattern}`;
    speakText(speech);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Instructive Technique Guide</span>
              <h3 className="text-xl font-extrabold text-white">{exercise.name}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReadAloud}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
              title="Listen to Audio Form Coaching"
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Voice Coach</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Target Muscles */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Target className="h-4 w-4 text-orange-400" />
              <span>Target Muscle Groups</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.targetMuscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/20"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* How to Perform (Step by Step) */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Step-by-Step Execution</span>
            </div>
            <ol className="space-y-2.5">
              {exercise.howToPerform.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                  <span className="h-5 w-5 rounded-full bg-slate-800 text-orange-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Form Tips & Posture Checklist */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Key Form Cues & Posture Checks</span>
            </div>
            <ul className="space-y-2">
              {exercise.formTips.map((tip, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-200">
                  <span className="text-emerald-400 text-base leading-none mt-1">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Breathing Pattern Guide */}
          <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 flex items-start space-x-3">
            <Wind className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-0.5">
                Breathing Pattern
              </div>
              <p className="text-sm text-slate-200">{exercise.breathingPattern}</p>
            </div>
          </div>

          {/* Common Mistakes to Avoid */}
          {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Common Mistakes to Avoid</span>
              </div>
              <ul className="space-y-1.5">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-xs text-rose-200 flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 transition"
          >
            Got It, Let's Train
          </button>
        </div>
      </div>
    </div>
  );
};
