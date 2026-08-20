import React, { useState } from 'react';
import { X, Droplet, Dumbbell, Scale, Flame, Utensils } from 'lucide-react';
import { UserStats } from '../types';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onAddPost: (postData: any) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  stats,
  setStats,
  onAddPost
}) => {
  const [logType, setLogType] = useState<'workout' | 'water' | 'weight' | 'meal'>('workout');
  
  // Workout form state
  const [workoutTitle, setWorkoutTitle] = useState('Morning Cardio Session');
  const [workoutCategory, setWorkoutCategory] = useState('Cardio');
  const [duration, setDuration] = useState('35');
  const [calories, setCalories] = useState('320');
  const [notes, setNotes] = useState('Felt energized and hit new cadence target!');

  // Water form state
  const [waterAmount, setWaterAmount] = useState('250');

  // Weight form state
  const [weightValue, setWeightValue] = useState(stats.currentWeightKg.toString());

  // Meal form state
  const [mealName, setMealName] = useState('Protein Smoothie & Avocado Toast');
  const [mealCalories, setMealCalories] = useState('450');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logType === 'workout') {
      const calNum = parseInt(calories) || 300;
      const durNum = parseInt(duration) || 30;
      setStats(prev => ({
        ...prev,
        caloriesBurned: prev.caloriesBurned + calNum,
        activeMinutes: prev.activeMinutes + durNum
      }));
      onAddPost({
        content: `Completed ${workoutTitle} (${notes}). Burned ${calNum} kcal in ${durNum} mins! 💪`,
        workoutType: workoutCategory,
        duration: `${durNum} mins`,
        calories: `${calNum} kcal`,
        image: null
      });
    } else if (logType === 'water') {
      const ml = parseInt(waterAmount) || 250;
      setStats(prev => ({
        ...prev,
        waterIntakeMl: prev.waterIntakeMl + ml
      }));
    } else if (logType === 'weight') {
      const w = parseFloat(weightValue) || stats.currentWeightKg;
      setStats(prev => ({
        ...prev,
        currentWeightKg: w
      }));
    } else if (logType === 'meal') {
      const cal = parseInt(mealCalories) || 400;
      setStats(prev => ({
        ...prev,
        caloriesBurned: prev.caloriesBurned // or track calories consumed if needed
      }));
      onAddPost({
        content: `Logged meal: ${mealName} (${cal} kcal). Fueling the gains! 🥗`,
        workoutType: 'Nutrition',
        duration: '15 mins',
        calories: `${cal} kcal`,
        image: null
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Quick Activity Logger
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Type Selectors */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-slate-950/50 border-b border-slate-800">
          {[
            { id: 'workout', label: 'Workout', icon: Dumbbell },
            { id: 'water', label: 'Water', icon: Droplet },
            { id: 'weight', label: 'Weight', icon: Scale },
            { id: 'meal', label: 'Meal', icon: Utensils }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = logType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLogType(item.id as any)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {logType === 'workout' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Workout Title</label>
                <input
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={workoutCategory}
                    onChange={(e) => setWorkoutCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Core">Core</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Calories Burned (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Share to Feed</label>
                  <div className="flex items-center h-10 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-orange-400">
                    ✨ Automatically shared
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Notes / Reflection</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>
            </>
          )}

          {logType === 'water' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Water Amount (ml)</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['250', '500', '750', '1000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWaterAmount(amt)}
                    className={`py-2 rounded-xl text-sm font-medium border ${
                      waterAmount === amt
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    +{amt}ml
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={waterAmount}
                onChange={(e) => setWaterAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          )}

          {logType === 'weight' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Current Body Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                required
              />
              <p className="text-xs text-slate-400 mt-2">Logging weight daily helps track long-term fat loss and muscle gain trends accurately.</p>
            </div>
          )}

          {logType === 'meal' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Meal Description</label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Estimated Calories (kcal)</label>
                <input
                  type="number"
                  value={mealCalories}
                  onChange={(e) => setMealCalories(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 transition transform hover:scale-105"
            >
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
