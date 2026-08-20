import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { NavigationTabs } from './components/NavigationTabs';
import { DashboardTab } from './components/DashboardTab';
import { WorkoutsTab } from './components/WorkoutsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { CommunityTab } from './components/CommunityTab';
import { AICoachTab } from './components/AICoachTab';
import { AlarmsTab } from './components/AlarmsTab';
import { QuickLogModal } from './components/QuickLogModal';
import { AlarmTriggerModal } from './components/AlarmTriggerModal';
import { INITIAL_WORKOUTS, INITIAL_ALARMS, DAILY_GUIDANCE_MILESTONES } from './data/mockData';
import { UserStats, UserGoals, WorkoutRoutine, SocialPost, FitnessAlarm, DailyGuidanceMilestone } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutine | null>(null);

  // Alarms & Guidance state
  const [alarms, setAlarms] = useState<FitnessAlarm[]>(INITIAL_ALARMS);
  const [milestones, setMilestones] = useState<DailyGuidanceMilestone[]>(DAILY_GUIDANCE_MILESTONES);
  const [triggeredAlarm, setTriggeredAlarm] = useState<FitnessAlarm | null>(null);
  const lastCheckedMinute = useRef<string>('');

  // User Stats state
  const [stats, setStats] = useState<UserStats>({
    steps: 8450,
    caloriesBurned: 540,
    activeMinutes: 62,
    waterIntakeMl: 2250,
    currentWeightKg: 76.4,
    streakDays: 6
  });

  // User Goals state
  const [goals] = useState<UserGoals>({
    dailySteps: 10000,
    dailyCalories: 600,
    activeMinutes: 60,
    waterMl: 3000,
    weightTargetKg: 74.0
  });

  const [workouts] = useState<WorkoutRoutine[]>(INITIAL_WORKOUTS);
  const [posts, setPosts] = useState<SocialPost[]>([]);

  // Fetch initial social posts from Express API
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to load posts', err));
  }, []);

  // Background Clock Ticker to check for scheduled alarms
  useEffect(() => {
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const checkAlarms = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${mins}`;
      const currentDay = daysMap[now.getDay()];

      // Only check once per distinct minute
      if (lastCheckedMinute.current === currentTime) return;
      lastCheckedMinute.current = currentTime;

      // Find any enabled alarm matching current time & today's day of week
      const matched = alarms.find(
        alarm =>
          alarm.enabled &&
          alarm.time === currentTime &&
          alarm.days.includes(currentDay)
      );

      if (matched && !triggeredAlarm) {
        setTriggeredAlarm(matched);
      }
    };

    const interval = setInterval(checkAlarms, 5000);
    return () => clearInterval(interval);
  }, [alarms, triggeredAlarm]);

  const handleAddPost = async (postData: {
    content: string;
    workoutType: string;
    duration: string;
    calories: string;
    image: string | null;
  }) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      const newPost = await res.json();
      setPosts(prev => [newPost, ...prev]);
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const updated = await res.json();
      setPosts(prev => prev.map(p => (p.id === postId ? updated : p)));
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'You (Alex)', text })
      });
      const updated = await res.json();
      setPosts(prev => prev.map(p => (p.id === postId ? updated : p)));
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleStartWorkout = (workout: WorkoutRoutine) => {
    setActiveWorkout(workout);
    setActiveTab('workouts');
  };

  const handleFinishWorkout = (workout: WorkoutRoutine, durationSec: number) => {
    const durMins = Math.max(1, Math.round(durationSec / 60));
    setStats(prev => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + workout.estimatedCalories,
      activeMinutes: prev.activeMinutes + durMins
    }));

    handleAddPost({
      content: `Completed guided workout: ${workout.title}! Burned ${workout.estimatedCalories} kcal in ${durMins} mins with audio coaching. 💪🔥`,
      workoutType: workout.category,
      duration: `${durMins} mins`,
      calories: `${workout.estimatedCalories} kcal`,
      image: workout.image
    });

    setActiveWorkout(null);
    setActiveTab('community');
  };

  const handleTriggerAlarmNow = (alarm: FitnessAlarm) => {
    setTriggeredAlarm(alarm);
  };

  const handleSnoozeAlarm = (minutes: number) => {
    if (!triggeredAlarm) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeHours = String(now.getHours()).padStart(2, '0');
    const snoozeMins = String(now.getMinutes()).padStart(2, '0');
    const snoozedTime = `${snoozeHours}:${snoozeMins}`;

    const snoozedAlarm: FitnessAlarm = {
      ...triggeredAlarm,
      id: `snooze-${Date.now()}`,
      title: `[Snoozed] ${triggeredAlarm.title}`,
      time: snoozedTime,
      enabled: true
    };

    setAlarms(prev => [...prev, snoozedAlarm]);
    setTriggeredAlarm(null);
  };

  const handleLogWater = (amountMl: number) => {
    setStats(prev => ({
      ...prev,
      waterIntakeMl: prev.waterIntakeMl + amountMl
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        stats={stats}
        alarms={alarms}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            stats={stats}
            goals={goals}
            workouts={workouts}
            alarms={alarms}
            milestones={milestones}
            setMilestones={setMilestones}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            onStartWorkout={handleStartWorkout}
            setActiveTab={setActiveTab}
            onTriggerAlarmNow={handleTriggerAlarmNow}
          />
        )}

        {activeTab === 'alarms' && (
          <AlarmsTab
            alarms={alarms}
            setAlarms={setAlarms}
            workouts={workouts}
            milestones={milestones}
            setMilestones={setMilestones}
            onTriggerAlarmNow={handleTriggerAlarmNow}
            onStartRoutine={handleStartWorkout}
            onLogWater={handleLogWater}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsTab
            workouts={workouts}
            onStartWorkout={handleStartWorkout}
            activeWorkout={activeWorkout}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={() => setActiveWorkout(null)}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsTab />}

        {activeTab === 'community' && (
          <CommunityTab
            posts={posts}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
          />
        )}

        {activeTab === 'ai-coach' && <AICoachTab stats={stats} goals={goals} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        stats={stats}
        setStats={setStats}
        onAddPost={handleAddPost}
      />

      {/* Real-time Alarm Trigger Modal with Audio Ringer */}
      <AlarmTriggerModal
        alarm={triggeredAlarm}
        workouts={workouts}
        onDismiss={() => setTriggeredAlarm(null)}
        onSnooze={handleSnoozeAlarm}
        onStartRoutine={handleStartWorkout}
      />
    </div>
  );
}
