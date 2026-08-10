/* ============================================================
   FitAI - Nutrition Guidance Engine
   Meal suggestions, macro tracking & corrective advice
   ============================================================ */

class NutritionEngine {
    constructor() {
        this.meals = [];
        this.waterGlasses = 0;
        this.macroTargets = { calories: 2000, protein: 150, carbs: 200, fat: 65 };
        this.macroConsumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        
        this.mealSuggestions = {
            breakfast: [
                { name: "Greek Yogurt Parfait", calories: 320, protein: 22, carbs: 35, fat: 10, icon: "🥣" },
                { name: "Oatmeal with Berries", calories: 290, protein: 12, carbs: 48, fat: 6, icon: "🥣" },
                { name: "Scrambled Eggs on Toast", calories: 350, protein: 25, carbs: 25, fat: 16, icon: "🍳" },
                { name: "Protein Smoothie Bowl", calories: 380, protein: 30, carbs: 45, fat: 12, icon: "🥤" },
                { name: "Avocado Toast with Egg", calories: 340, protein: 18, carbs: 28, fat: 18, icon: "🥑" }
            ],
            lunch: [
                { name: "Grilled Chicken Salad", calories: 420, protein: 35, carbs: 20, fat: 22, icon: "🥗" },
                { name: "Quinoa Buddha Bowl", calories: 450, protein: 20, carbs: 55, fat: 18, icon: "🥣" },
                { name: "Turkey Wrap", calories: 390, protein: 28, carbs: 35, fat: 14, icon: "🌯" },
                { name: "Salmon with Rice", calories: 480, protein: 38, carbs: 40, fat: 16, icon: "🐟" },
                { name: "Lean Beef Stir-fry", calories: 440, protein: 35, carbs: 30, fat: 18, icon: "🥩" }
            ],
            dinner: [
                { name: "Baked Chicken with Veggies", calories: 460, protein: 40, carbs: 25, fat: 20, icon: "🍗" },
                { name: "Grilled Fish Tacos", calories: 410, protein: 32, carbs: 35, fat: 16, icon: "🌮" },
                { name: "Whole Wheat Pasta Bolognese", calories: 500, protein: 30, carbs: 55, fat: 16, icon: "🍝" },
                { name: "Stuffed Bell Peppers", calories: 420, protein: 28, carbs: 35, fat: 18, icon: "🫑" },
                { name: "Shrimp and Vegetable Curry", calories: 430, protein: 35, carbs: 30, fat: 18, icon: "🍛" }
            ],
            snack: [
                { name: "Apple with Almond Butter", calories: 220, protein: 7, carbs: 28, fat: 12, icon: "🍎" },
                { name: "Protein Bar", calories: 250, protein: 20, carbs: 30, fat: 8, icon: "🥤" },
                { name: "Mixed Nuts", calories: 180, protein: 6, carbs: 8, fat: 16, icon: "🥜" },
                { name: "Greek Yogurt with Honey", calories: 200, protein: 15, carbs: 25, fat: 5, icon: "🥣" },
                { name: "Hummus with Veggies", calories: 190, protein: 8, carbs: 22, fat: 10, icon: "🫘" }
            ]
        };
        
        this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem('fital_nutrition');
            if (saved) {
                const data = JSON.parse(saved);
                this.meals = data.meals || [];
                this.waterGlasses = data.waterGlasses || 0;
                this.macroConsumed = data.macroConsumed || { calories: 0, protein: 0, carbs: 0, fat: 0 };
            }
        } catch (e) {
            console.log('Fresh nutrition data');
        }
    }

    saveState() {
        try {
            localStorage.setItem('fital_nutrition', JSON.stringify({
                meals: this.meals,
                waterGlasses: this.waterGlasses,
                macroConsumed: this.macroConsumed
            }));
        } catch (e) {
            console.error('Failed to save nutrition data', e);
        }
    }

    // ============================================================
    // MACRO TARGETS (AI-Adjusted based on profile)
    // ============================================================
    setMacroTargets(profile) {
        const { weight, goal, fitnessLevel } = profile;
        const w = parseInt(weight) || 70;
        
        // Calculate BMR using Mifflin-St Jeor
        const bmr = 10 * w + 6.25 * 175 - 5 * 30 + 5; // Simplified
        
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            extreme: 1.9
        };
        
        const tdee = bmr * (activityMultipliers[fitnessLevel] || 1.55);
        
        let targets = {};
        
        switch (goal) {
            case 'weight_loss':
                targets.calories = Math.round(tdee - 500); // Deficit
                targets.protein = Math.round(w * 2.0); // High protein
                targets.carbs = Math.round((targets.calories * 0.3) / 4);
                targets.fat = Math.round((targets.calories * 0.3) / 9);
                break;
            case 'muscle_gain':
                targets.calories = Math.round(tdee + 300); // Surplus
                targets.protein = Math.round(w * 2.2);
                targets.carbs = Math.round((targets.calories * 0.45) / 4);
                targets.fat = Math.round((targets.calories * 0.25) / 9);
                break;
            case 'endurance':
                targets.calories = Math.round(tdee + 100);
                targets.protein = Math.round(w * 1.6);
                targets.carbs = Math.round((targets.calories * 0.55) / 4); // Higher carbs
                targets.fat = Math.round((targets.calories * 0.25) / 9);
                break;
            default:
                targets.calories = Math.round(tdee);
                targets.protein = Math.round(w * 1.8);
                targets.carbs = Math.round((targets.calories * 0.4) / 4);
                targets.fat = Math.round((targets.calories * 0.25) / 9);
        }
        
        this.macroTargets = targets;
        return targets;
    }

    // ============================================================
    // MEAL SUGGESTIONS
    // ============================================================
    getMealSuggestions() {
        const suggestions = {};
        
        for (const [mealType, meals] of Object.entries(this.mealSuggestions)) {
            // Pick 1-2 random meals for each type
            const shuffled = [...meals].sort(() => Math.random() - 0.5);
            suggestions[mealType] = shuffled.slice(0, 2);
        }
        
        return suggestions;
    }

    getPersonalizedMealSuggestion(goal) {
        // Adjust suggestions based on goal
        const suggestions = this.getMealSuggestions();
        
        if (goal === 'weight_loss') {
            // Prioritize lower calorie, high protein options
            for (const [type, meals] of Object.entries(suggestions)) {
                suggestions[type] = meals.sort((a, b) => 
                    (a.calories / a.protein) - (b.calories / b.protein)
                ).slice(0, 1);
            }
        } else if (goal === 'muscle_gain') {
            // Prioritize high protein options
            for (const [type, meals] of Object.entries(suggestions)) {
                suggestions[type] = meals.sort((a, b) => 
                    b.protein - a.protein
                ).slice(0, 1);
            }
        }
        
        return suggestions;
    }

    // ============================================================
    // MEAL LOGGING
    // ============================================================
    logMeal(meal) {
        const mealEntry = {
            ...meal,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        this.meals.push(mealEntry);
        this.macroConsumed.calories += parseInt(meal.calories) || 0;
        this.macroConsumed.protein += parseInt(meal.protein) || 0;
        this.macroConsumed.carbs += parseInt(meal.carbs) || 0;
        this.macroConsumed.fat += parseInt(meal.fat) || 0;
        
        this.saveState();
        gamification.logMeal();
        
        return this.getMacroStatus();
    }

    // ============================================================
    // WATER TRACKING
    // ============================================================
    drinkWater() {
        if (this.waterGlasses < 8) {
            this.waterGlasses++;
            this.saveState();
            gamification.logWater();
        }
        return this.waterGlasses;
    }

    // ============================================================
    // MACRO STATUS & ADVICE
    // ============================================================
    getMacroStatus() {
        return {
            consumed: { ...this.macroConsumed },
            targets: { ...this.macroTargets },
            percentages: {
                calories: Math.min(100, Math.round((this.macroConsumed.calories / this.macroTargets.calories) * 100)),
                protein: Math.min(100, Math.round((this.macroConsumed.protein / this.macroTargets.protein) * 100)),
                carbs: Math.min(100, Math.round((this.macroConsumed.carbs / this.macroTargets.carbs) * 100)),
                fat: Math.min(100, Math.round((this.macroConsumed.fat / this.macroTargets.fat) * 100))
            },
            remaining: {
                calories: Math.max(0, this.macroTargets.calories - this.macroConsumed.calories),
                protein: Math.max(0, this.macroTargets.protein - this.macroConsumed.protein),
                carbs: Math.max(0, this.macroTargets.carbs - this.macroConsumed.carbs),
                fat: Math.max(0, this.macroTargets.fat - this.macroConsumed.fat)
            }
        };
    }

    getNutritionAdvice() {
        const status = this.getMacroStatus();
        const advice = [];
        
        // Check if on track
        if (status.percentages.calories > 90) {
            advice.push({ type: 'warning', text: `You're almost at your calorie limit! ${status.remaining.calories} cal remaining` });
        } else if (status.percentages.calories < 40 && new Date().getHours() > 14) {
            advice.push({ type: 'info', text: `You haven't eaten much today. Try a balanced meal! 🥗` });
        }
        
        if (status.percentages.protein < 50 && status.remaining.protein > 50) {
            advice.push({ type: 'info', text: `Try to get more protein! Aim for ${status.remaining.protein}g more 🥩` });
        }
        
        if (status.percentages.carbs > 80) {
            advice.push({ type: 'warning', text: `High carb intake today. Balance with more protein and veggies! 🥦` });
        }
        
        if (this.waterGlasses < 4 && new Date().getHours() > 14) {
            advice.push({ type: 'warning', text: `Stay hydrated! You've only had ${this.waterGlasses} glasses of water 💧` });
        }
        
        if (advice.length === 0) {
            advice.push({ type: 'success', text: "Great nutrition today! Keep it up! 🌟" });
        }
        
        return advice;
    }

    // ============================================================
    // RESET DAILY
    // ============================================================
    resetDaily() {
        this.meals = [];
        this.waterGlasses = 0;
        this.macroConsumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        this.saveState();
    }
}

// Global instance
const nutritionEngine = new NutritionEngine();

