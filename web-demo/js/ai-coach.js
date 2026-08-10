/* ============================================================
   FitAI - AI Coach Engine v2.0
   Intelligent workout planning, adaptation & guidance
   Answers ANY fitness question with NLP intent classification
   ============================================================ */

class AICoach {
    constructor() {
        this.userProfile = null;
        this.workoutPlans = {};
        this.workoutHistory = [];
        this.conversationHistory = [];
        this.recoveryMessages = [
            "Rest is part of the process. Your muscles grow while you recover!",
            "Active recovery: A light walk or stretching can help!",
            "Stay hydrated and get good sleep tonight!",
            "Listen to your body. Recovery is training too!",
            "Foam rolling and stretching will help reduce soreness!"
        ];
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
                { name: "Bicep Curls", sets: 3, reps: "12-15", muscle: "Biceps", type: "strength" },
                { name: "Tricep Dips", sets: 3, reps: "10-12", muscle: "Triceps", type: "strength" },
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
                { name: "Tricep Pushdowns", sets: 3, reps: "12-15", muscle: "Triceps", type: "strength" },
                { name: "Lateral Raises", sets: 3, reps: "15", muscle: "Shoulders", type: "strength" }
            ],
            lower_body: [
                { name: "Squats", sets: 3, reps: "15-20", muscle: "Quadriceps, Glutes", type: "strength" },
                { name: "Romanian Deadlifts", sets: 3, reps: "12", muscle: "Hamstrings, Glutes", type: "strength" },
                { name: "Walking Lunges", sets: 3, reps: "12 each", muscle: "Legs, Glutes", type: "strength" },
                { name: "Leg Press", sets: 3, reps: "12-15", muscle: "Quadriceps", type: "strength" },
                { name: "Calf Raises", sets: 3, reps: "20", muscle: "Calves", type: "strength" },
                { name: "Glute Bridges", sets: 3, reps: "15", muscle: "Glutes", type: "strength" },
                { name: "Bulgarian Split Squats", sets: 3, reps: "10 each", muscle: "Legs, Glutes", type: "strength" }
            ],
            cardio: [
                { name: "Jumping Jacks", sets: 3, reps: "45 sec", muscle: "Full Body", type: "cardio" },
                { name: "High Knees", sets: 3, reps: "30 sec", muscle: "Legs, Core", type: "cardio" },
                { name: "Burpees", sets: 3, reps: "10-15", muscle: "Full Body", type: "cardio" },
                { name: "Mountain Climbers", sets: 3, reps: "30 sec", muscle: "Full Body", type: "cardio" },
                { name: "Jump Rope", sets: 3, reps: "60 sec", muscle: "Full Body", type: "cardio" },
                { name: "Box Jumps", sets: 3, reps: "10-12", muscle: "Legs", type: "cardio" }
            ],
            core: [
                { name: "Plank", sets: 3, reps: "30-60 sec", muscle: "Core", type: "core" },
                { name: "Russian Twists", sets: 3, reps: "20", muscle: "Obliques", type: "core" },
                { name: "Leg Raises", sets: 3, reps: "15", muscle: "Lower Abs", type: "core" },
                { name: "Bicycle Crunches", sets: 3, reps: "20", muscle: "Core", type: "core" },
                { name: "Dead Bug", sets: 3, reps: "12 each", muscle: "Core", type: "core" }
            ]
        };
    }

    initializePlan(profile) {
        this.userProfile = profile;
        this.workoutPlans = this.generateWeeklyPlan(profile);
        this.workoutHistory = [];
        return this.workoutPlans;
    }

    generateWeeklyPlan(profile) {
        const { fitnessLevel, goal, daysPerWeek, duration, weight } = profile;
        const weeklyPlan = {};
        const exercises = this._selectExercises(goal);
        const intensity = this._calcIntensity(fitnessLevel);
        const workoutDays = this._distributeDays(daysPerWeek);

        workoutDays.forEach((idx, i) => {
            const focus = this._getFocus(i, daysPerWeek, goal);
            const dayExercises = this._createWorkout(exercises, focus, fitnessLevel, duration);
            weeklyPlan[idx] = {
                day: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][idx],
                focus, exercises: dayExercises, duration, intensity,
                caloriesBurn: this._estimateCal(dayExercises, parseInt(weight)||70),
                completed: false, logged: false
            };
        });
        for (let i = 0; i < 7; i++) {
            if (!weeklyPlan[i]) weeklyPlan[i] = {
                day: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][i],
                focus: 'rest', exercises: [], duration: 0, intensity: 'rest', caloriesBurn: 0,
                completed: false, logged: false, recoveryTip: this.getRecoveryTip()
            };
        }
        return weeklyPlan;
    }

    _selectExercises(goal) {
        let s = JSON.parse(JSON.stringify(this.exerciseLibrary));
        if (goal === 'weight_loss') s.full_body.push(...s.cardio.slice(0,3));
        if (goal === 'muscle_gain') s.full_body = s.full_body.map(e => ({
            ...e, reps: e.reps.replace(/\d+/g, m => Math.max(6,parseInt(m)-4))
        }));
        return s;
    }

    _calcIntensity(level) {
        const m = { beginner:{label:'Low',value:0.6}, intermediate:{label:'Moderate',value:0.75}, advanced:{label:'High',value:0.9} };
        return m[level]||m.beginner;
    }

    _distributeDays(n) {
        const days=[], gap=7/n, t=new Date().getDay();
        for(let i=0;i<n;i++) days.push(Math.round(i*gap)%7);
        if(!days.includes(t)) days[0]=t;
        return [...new Set(days)].sort();
    }

    _getFocus(i,t,g) {
        if(t<=2) return 'full_body';
        if(g==='weight_loss') return ['full_body','cardio','lower_body','full_body','cardio','upper_body','full_body'][i%7];
        if(g==='muscle_gain') return ['upper_body','lower_body','full_body','upper_body','lower_body','full_body','rest'][i%7];
        return ['full_body','upper_body','lower_body','full_body','upper_body','lower_body','cardio'][i%7];
    }

    _createWorkout(ex, focus, level, dur) {
        const pool = ex[focus]||ex.full_body;
        const n = Math.max(4,Math.min(8,Math.floor(dur/7)));
        return [...pool].sort(()=>Math.random()-0.5).slice(0,n).map(e => {
            let r=e.reps, s=e.sets;
            if(level==='beginner'){s=Math.max(2,e.sets-1); r=e.reps.replace(/\d+/g,m=>Math.max(6,parseInt(m)-4));}
            if(level==='advanced'){s=e.sets+1; r=e.reps.replace(/\d+/g,m=>parseInt(m)+3);}
            return {...e, sets:s, reps:r, completed:false, restTime:60};
        });
    }

    _estimateCal(ex, w) {
        const METs={strength:5.0,cardio:8.0,core:3.5};
        return ex.reduce((t,e)=>{
            const met=METs[e.type]||4.0, dur=e.reps.includes('sec')?parseInt(e.reps):45;
            return t+((met*3.5*w)/200)*(dur/60)*e.sets;
        },0)|0;
    }

    getRecoveryTip() {
        const tips = ["Active recovery: Light 20-min walk","Stretch worked muscles","Foam rolling reduces soreness","Hydrate + protein for repair","Yoga/swimming for active recovery","7-9hr sleep for muscle repair"];
        return tips[Math.floor(Math.random()*tips.length)];
    }

    adaptPlan(feedback) {
        if(!this.userProfile) return null;
        const curr = this.workoutPlans[new Date().getDay()]?.intensity?.value||0.7;
        let nv = curr;
        if(feedback==='too_easy') nv=Math.min(1,curr+0.1);
        if(feedback==='too_hard') nv=Math.max(0.4,curr-0.1);
        if(nv!==curr) {
            this.userProfile.fitnessLevel = nv>=0.85?'advanced':nv>=0.65?'intermediate':'beginner';
            this.generateWeeklyPlan(this.userProfile);
            return {adjusted:true, message:nv>curr?"Intensity increased!":"Adjusted to be easier"};
        }
        return {adjusted:false, message:"Right on track!"};
    }

    processMessage(message) {
        this.conversationHistory.push({ role: 'user', content: message });
        const t = message.toLowerCase().trim();
        const intent = this._classifyIntent(t);
        let response = this._handleIntent(intent, t);
        this.conversationHistory.push({ role: 'ai', content: response.text });
        return response;
    }

    _classifyIntent(text) {
        const patterns = {
            workout_plan: /plan|workout|routine|exercises|train|gym|session|today|tomorrow|this week/,
            nutrition: /meal|food|eat|nutrition|diet|calorie|protein|carb|fat|macro|recipe|breakfast|lunch|dinner|snack|hungry/,
            progress: /progress|improving|how am i|results|track|stats|improve|growth/,
            motivation: /motivate|tired|struggling|lazy|give up|quit|bored|hard|difficult|exhausted/,
            recovery: /sore|recovery|rest|pain|hurt|aching|soreness|recover/,
            sleep: /sleep|insomnia|tired|fatigue|bed|night|wake/,
            supplements: /supplement|creatine|protein powder|pre.?workout|bcaa|vitamin|whey/,
            technique: /form|technique|proper|posture|alignment|squat|deadlift|bench|push.?up|pull.?up|plank|lunge/,
            strength: /strength|weight training|lifting|heavy|muscle|gym/,
            cardio: /cardio|aerobic|running|cycling|swimming|jump rope|heart/,
            warmup: /warm.?up|stretch before|pre.?workout|dynamic/,
            cooldown: /cool.?down|stretch after|static/,
            hydration: /water|hydrate|hydration|drink|thirsty/,
            bodyweight: /bodyweight|calisthenics|home workout|no equipment|at home/,
            schedule: /schedule|how often|frequency|per week|split/,
            endurance: /endurance|stamina|conditioning/,
            greeting: /^(hi|hello|hey|yo|sup|howdy|good morning|good evening)/,
            thanks: /thanks|thank you|thx|appreciate|helpful/,
            capabilities: /what can you do|help|capabilities|features|options|how can you help/,
            weight_loss: /lose weight|fat loss|weight loss|burn fat|get lean/,
            muscle_gain: /build muscle|muscle gain|bulk|get big|grow muscle|mass/
        };

        let scores = {};
        for (const [intent, regex] of Object.entries(patterns)) {
            const match = text.match(regex);
            if (match) scores[intent] = match[0].length * 10;
        }
        if (Object.keys(scores).length === 0) return 'general';
        return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
    }

    _handleIntent(intent, text) {
        const knowledge = {
            strength: "Strength Training - 2-4x/week. Progressive overload: gradually increase weight/reps. Rep ranges: 1-5 for strength, 6-12 for muscle growth, 15+ for endurance. Key lifts: Squat, Deadlift, Bench Press. Rest 2-3min between sets.",
            cardio: "Cardio Training - 150min moderate or 75min vigorous/week for heart health. Mix steady-state (running, cycling) with HIIT (intervals) for best fat burning and endurance results.",
            warmup: "Warm-up: 5-10min of dynamic stretches (arm circles, leg swings) and light cardio (jumping jacks). Do NOT static stretch before exercise - it reduces power output.",
            cooldown: "Cool-down: 5-10min of static stretching after workout. Hold each stretch 15-30 seconds. Focus on worked muscles. Improves flexibility and reduces next-day soreness.",
            hydration: "Hydration: Drink 2-3L water daily. Before workout: 500ml 2hr prior. During: 200ml every 15min. After: 500ml per 0.5kg lost. Check urine color - pale yellow is ideal.",
            sleep: "Sleep: 7-9 hours for muscle repair and growth hormone release. Poor sleep reduces workout performance by 20-30%. Tips: consistent schedule, no screens before bed, cool room.",
            supplements: "Supplements: Whey protein (20-30g post-workout) and Creatine (3-5g daily) are proven effective. Vitamin D if deficient. Skip fat burners and mystery blends.",
            bodyweight: "Bodyweight Routine: Push-ups 3x8-12, Squats 3x15-20, Plank 3x30sec, Glute bridges 3x15. Progress by adding reps, trying harder variations, reducing rest.",
            schedule: "Schedule: Beginner 3x/week full body. Intermediate 4x/week upper/lower. Advanced 5-6x/week push/pull/legs. Best time = whatever you can consistently stick to.",
            endurance: "Endurance: LISS builds aerobic base. Tempo runs improve lactate threshold. HIIT boosts VO2 max. Increase weekly mileage by no more than 10% to avoid injury."
        };

        switch (intent) {
            case 'greeting':
                return { text: "Hey there! I'm your AI fitness coach. I can help with workout plans, nutrition, progress tracking, motivation, sleep, supplements, and more. What would you like to know?", type: 'greeting' };
            case 'thanks':
                return { text: "You're welcome! Keep crushing your goals!", type: 'thanks' };
            case 'capabilities':
                return { text: "I can help with: Workout plans & exercises, Nutrition & meal ideas, Progress tracking, Sleep & recovery, Supplements, Proper form & technique, Weight loss & muscle building, Motivation. Just ask me anything fitness-related!", type: 'info' };
            case 'workout_plan':
                return this._handleWorkoutPlan(text);
            case 'progress':
                return this._getProgress();
            case 'motivation':
                return { text: "Push through! The only bad workout is the one you didn't do. Set small goals, track progress, find a buddy, remember your why. Action creates motivation - just start with 5 minutes!", type: 'motivation' };
            case 'recovery':
                return { text: "Recovery: DOMS lasts 24-72hr - normal! Light stretching, foam rolling, Epsom bath help. Active recovery: walking, swimming, yoga. Sharp pain = STOP. Protein + hydration + sleep = best recovery.", type: 'recovery' };
            case 'technique':
                return this._handleTechnique(text);
            case 'weight_loss':
                return { text: "Weight Loss: 300-500 cal deficit/day = 0.5-1kg/week. Prioritize protein & veggies. Drink water before meals. Combine strength + cardio. Sleep 7-9hr. Avoid crash diets - sustainable habits win.", type: 'info' };
            case 'muscle_gain':
                return { text: "Muscle Building: Calorie surplus 200-400/day. Eat 1.6-2.2g protein/kg. Progressive overload each week. Carbs around workouts for energy. Sleep 7-9hr for growth hormone. Realistic: 0.25-0.5kg muscle/month.", type: 'info' };
            case 'nutrition':
                return this._handleNutrition(text);
            default:
                if (knowledge[intent]) return { text: knowledge[intent], type: 'info' };
                return this._handleGeneral(text);
        }
    }

    _handleWorkoutPlan(query) {
        if (!this.userProfile) {
            return { text: "I'd love to create a workout plan! First complete your profile in the Onboarding section so I can tailor it to your goals.", type: 'info' };
        }
        const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
        let target = new Date().getDay();
        if (query.includes('tomorrow')) target = (target+1)%7;
        days.forEach((d,i) => { if(query.includes(d)) target=i; });
        const plan = this.workoutPlans[target];
        if (!plan || plan.focus === 'rest') {
            const dayName = days[target].charAt(0).toUpperCase()+days[target].slice(1);
            return { text: `${dayName} is a Rest Day - Active recovery like walking or stretching helps repair and growth! Use rest days for nutrition and sleep focus.`, type: 'plan' };
        }
        return {
            text: `${plan.day}'s Workout: ${plan.focus.replace('_',' ').toUpperCase()} - ${plan.intensity.label} intensity, ${plan.duration}min, ${plan.caloriesBurn} cal\n\nExercises:\n${plan.exercises.map((e,i)=>`${i+1}. ${e.name} - ${e.sets}x${e.reps}`).join('\n')}\n\nReady to crush it!`,
            type: 'plan'
        };
    }

    _getProgress() {
        const c = this.workoutHistory.length;
        const cal = this.workoutHistory.reduce((s,w)=>s+(w.caloriesBurn||0),0);
        if (c === 0) return { text: "No workouts logged yet! Start with today's workout and I'll track your progress.", type: 'info' };
        return { text: `Progress Report: ${c} workouts completed, ${cal} calories burned total. Keep pushing forward!`, type: 'progress' };
    }

    _handleNutrition(query) {
        const meals = {
            breakfast: "Power Protein Oatmeal - Oats + protein powder + berries + almond butter",
            lunch: "Grilled Chicken Buddha Bowl - Chicken + quinoa + avocado + sweet potato + kale",
            dinner: "Salmon with Roasted Veggies - Salmon + asparagus + cherry tomatoes + lemon",
            snack: "Greek Yogurt Power Bowl - Yogurt + berries + granola + honey + chia seeds"
        };
        for (const [type, food] of Object.entries(meals)) {
            if (query.includes(type)) return { text: `${type.charAt(0).toUpperCase()+type.slice(1)} idea: ${food}`, type: 'nutrition' };
        }
        return { text: "Nutrition tip: Eat protein with every meal, prioritize veggies, drink 2-3L water, time carbs around workouts. Want a specific meal idea? Ask for breakfast, lunch, dinner, or snack!", type: 'nutrition' };
    }

    _handleTechnique(query) {
        const guides = {
            squat: "Squat Form: Feet shoulder-width, chest up, hips back, knees tracking toes, drive through heels. Common mistakes: knees caving in, rounding lower back.",
            deadlift: "Deadlift Form: Bar over mid-foot, back straight, hinge at hips, drive through floor, bar stays close to body. Common mistakes: rounding back, jerking the weight.",
            'bench press': "Bench Press: Retract scapula, bar to mid-chest, elbows 45 degrees, press up and back. Common mistakes: flaring elbows, bouncing bar off chest.",
            'push up': "Push-up Form: Hands wider than shoulders, body straight line, lower chest to ground, push explosively. Common mistakes: sagging hips, flaring elbows.",
            plank: "Plank Form: Forearms on ground under shoulders, body straight line, squeeze glutes, brace core. Common mistakes: sagging back, raising hips too high."
        };
        for (const [ex, guide] of Object.entries(guides)) {
            if (query.includes(ex)) return { text: guide, type: 'technique' };
        }
        return { text: "Ask me about form for: squat, deadlift, bench press, push-up, or plank for detailed guides!", type: 'info' };
    }

    _handleGeneral(query) {
        const muscles = {
            chest: "Chest: Bench Press, Push-ups, Dumbbell Flyes. 10-12 reps, 3-4 sets, 2x/week.",
            back: "Back: Pull-ups, Bent Over Rows, Deadlifts, Seated Rows. 8-12 reps, 3-4 sets, 2x/week.",
            legs: "Legs: Squats, Deadlifts, Lunges, Leg Press. 8-15 reps, 3-4 sets, 2x/week.",
            arms: "Arms: Bicep Curls, Tricep Dips, Chin-ups, Hammer Curls. 10-15 reps, 3-4 sets, 2x/week.",
            shoulders: "Shoulders: Overhead Press, Lateral Raises, Front Raises, Face Pulls. 10-15 reps, 3-4 sets, 2x/week.",
            abs: "Core: Planks, Crunches, Leg Raises, Russian Twists. 15-20 reps, 3 sets, 3x/week."
        };
        for (const [muscle, exercises] of Object.entries(muscles)) {
            if (query.includes(muscle)) return { text: exercises, type: 'exercise' };
        }
        return { text: "I can help with workouts, nutrition, progress, motivation, recovery, sleep, supplements, form, and more! Try asking: 'Plan a workout', 'What should I eat?', 'How do I squat?', or 'Motivate me!'", type: 'general' };
    }

    getDailyNudge(hour) {
        if (this.userProfile) {
            const today = new Date().getDay();
            const plan = this.workoutPlans[today];
            if (plan && plan.focus !== 'rest' && !plan.completed) {
                const nudges = [
                    "Your workout is waiting! Let's go! 💪",
                    "Time to crush your fitness goals! 🔥",
                    "Today's workout will make you stronger! ⚡",
                    "You've got this! Start your workout now! 🚀",
                    "Every rep brings you closer to your goal! 🎯"
                ];
                return nudges[Math.floor(Math.random() * nudges.length)];
            }
        }
        if (hour < 12) return "Good morning! Start your day with energy! ☀️";
        if (hour >= 17) return "Evening workout time! Burn that dinner! 🌙";
        return "Perfect time for a workout! Let's go! 💪";
    }

    getMotivationalMessage() {
        const messages = [
            "The only bad workout is the one you didn't do! 💪",
            "You are stronger than you think! 🔥",
            "Progress, not perfection! Keep going! 🚀",
            "Every rep counts! You're building something great! ⚡",
            "Your future self will thank you! 🌟",
            "Small steps lead to big results! Keep pushing! 🎯",
            "Believe in yourself! You've got this! 💪",
            "Discipline is doing what needs to be done! 🔥"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    getQuickTip() {
        const tips = [
            "💡 Drink water before, during, and after your workout",
            "💡 Warm up for 5-10 minutes before exercising",
            "💡 Stretch after your workout to improve flexibility",
            "💡 Eat protein within 30 minutes post-workout",
            "💡 Get 7-9 hours of sleep for optimal recovery",
            "💡 Track your progress to stay motivated"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    getRecoveryAdvice() {
        return {
            text: this.getRecoveryTip(),
            type: 'recovery'
        };
    }
}

const aiCoach = new AICoach();
