/* ============================================================
   FitAI - Backend API Server
   Express.js REST API with AI integration endpoints
   ============================================================ */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (commented for local dev without MongoDB)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fital')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// ============================================================
// IN-MEMORY DATA STORE (for demo purposes)
// ============================================================
const db = {
    users: [],
    workouts: [],
    nutritionLogs: [],
    progressLogs: []
};

// ============================================================
// AI COACH ENGINE (Server-side)
// ============================================================
class AICoachServer {
    constructor() {
        this.exerciseLibrary = {
            full_body: [
                { name: "Push-ups", sets: 3, reps: "12-15", muscle: "Chest, Shoulders, Triceps", type: "strength" },
                { name: "Squats", sets: 3, reps: "15-20", muscle: "Quadriceps, Glutes", type: "strength" },
                { name: "Dumbbell Rows", sets: 3, reps: "12 each", muscle: "Back, Biceps", type: "strength" },
                { name: "Plank", sets: 3, reps: "30-60 sec", muscle: "Core", type: "core" },
                { name: "Lunges", sets: 3, reps: "12 each", muscle: "Legs, Glutes", type: "strength" },
                { name: "Shoulder Press", sets: 3, reps: "10-12", muscle: "Shoulders", type: "strength" },
                { name: "Deadlifts", sets: 3, reps: "10-12", muscle: "Back, Legs", type: "strength" },
                { name: "Bicycle Crunches", sets: 3, reps: "20", muscle: "Core", type: "core" },
                { name: "Mountain Climbers", sets: 3, reps: "30 sec", muscle: "Full Body, Cardio", type: "cardio" },
                { name: "Burpees", sets: 3, reps: "10-15", muscle: "Full Body", type: "cardio" }
            ],
            upper_body: [
                { name: "Push-ups", sets: 3, reps: "12-15", muscle: "Chest, Shoulders, Triceps", type: "strength" },
                { name: "Pull-ups/Lat Pulldown", sets: 3, reps: "8-12", muscle: "Back, Biceps", type: "strength" },
                { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", muscle: "Chest", type: "strength" },
                { name: "Bent Over Rows", sets: 3, reps: "12", muscle: "Back", type: "strength" },
                { name: "Overhead Press", sets: 3, reps: "10-12", muscle: "Shoulders", type: "strength" },
                { name: "Bicep Curls", sets: 3, reps: "12-15", muscle: "Biceps", type: "strength" },
                { name: "Tricep Pushdowns", sets: 3, reps: "12-15", muscle: "Triceps", type: "strength" }
            ],
            lower_body: [
                { name: "Squats", sets: 3, reps: "15-20", muscle: "Quadriceps, Glutes", type: "strength" },
                { name: "Romanian Deadlifts", sets: 3, reps: "12", muscle: "Hamstrings, Glutes", type: "strength" },
                { name: "Walking Lunges", sets: 3, reps: "12 each", muscle: "Legs, Glutes", type: "strength" },
                { name: "Leg Press", sets: 3, reps: "12-15", muscle: "Quadriceps", type: "strength" },
                { name: "Calf Raises", sets: 3, reps: "20", muscle: "Calves", type: "strength" }
            ],
            cardio: [
                { name: "Jumping Jacks", sets: 3, reps: "45 sec", muscle: "Full Body", type: "cardio" },
                { name: "High Knees", sets: 3, reps: "30 sec", muscle: "Legs, Core", type: "cardio" },
                { name: "Burpees", sets: 3, reps: "10-15", muscle: "Full Body", type: "cardio" },
                { name: "Mountain Climbers", sets: 3, reps: "30 sec", muscle: "Full Body", type: "cardio" },
                { name: "Jump Rope", sets: 3, reps: "60 sec", muscle: "Full Body", type: "cardio" }
            ],
            core: [
                { name: "Plank", sets: 3, reps: "30-60 sec", muscle: "Core", type: "core" },
                { name: "Russian Twists", sets: 3, reps: "20", muscle: "Obliques", type: "core" },
                { name: "Leg Raises", sets: 3, reps: "15", muscle: "Lower Abs", type: "core" },
                { name: "Bicycle Crunches", sets: 3, reps: "20", muscle: "Core", type: "core" }
            ]
        };

        this.motivationalMessages = [
            "You're crushing it! 💪 Keep pushing forward!",
            "Remember why you started! 🎯 Every rep counts!",
            "Your future self will thank you for today's effort! ⏳",
            "Champions keep going when it gets tough! 🏆",
            "Small progress is still progress. Keep showing up! 📈",
            "You're stronger than you think! 💪",
            "Discipline is doing what needs to be done! ⚡",
            "One more rep! You've got this! 🔥"
        ];
    }

    generatePlan(profile) {
        const { fitnessLevel, goal, daysPerWeek, duration, workoutType } = profile;
        const weeklyPlan = {};
        const intensity = this.calculateIntensity(fitnessLevel, goal);
        const workoutDays = this.distributeDays(daysPerWeek);

        workoutDays.forEach((dayOfWeek, index) => {
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
            const focus = this.getDayFocus(index, daysPerWeek, goal);
            const dayExercises = this.createWorkout(focus, fitnessLevel, duration);

            weeklyPlan[dayOfWeek] = {
                day: dayName,
                focus: focus,
                exercises: dayExercises,
                duration: duration,
                intensity: intensity,
                caloriesBurn: this.estimateCalories(dayExercises, profile.weight || 70),
                completed: false
            };
        });

        // Fill rest days
        for (let i = 0; i < 7; i++) {
            if (!weeklyPlan[i]) {
                weeklyPlan[i] = {
                    day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
                    focus: 'rest',
                    exercises: [],
                    duration: 0,
                    intensity: 'rest',
                    caloriesBurn: 0,
                    recoveryTip: this.getRecoveryTip()
                };
            }
        }

        return weeklyPlan;
    }

    calculateIntensity(fitnessLevel, goal) {
        const map = { beginner: 'Low', intermediate: 'Moderate', advanced: 'High' };
        return map[fitnessLevel] || 'Moderate';
    }

    distributeDays(numDays) {
        const days = [];
        const gap = 7 / numDays;
        const today = new Date().getDay();
        for (let i = 0; i < numDays; i++) {
            days.push(Math.round(i * gap) % 7);
        }
        if (!days.includes(today)) days[0] = today;
        return [...new Set(days)].sort();
    }

    getDayFocus(index, totalDays, goal) {
        if (totalDays <= 2) return 'full_body';
        const focuses = ['full_body', 'upper_body', 'lower_body', 'full_body', 'upper_body', 'lower_body', 'cardio'];
        return focuses[index % focuses.length];
    }

    createWorkout(focus, fitnessLevel, durationMinutes) {
        const pool = this.exerciseLibrary[focus] || this.exerciseLibrary.full_body;
        const numExercises = Math.max(4, Math.min(8, Math.floor(durationMinutes / 7)));
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, numExercises);

        return selected.map(ex => {
            let adjustedReps = ex.reps;
            let adjustedSets = ex.sets;
            if (fitnessLevel === 'beginner') {
                adjustedSets = Math.max(2, ex.sets - 1);
                adjustedReps = typeof ex.reps === 'string' ? ex.reps.replace(/(\d+)/g, m => Math.max(6, parseInt(m) - 4)) : '10';
            } else if (fitnessLevel === 'advanced') {
                adjustedSets = ex.sets + 1;
                adjustedReps = typeof ex.reps === 'string' ? ex.reps.replace(/(\d+)/g, m => parseInt(m) + 3) : '15';
            }
            return { ...ex, sets: adjustedSets, reps: adjustedReps, completed: false, restTime: 60 };
        });
    }

    estimateCalories(exercises, weight) {
        const METs = { strength: 5.0, cardio: 8.0, core: 3.5 };
        let total = 0;
        exercises.forEach(ex => {
            const met = METs[ex.type] || 4.0;
            const duration = typeof ex.reps === 'string' && ex.reps.includes('sec') ? parseInt(ex.reps) : 45;
            const calPerMin = (met * 3.5 * weight) / 200;
            total += (calPerMin * (duration / 60) * ex.sets);
        });
        return Math.round(total);
    }

    getRecoveryTip() {
        const tips = [
            "Active recovery: Go for a light 20-min walk 🚶",
            "Stretch for 15 minutes focusing on worked muscle groups 🧘",
            "Foam rolling can help reduce muscle soreness 🔄",
            "Hydrate well and eat protein-rich foods 💧",
            "Rest days are when your muscles grow! Be patient 📈"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    getMotivation() {
        return this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
    }

    getNutritionAdvice(goal) {
        const advice = {
            weight_loss: [
                "Focus on lean proteins and lots of veggies 🥗",
                "Try to keep meals under 400 calories with high protein 💪",
                "Swap refined carbs for whole grains 🌾",
                "Drink water before meals to feel fuller 💧"
            ],
            muscle_gain: [
                "Protein is key! Aim for 1.6-2.2g per kg of bodyweight 🥩",
                "Eat in a slight calorie surplus (300-500 cal above maintenance) 📈",
                "Complex carbs fuel your workouts effectively 🌾",
                "Don't fear healthy fats - they support hormone production 🥑"
            ],
            general_fitness: [
                "Balanced meals with protein, healthy fats, and complex carbs 🥗",
                "Eat a rainbow of vegetables for micronutrients 🌈",
                "Stay hydrated - aim for 2-3 liters of water daily 💧",
                "Limit processed foods and added sugars 🚫"
            ]
        };
        const tips = advice[goal] || advice.general_fitness;
        return tips[Math.floor(Math.random() * tips.length)];
    }

    getAdaptationFeedback(completionRate, feedback) {
        if (completionRate >= 0.8 && feedback !== 'too_hard') {
            return {
                action: 'increase',
                message: "Great work! I've increased the intensity to match your progress! 🚀",
                newLevel: 'advanced'
            };
        } else if (completionRate < 0.5 || feedback === 'too_hard') {
            return {
                action: 'decrease',
                message: "No problem! I've adjusted the workout to be more manageable. 💪",
                newLevel: 'beginner'
            };
        }
        return {
            action: 'maintain',
            message: "You're right on track! Keep going! 🔥",
            newLevel: null
        };
    }
}

const aiCoachServer = new AICoachServer();

// ============================================================
// API ROUTES
// ============================================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================
// USER ROUTES
// ============================================================

// Register / Create Profile
app.post('/api/users/register', (req, res) => {
    const { name, email, age, gender, weight, height, fitnessLevel, goal, healthConditions } = req.body;
    
    const user = {
        id: Date.now().toString(),
        name: name || 'User',
        email,
        age, gender, weight, height,
        fitnessLevel, goal,
        healthConditions: healthConditions || [],
        createdAt: new Date().toISOString(),
        preferences: {
            activityLevel: req.body.activityLevel || 'moderate',
            daysPerWeek: req.body.daysPerWeek || 3,
            duration: req.body.duration || 45,
            workoutType: req.body.workoutType || 'mixed'
        },
        targetWeight: req.body.targetWeight || null
    };
    
    db.users.push(user);
    
    // Generate initial plan
    const plan = aiCoachServer.generatePlan({
        fitnessLevel: user.fitnessLevel,
        goal: user.goal,
        daysPerWeek: user.preferences.daysPerWeek,
        duration: user.preferences.duration,
        workoutType: user.preferences.workoutType,
        weight: user.weight
    });
    
    res.status(201).json({
        success: true,
        user,
        plan
    });
});

// Get User Profile
app.get('/api/users/:id', (req, res) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
});

// Update User Profile
app.put('/api/users/:id', (req, res) => {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    
    db.users[index] = { ...db.users[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, user: db.users[index] });
});

// ============================================================
// WORKOUT ROUTES
// ============================================================

// Generate Workout Plan
app.post('/api/workouts/generate', (req, res) => {
    const { userId, fitnessLevel, goal, daysPerWeek, duration, workoutType, weight } = req.body;
    
    const plan = aiCoachServer.generatePlan({
        fitnessLevel: fitnessLevel || 'beginner',
        goal: goal || 'general_fitness',
        daysPerWeek: daysPerWeek || 3,
        duration: duration || 45,
        workoutType: workoutType || 'mixed',
        weight: weight || 70
    });
    
    res.json({ success: true, plan });
});

// Log Completed Workout
app.post('/api/workouts/log', (req, res) => {
    const { userId, workoutData } = req.body;
    
    const log = {
        id: Date.now().toString(),
        userId,
        ...workoutData,
        date: new Date().toISOString()
    };
    
    db.workouts.push(log);
    
    // Check for AI adaptation
    const completionRate = workoutData.exercisesCompleted / workoutData.totalExercises;
    const adaptation = aiCoachServer.getAdaptationFeedback(completionRate, workoutData.feedback);
    
    res.status(201).json({ success: true, log, adaptation });
});

// Get Workout History
app.get('/api/workouts/:userId', (req, res) => {
    const logs = db.workouts.filter(w => w.userId === req.params.userId);
    res.json({ success: true, workouts: logs });
});

// Get Today's Workout
app.get('/api/workouts/today/:userId', (req, res) => {
    const today = new Date().getDay();
    const user = db.users.find(u => u.id === req.params.userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Generate or retrieve plan
    const plan = aiCoachServer.generatePlan({
        fitnessLevel: user.fitnessLevel,
        goal: user.goal,
        daysPerWeek: user.preferences.daysPerWeek,
        duration: user.preferences.duration,
        workoutType: user.preferences.workoutType,
        weight: user.weight
    });
    
    res.json({ success: true, todayWorkout: plan[today] });
});

// ============================================================
// AI COACH ROUTES
// ============================================================

// Chat with AI Coach
app.post('/api/coach/chat', (req, res) => {
    const { userId, message, context } = req.body;
    
    // Simple NLP response generation
    const lowerMsg = message.toLowerCase();
    let response;
    
    if (lowerMsg.includes('plan') || lowerMsg.includes('workout')) {
        const user = db.users.find(u => u.id === userId);
        if (user) {
            const plan = aiCoachServer.generatePlan({
                fitnessLevel: user.fitnessLevel,
                goal: user.goal,
                daysPerWeek: user.preferences.daysPerWeek,
                duration: user.preferences.duration,
                workoutType: user.preferences.workoutType,
                weight: user.weight
            });
            const today = new Date().getDay();
            const todayPlan = plan[today];
            
            response = {
                text: `Here's your workout plan for today!\n\n**${todayPlan.focus.replace('_', ' ').toUpperCase()}**\nDuration: ${todayPlan.duration} min\n\nExercises:\n${todayPlan.exercises.map((ex, i) => `${i+1}. ${ex.name} - ${ex.sets}x${ex.reps}`).join('\n')}`,
                type: 'plan'
            };
        } else {
            response = { text: "I'd love to create a plan! Please complete your profile first.", type: 'info' };
        }
    } else if (lowerMsg.includes('meal') || lowerMsg.includes('nutrition') || lowerMsg.includes('food')) {
        const user = db.users.find(u => u.id === userId);
        const goal = user?.goal || 'general_fitness';
        response = { text: aiCoachServer.getNutritionAdvice(goal), type: 'nutrition' };
    } else if (lowerMsg.includes('motivate') || lowerMsg.includes('tired')) {
        response = { text: aiCoachServer.getMotivation() + "\n\nYou've got this! 💪", type: 'motivation' };
    } else if (lowerMsg.includes('progress') || lowerMsg.includes('improving')) {
        const workouts = db.workouts.filter(w => w.userId === userId);
        response = {
            text: `You've completed ${workouts.length} workouts! ${workouts.length > 0 ? 'Keep pushing forward! 🚀' : 'Start your first workout to see progress! 🎯'}`,
            type: 'progress'
        };
    } else {
        response = {
            text: "I'm here to help! Ask me about:\n• 📋 Planning a workout\n• 🥗 Nutrition advice\n• 🔥 Motivation\n• 📊 Progress tracking",
            type: 'general'
        };
    }
    
    res.json({ success: true, response });
});

// Get AI Motivation
app.get('/api/coach/motivation', (req, res) => {
    res.json({ success: true, message: aiCoachServer.getMotivation() });
});

// ============================================================
// NUTRITION ROUTES
// ============================================================

// Log Meal
app.post('/api/nutrition/meal', (req, res) => {
    const { userId, meal } = req.body;
    
    const log = {
        id: Date.now().toString(),
        userId,
        ...meal,
        date: new Date().toISOString()
    };
    
    db.nutritionLogs.push(log);
    res.status(201).json({ success: true, log });
});

// Get Nutrition Logs
app.get('/api/nutrition/:userId', (req, res) => {
    const logs = db.nutritionLogs.filter(n => n.userId === req.params.userId);
    res.json({ success: true, meals: logs });
});

// ============================================================
// PROGRESS ROUTES
// ============================================================

// Log Weight
app.post('/api/progress/weight', (req, res) => {
    const { userId, weight } = req.body;
    
    const log = {
        id: Date.now().toString(),
        userId,
        weight,
        date: new Date().toISOString()
    };
    
    db.progressLogs.push(log);
    res.status(201).json({ success: true, log });
});

// Get Progress Data
app.get('/api/progress/:userId', (req, res) => {
    const weightData = db.progressLogs.filter(p => p.userId === req.params.userId);
    const workoutData = db.workouts.filter(w => w.userId === req.params.userId);
    
    // Generate insights
    const totalWorkouts = workoutData.length;
    const totalCalories = workoutData.reduce((sum, w) => sum + (w.caloriesBurn || 0), 0);
    const avgDuration = totalWorkouts > 0 
        ? Math.round(workoutData.reduce((sum, w) => sum + (w.duration || 0), 0) / totalWorkouts) 
        : 0;
    
    res.json({
        success: true,
        data: {
            weightLog: weightData,
            workoutLog: workoutData,
            insights: {
                totalWorkouts,
                totalCalories,
                avgDuration
            }
        }
    });
});

// ============================================================
// SERVER START
// ============================================================
app.listen(PORT, () => {
    console.log(`🏋️ FitAI Server running on port ${PORT}`);
    console.log(`📋 API endpoints:`);
    console.log(`   POST /api/users/register - Create user`);
    console.log(`   POST /api/workouts/generate - Generate plan`);
    console.log(`   POST /api/workouts/log - Log workout`);
    console.log(`   POST /api/coach/chat - Chat with AI coach`);
    console.log(`   POST /api/nutrition/meal - Log meal`);
    console.log(`   POST /api/progress/weight - Log weight`);
});

module.exports = app;

