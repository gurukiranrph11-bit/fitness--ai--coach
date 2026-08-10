/* ============================================================
   FitAI - Redux Store Configuration
   ============================================================ */

import { configureStore, createSlice } from '@reduxjs/toolkit';

// ============================================================
// USER SLICE
// ============================================================
const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        isOnboarded: false,
        preferences: {
            daysPerWeek: 3,
            duration: 45,
            workoutType: 'mixed',
            activityLevel: 'moderate'
        }
    },
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
            state.isOnboarded = true;
        },
        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },
        setPreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        resetUser: (state) => {
            state.profile = null;
            state.isOnboarded = false;
        }
    }
});

// ============================================================
// WORKOUT SLICE
// ============================================================
const workoutSlice = createSlice({
    name: 'workout',
    initialState: {
        weeklyPlan: {},
        activeWorkout: null,
        workoutHistory: [],
        currentExercise: 0,
        isWorkoutActive: false,
        workoutTimer: 0
    },
    reducers: {
        setWeeklyPlan: (state, action) => {
            state.weeklyPlan = action.payload;
        },
        setActiveWorkout: (state, action) => {
            state.activeWorkout = action.payload;
            state.isWorkoutActive = true;
            state.currentExercise = 0;
            state.workoutTimer = 0;
        },
        completeExercise: (state) => {
            if (state.activeWorkout?.exercises) {
                state.activeWorkout.exercises[state.currentExercise].completed = true;
                state.currentExercise += 1;
            }
        },
        logWorkout: (state, action) => {
            state.workoutHistory.push(action.payload);
            state.isWorkoutActive = false;
            state.activeWorkout = null;
        },
        updateTimer: (state, action) => {
            state.workoutTimer = action.payload;
        },
        endWorkout: (state) => {
            state.isWorkoutActive = false;
            state.activeWorkout = null;
        }
    }
});

// ============================================================
// NUTRITION SLICE
// ============================================================
const nutritionSlice = createSlice({
    name: 'nutrition',
    initialState: {
        meals: [],
        waterGlasses: 0,
        macroConsumed: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        macroTargets: { calories: 2000, protein: 150, carbs: 200, fat: 65 }
    },
    reducers: {
        setMacroTargets: (state, action) => {
            state.macroTargets = action.payload;
        },
        logMeal: (state, action) => {
            state.meals.push(action.payload);
            state.macroConsumed.calories += action.payload.calories || 0;
            state.macroConsumed.protein += action.payload.protein || 0;
            state.macroConsumed.carbs += action.payload.carbs || 0;
            state.macroConsumed.fat += action.payload.fat || 0;
        },
        drinkWater: (state) => {
            state.waterGlasses = Math.min(8, state.waterGlasses + 1);
        },
        resetDailyNutrition: (state) => {
            state.meals = [];
            state.waterGlasses = 0;
            state.macroConsumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
    }
});

// ============================================================
// PROGRESS SLICE
// ============================================================
const progressSlice = createSlice({
    name: 'progress',
    initialState: {
        weightLog: [],
        achievements: [],
        streaks: 0,
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        badges: []
    },
    reducers: {
        logWeight: (state, action) => {
            state.weightLog.push(action.payload);
        },
        incrementWorkouts: (state) => {
            state.totalWorkouts += 1;
        },
        addCalories: (state, action) => {
            state.totalCaloriesBurned += action.payload;
        },
        setStreak: (state, action) => {
            state.streaks = action.payload;
        },
        unlockBadge: (state, action) => {
            if (!state.badges.find(b => b.id === action.payload.id)) {
                state.badges.push(action.payload);
            }
        }
    }
});

// ============================================================
// AI COACH SLICE
// ============================================================
const aiCoachSlice = createSlice({
    name: 'aiCoach',
    initialState: {
        conversation: [
            {
                role: 'bot',
                text: "Hey there! 👋 I'm your AI fitness coach. Ask me about workouts, nutrition, or motivation!"
            }
        ],
        insights: [],
        isTyping: false
    },
    reducers: {
        addMessage: (state, action) => {
            state.conversation.push(action.payload);
        },
        setTyping: (state, action) => {
            state.isTyping = action.payload;
        },
        addInsight: (state, action) => {
            state.insights.push(action.payload);
        },
        clearConversation: (state) => {
            state.conversation = [{
                role: 'bot',
                text: "Hey there! 👋 I'm your AI fitness coach. Ask me about workouts, nutrition, or motivation!"
            }];
        }
    }
});

// ============================================================
// STORE
// ============================================================
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        workout: workoutSlice.reducer,
        nutrition: nutritionSlice.reducer,
        progress: progressSlice.reducer,
        aiCoach: aiCoachSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Export actions
export const {
    setProfile, updateProfile, setPreferences, resetUser
} = userSlice.actions;

export const {
    setWeeklyPlan, setActiveWorkout, completeExercise,
    logWorkout, updateTimer, endWorkout
} = workoutSlice.actions;

export const {
    setMacroTargets, logMeal, drinkWater, resetDailyNutrition
} = nutritionSlice.actions;

export const {
    logWeight, incrementWorkouts, addCalories, setStreak, unlockBadge
} = progressSlice.actions;

export const {
    addMessage, setTyping, addInsight, clearConversation
} = aiCoachSlice.actions;

