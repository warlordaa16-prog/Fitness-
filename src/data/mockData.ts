import { WorkoutRoutine, LeaderboardUser, DailyTrend, FitnessAlarm, DailyGuidanceMilestone } from '../types';

export const INITIAL_WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'w-1',
    title: 'Full Body HIIT Blast',
    category: 'HIIT',
    durationMins: 30,
    estimatedCalories: 380,
    difficulty: 'Intermediate',
    instructor: 'Coach Mike',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
    description: 'High-intensity interval training designed to torch calories, spike metabolism, and build endurance with precise form cues.',
    warmupMins: 3,
    cooldownMins: 3,
    exercises: [
      {
        name: 'Jumping Jacks',
        durationSec: 45,
        targetMuscles: ['Calves', 'Deltoids', 'Core', 'Cardiovascular System'],
        howToPerform: [
          'Stand upright with your feet together and arms resting at your sides.',
          'Bend your knees slightly and jump into the air.',
          'Spread your legs shoulder-width apart while sweeping your arms outward and over your head.',
          'Jump back to starting position smoothly and repeat rhythmically.'
        ],
        formTips: [
          'Land softly on the balls of your feet to protect your knees and ankles.',
          'Keep your abdominal muscles braced throughout the motion.',
          'Maintain a brisk, consistent cadence rather than sporadic bursts.'
        ],
        breathingPattern: 'Inhale as arms go overhead; exhale briskly as feet return together.',
        commonMistakes: [
          'Landing heavily on flat heels.',
          'Allowing elbows to flare uncontrollably without shoulder engagement.'
        ]
      },
      {
        name: 'Mountain Climbers',
        durationSec: 45,
        targetMuscles: ['Core & Abs', 'Hip Flexors', 'Shoulders', 'Quads'],
        howToPerform: [
          'Start in a high plank position with hands planted firmly below shoulders.',
          'Drive your right knee up toward your chest without letting your hips rise.',
          'Quickly switch legs, extending the right back while driving the left knee forward.',
          'Continue alternating in a fluid, running motion.'
        ],
        formTips: [
          'Keep your hips level and in line with your spine—avoid piking upward.',
          'Press actively through the floor with your palms to stabilize your shoulder girdle.'
        ],
        breathingPattern: 'Breathe continuously in a 2-step rhythm (inhale 2 steps, exhale 2 steps).',
        commonMistakes: [
          'Bouncing hips too high in the air.',
          'Shifting shoulders backwards behind wrist alignment.'
        ]
      },
      {
        name: 'Explosive Burpees',
        reps: 15,
        durationSec: 50,
        targetMuscles: ['Full Body', 'Chest', 'Quadriceps', 'Glutes', 'Core'],
        howToPerform: [
          'From standing, squat down and place your hands flat on the floor.',
          'Kick your feet back into a strong plank and lower your chest to the mat.',
          'Press up forcefully, jump feet back towards hands, and leap vertically with arms raised.'
        ],
        formTips: [
          'Do not let your lower back sag during the plank or push-up phase.',
          'Use explosive power from your hips and glutes on the vertical jump.'
        ],
        breathingPattern: 'Inhale on the descent; exhale forcefully as you drive upward into the jump.',
        commonMistakes: [
          'Arching lower back on the floor transition.',
          'Skipping the full vertical jump extension.'
        ]
      },
      {
        name: 'High Knees Sprint',
        durationSec: 45,
        targetMuscles: ['Hip Flexors', 'Calves', 'Hamstrings', 'Cardio'],
        howToPerform: [
          'Stand in place with feet hip-width apart.',
          'Drive one knee up toward your chest until thigh is parallel to the ground.',
          'Quickly switch and drive the other knee up while pumping opposite arms.'
        ],
        formTips: [
          'Keep torso upright with a slight forward athletic lean from ankles, not waist.',
          'Stay light and springy on the balls of your feet.'
        ],
        breathingPattern: 'Maintain steady, rhythmic breathing through nose and mouth.',
        commonMistakes: [
          'Leaning backwards to lift the knees.',
          'Incomplete knee lift below hip level.'
        ]
      },
      {
        name: 'Isometric Forearm Plank',
        durationSec: 60,
        targetMuscles: ['Transverse Abdominis', 'Obliques', 'Lower Back', 'Glutes'],
        howToPerform: [
          'Lie prone and prop yourself up on forearms, elbows directly under shoulders.',
          'Tuck toes and lift body so it forms a straight rigid line from head to heels.',
          'Squeeze glutes and draw navel firmly toward your spine.'
        ],
        formTips: [
          'Gaze slightly ahead at the floor to maintain neutral cervical spine.',
          'Actively push forearms into the floor to broaden your upper back.'
        ],
        breathingPattern: 'Slow, deep diaphragmatic breaths while maintaining abdominal tension.',
        commonMistakes: [
          'Sagging lower back or elevated buttocks.',
          'Holding your breath during isometric tension.'
        ]
      }
    ]
  },
  {
    id: 'w-2',
    title: 'Hypertrophy Upper Body',
    category: 'Strength',
    durationMins: 45,
    estimatedCalories: 320,
    difficulty: 'Advanced',
    instructor: 'Marcus Vance',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600',
    description: 'A progressive overload strength routine targeting chest, shoulders, and triceps with focused mind-muscle connection.',
    warmupMins: 5,
    cooldownMins: 4,
    exercises: [
      {
        name: 'Barbell Bench Press',
        sets: 4,
        reps: 8,
        targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps Brachii'],
        howToPerform: [
          'Lie on the bench with eyes under the bar. Plant feet firmly on the floor.',
          'Grip the bar slightly wider than shoulder width and retract shoulder blades.',
          'Unrack and lower the bar under control to the mid-chest line.',
          'Press upwards and slightly back to lockout without unlocking shoulders.'
        ],
        formTips: [
          'Keep elbows tucked at a 45-degree angle to protect shoulder joints.',
          'Drive through your heels to generate leg drive.'
        ],
        breathingPattern: 'Inhale deeply on the eccentric descent; exhale on the concentric press.',
        commonMistakes: [
          'Bouncing the bar off the ribcage.',
          'Flaring elbows out at 90 degrees.'
        ]
      },
      {
        name: 'Overhead Shoulder Press',
        sets: 3,
        reps: 10,
        targetMuscles: ['Anterior & Lateral Deltoids', 'Upper Chest', 'Triceps', 'Core'],
        howToPerform: [
          'Hold dumbbells or barbell at collarbone level with forearms vertical.',
          'Brace glutes and core to prevent excessive lumbar arching.',
          'Press the weights straight overhead until arms are extended, clearing head.'
        ],
        formTips: [
          'Lock ribs down and squeeze glutes tight to stabilize spine.',
          'Do not shrug ears into shoulders at top of press.'
        ],
        breathingPattern: 'Inhale at bottom; exhale through sticking point as you press overhead.',
        commonMistakes: [
          'Hyperextending the lower back.',
          'Pressing forward instead of straight upward in bar path.'
        ]
      },
      {
        name: 'Incline Dumbbell Flyes',
        sets: 3,
        reps: 12,
        targetMuscles: ['Clavicular Head of Pectoralis', 'Serratus Anterior'],
        howToPerform: [
          'Set bench to 30-degree incline. Hold dumbbells with neutral grip above chest.',
          'With a slight bend in elbows, lower weights in an arc until a stretch is felt in chest.',
          'Bring weights back up along the same path, squeezing pectorals at the peak.'
        ],
        formTips: [
          'Maintain a static slight elbow bend—do not turn it into a press.',
          'Focus on opening the chest rather than lowering weights excessively deep.'
        ],
        breathingPattern: 'Inhale on the wide stretch; exhale as you hug the weights back together.',
        commonMistakes: [
          'Over-stretching past comfortable shoulder capsule range.',
          'Changing elbow angle during reps.'
        ]
      },
      {
        name: 'Tricep Cable Pushdowns',
        sets: 3,
        reps: 15,
        targetMuscles: ['Triceps Brachii (Lateral & Medial heads)'],
        howToPerform: [
          'Stand facing cable with rope or bar attachment at chest level.',
          'Pin elbows closely to your ribs with chest proud.',
          'Push downward until arms are fully locked out, flaring rope slightly at bottom.',
          'Control weight back to 90 degrees.'
        ],
        formTips: [
          'Keep upper arms completely stationary throughout the movement.',
          'Pause and squeeze triceps for a full second at lockout.'
        ],
        breathingPattern: 'Inhale as handle returns up; exhale on downward press.',
        commonMistakes: [
          'Letting elbows drift forward and backward.',
          'Using shoulder momentum to push the weight down.'
        ]
      }
    ]
  },
  {
    id: 'w-3',
    title: 'Core Crusher & Abs',
    category: 'Core',
    durationMins: 20,
    estimatedCalories: 180,
    difficulty: 'Beginner',
    instructor: 'Sarah Jenkins',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    description: 'Target transverse abdominals, rectus abdominis, and obliques with deliberate tempo and spine-safe activation.',
    warmupMins: 2,
    cooldownMins: 2,
    exercises: [
      {
        name: 'Bicycle Crunches',
        reps: 20,
        durationSec: 40,
        targetMuscles: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
        howToPerform: [
          'Lie on back with lower spine pressed into the mat, fingertips behind ears.',
          'Bring knees to 90 degrees and lift shoulder blades off the floor.',
          'Rotate right elbow toward left knee while extending right leg straight out.',
          'Switch smoothly to opposite side in a pedaling cadence.'
        ],
        formTips: [
          'Rotate from your ribcage and core, not by pulling on your neck.',
          'Keep lower back in continuous contact with the mat.'
        ],
        breathingPattern: 'Exhale with each cross-body rotation; inhale during transition.',
        commonMistakes: [
          'Yanking the head and neck forward with hands.',
          'Moving too quickly without full contraction.'
        ]
      },
      {
        name: 'Seated Russian Twists',
        reps: 30,
        durationSec: 45,
        targetMuscles: ['Internal & External Obliques', 'Transverse Abdominis'],
        howToPerform: [
          'Sit with knees bent, feet flat on floor or elevated for extra challenge.',
          'Lean torso back 45 degrees while maintaining a straight spine.',
          'Clasp hands together and rotate torso side to side, tapping near hips.'
        ],
        formTips: [
          'Lead the rotation with your shoulders and chest, keeping hips square.',
          'Do not round your lower back.'
        ],
        breathingPattern: 'Exhale on each twist; inhale at center.',
        commonMistakes: [
          'Moving only the arms instead of rotating the whole torso.',
          'Rounding the thoracic spine into a slump.'
        ]
      },
      {
        name: 'Controlled Leg Raises',
        reps: 15,
        durationSec: 45,
        targetMuscles: ['Lower Rectus Abdominis', 'Hip Flexors'],
        howToPerform: [
          'Lie flat on back with legs straight and hands under lower glutes for support.',
          'Raise legs upward until perpendicular to the floor.',
          'Lower legs back down slowly, stopping just an inch above the ground without touching.'
        ],
        formTips: [
          'Perform a 3-second negative descent to maximize core engagement.',
          'Press lower back into the floor throughout the movement.'
        ],
        breathingPattern: 'Inhale as legs lower; exhale forcefully as legs lift up.',
        commonMistakes: [
          'Allowing lumbar spine to arch off the mat on descent.',
          'Using momentum to swing legs up.'
        ]
      }
    ]
  },
  {
    id: 'w-4',
    title: 'Zen Vinyasa Flow Yoga',
    category: 'Yoga',
    durationMins: 40,
    estimatedCalories: 210,
    difficulty: 'Beginner',
    instructor: 'Elena Rostova',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    description: 'Calming, restorative flow to expand range of motion, relieve spinal tension, and synchronize breath with mindful movement.',
    warmupMins: 4,
    cooldownMins: 5,
    exercises: [
      {
        name: 'Sun Salutation A',
        sets: 3,
        durationSec: 120,
        targetMuscles: ['Full Body Spine Mobility', 'Hamstrings', 'Shoulders'],
        howToPerform: [
          'Start in Mountain Pose (Tadasana), inhale and sweep arms up.',
          'Exhale and fold forward into Uttanasana.',
          'Inhale halfway lift with flat back, step back into plank and lower to Chaturanga.',
          'Inhale into Upward-Facing Dog, exhale into Downward-Facing Dog for 5 breaths.'
        ],
        formTips: [
          'Sync one breath with each single movement.',
          'Micro-bend knees in forward fold if hamstrings are tight.'
        ],
        breathingPattern: 'Deep Ujjayi nasal breathing throughout the continuous sequence.',
        commonMistakes: [
          'Rushing through postures without full breath expansion.',
          'Collapsing shoulders in upward dog.'
        ]
      },
      {
        name: 'Warrior II Pose (Virabhadrasana II)',
        durationSec: 60,
        targetMuscles: ['Hip Abductors', 'Quadriceps', 'Core', 'Shoulder Girdle'],
        howToPerform: [
          'Step feet wide apart (~4 feet). Turn front foot forward and back foot 90 degrees.',
          'Bend front knee over ankle to 90 degrees while keeping back leg strong and straight.',
          'Extend arms parallel to floor, gazing over front middle finger.'
        ],
        formTips: [
          'Stack shoulders directly over hips—avoid reaching forward.',
          'Keep front knee tracking toward your pinky toe.'
        ],
        breathingPattern: 'Slow, steady 4-second inhales and 4-second exhales.',
        commonMistakes: [
          'Front knee caving inward toward midline.',
          'Elevating shoulders toward ears.'
        ]
      },
      {
        name: 'Child\'s Pose Deep Relaxation',
        durationSec: 120,
        targetMuscles: ['Lower Back Decompression', 'Lats', 'Hips', 'Ankles'],
        howToPerform: [
          'Kneel on mat with big toes touching and knees spread wide apart.',
          'Sit hips back onto heels, walk hands forward, and rest forehead gently on the mat.',
          'Lengthen your spine and allow chest to sink toward floor.'
        ],
        formTips: [
          'Direct each breath into the back of your lungs and lower back.',
          'Relax all jaw and facial tension completely.'
        ],
        breathingPattern: 'Deep, calming belly breaths with prolonged exhalations.',
        commonMistakes: [
          'Lifting hips high off heels due to tight hip flexors (use a block or blanket if needed).'
        ]
      }
    ]
  },
  {
    id: 'w-5',
    title: 'Endurance Cardio Run & Sprint',
    category: 'Cardio',
    durationMins: 50,
    estimatedCalories: 550,
    difficulty: 'Advanced',
    instructor: 'Coach Mike',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600',
    description: 'Interval running structure alternating steady aerobic pacing with high-lactate sprint surges to boost VO2 max.',
    warmupMins: 5,
    cooldownMins: 5,
    exercises: [
      {
        name: 'Aerobic Warm-up Jog',
        durationSec: 300,
        targetMuscles: ['Calves', 'Quads', 'Cardiovascular Warmup'],
        howToPerform: [
          'Start at an easy, conversational pace (RPE 4-5 out of 10).',
          'Focus on smooth arm swing and quick, light foot turnover.'
        ],
        formTips: ['Keep shoulders loose and jaw relaxed.'],
        breathingPattern: '3:3 rhythm (3 steps inhale, 3 steps exhale).',
        commonMistakes: ['Starting out too fast during the warm-up window.']
      },
      {
        name: 'High Intensity Sprint Surge',
        durationSec: 60,
        targetMuscles: ['Fast Twitch Muscle Fibers', 'Glutes', 'Hamstrings'],
        howToPerform: [
          'Accelerate into a 90-95% maximal effort sprint.',
          'Drive knees up and pump arms aggressively from shoulders.'
        ],
        formTips: ['Maintain slight forward lean and strike ground underneath your center of mass.'],
        breathingPattern: 'Fast, controlled oral-nasal breathing.',
        commonMistakes: ['Over-striding in front of body causing braking forces.']
      },
      {
        name: 'Active Recovery Jog',
        durationSec: 120,
        targetMuscles: ['Lactate Clearance', 'Aerobic System'],
        howToPerform: [
          'Drop pace down to a gentle jog to bring heart rate back to aerobic zone.',
          'Shake out arms and take deep breaths.'
        ],
        formTips: ['Focus on lowering heart rate before the next sprint surge.'],
        breathingPattern: 'Deep, deliberate nasal inhales.',
        commonMistakes: ['Stopping completely instead of active light recovery.']
      }
    ]
  }
];

export const INITIAL_ALARMS: FitnessAlarm[] = [
  {
    id: 'alarm-1',
    title: 'Morning Mobility & Hydration Alarm',
    time: '07:00',
    category: 'morning' as any,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    sound: 'gentle-bell',
    instructionTip: 'Drink 500ml of water immediately upon waking. Do 5 gentle cat-cow spinal flexes to lubricate joints.',
    targetRoutineId: 'w-4'
  },
  {
    id: 'alarm-2',
    title: 'Midday Posture & De-Desk Stretch',
    time: '12:30',
    category: 'stretch',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    sound: 'marimba',
    instructionTip: 'Stand up, roll shoulders backward 10 times, stretch chest against a doorway, and take a 5-minute walking lap.',
    targetRoutineId: 'w-3'
  },
  {
    id: 'alarm-3',
    title: 'Main Daily Workout Session',
    time: '17:30',
    category: 'workout',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    enabled: true,
    sound: 'energetic-chime',
    instructionTip: 'Time for your scheduled workout! Grab your water, strap on training shoes, and initiate your warmup.',
    targetRoutineId: 'w-1'
  },
  {
    id: 'alarm-4',
    title: 'Evening Recovery & Sleep Window',
    time: '21:30',
    category: 'recovery',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    sound: 'voice-coach',
    instructionTip: 'Dim overhead lights, power down blue light screens, perform 3 minutes of deep box breathing to prepare for anabolic recovery.',
    targetRoutineId: 'w-4'
  }
];

export const DAILY_GUIDANCE_MILESTONES: DailyGuidanceMilestone[] = [
  {
    id: 'm-1',
    time: '07:00 AM',
    title: 'Morning Hydration & Light Joint Warm-up',
    category: 'morning',
    instructions: 'Rehydrate cells with 500ml water and perform 10 neck circles and ankle rotations.',
    actionLabel: 'Log Water (+500ml)',
    actionType: 'log-water',
    actionPayload: '500',
    completed: true
  },
  {
    id: 'm-2',
    time: '12:30 PM',
    title: 'Desk Decompression & Posture Reset',
    category: 'stretch',
    instructions: 'Combat prolonged sitting: perform 15 standing glute squeezes and 1-minute doorframe chest opener.',
    actionLabel: 'View Stretch Routine',
    actionType: 'open-workout',
    actionPayload: 'w-3',
    completed: false
  },
  {
    id: 'm-3',
    time: '05:30 PM',
    title: 'Main Training Session (HIIT / Strength)',
    category: 'workout',
    instructions: 'Target: 30 minutes of elevated heart rate training with audio-coached tempo.',
    actionLabel: 'Start Guided Workout',
    actionType: 'open-workout',
    actionPayload: 'w-1',
    completed: false
  },
  {
    id: 'm-4',
    time: '09:30 PM',
    title: 'Parasympathetic Wind-down & Recovery',
    category: 'recovery',
    instructions: 'Sip chamomile tea, foam roll tight quadriceps, and aim for 7.5 - 8 hours of restorative sleep.',
    actionLabel: 'Guided Wind-down',
    actionType: 'open-workout',
    actionPayload: 'w-4',
    completed: false
  }
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", weeklySteps: 84200, streak: 14, badge: "🔥 14d Streak" },
  { rank: 2, name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", weeklySteps: 78900, streak: 9, badge: "💪 Iron Lifter" },
  { rank: 3, name: "You (Alex)", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", weeklySteps: 65400, streak: 6, badge: "⚡ Rising Star" },
  { rank: 4, name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", weeklySteps: 61200, streak: 11, badge: "🧘 Zen Master" },
  { rank: 5, name: "David Chen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", weeklySteps: 55800, streak: 4, badge: "🏃 Cardio King" }
];

export const WEEKLY_TRENDS: DailyTrend[] = [
  { day: 'Mon', calories: 450, steps: 9200, activeMins: 55 },
  { day: 'Tue', calories: 520, steps: 11400, activeMins: 65 },
  { day: 'Wed', calories: 380, steps: 8100, activeMins: 45 },
  { day: 'Thu', calories: 610, steps: 12800, activeMins: 75 },
  { day: 'Fri', calories: 490, steps: 10200, activeMins: 60 },
  { day: 'Sat', calories: 750, steps: 14500, activeMins: 90 },
  { day: 'Sun', calories: 400, steps: 8500, activeMins: 50 }
];

export const WEIGHT_HISTORY = [
  { week: 'W1', weight: 78.5 },
  { week: 'W2', weight: 78.1 },
  { week: 'W3', weight: 77.6 },
  { week: 'W4', weight: 77.2 },
  { week: 'W5', weight: 76.8 },
  { week: 'W6', weight: 76.4 }
];

export const ACTIVITY_DISTRIBUTION = [
  { name: 'Cardio', value: 35, color: '#f97316' },
  { name: 'Strength', value: 40, color: '#6366f1' },
  { name: 'Yoga / Flexibility', value: 15, color: '#10b981' },
  { name: 'HIIT', value: 10, color: '#ec4899' }
];
