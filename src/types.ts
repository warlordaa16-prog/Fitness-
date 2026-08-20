export interface UserGoals {
  dailySteps: number;
  dailyCalories: number;
  activeMinutes: number;
  waterMl: number;
  weightTargetKg: number;
}

export interface UserStats {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  waterIntakeMl: number;
  currentWeightKg: number;
  streakDays: number;
}

export interface ExerciseDetail {
  name: string;
  sets?: number;
  reps?: number;
  durationSec?: number;
  targetMuscles: string[];
  howToPerform: string[];
  formTips: string[];
  breathingPattern: string;
  commonMistakes: string[];
  visualCue?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: 'HIIT' | 'Strength' | 'Cardio' | 'Yoga' | 'Core';
  durationMins: number;
  estimatedCalories: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  image: string;
  description: string;
  warmupMins?: number;
  cooldownMins?: number;
  exercises: ExerciseDetail[];
}

export interface FitnessAlarm {
  id: string;
  title: string;
  time: string; // e.g. "07:30" (24-hr format HH:MM)
  category: 'workout' | 'hydration' | 'stretch' | 'meal' | 'recovery';
  days: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  enabled: boolean;
  sound: 'energetic-chime' | 'gentle-bell' | 'marimba' | 'voice-coach';
  instructionTip: string;
  targetRoutineId?: string;
  lastTriggered?: string;
}

export interface DailyGuidanceMilestone {
  id: string;
  time: string;
  title: string;
  category: 'morning' | 'stretch' | 'workout' | 'recovery';
  instructions: string;
  actionLabel: string;
  actionType: 'open-workout' | 'log-water' | 'stretch-guide' | 'ai-tip';
  actionPayload?: string;
  completed: boolean;
}

export interface SocialComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface SocialPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  workoutType: string;
  duration: string;
  calories: string;
  likes: number;
  comments: SocialComment[];
  image: string | null;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  weeklySteps: number;
  streak: number;
  badge: string;
}

export interface DailyTrend {
  day: string;
  calories: number;
  steps: number;
  activeMins: number;
}
