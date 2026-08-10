/* ============================================================
   FitAI - Gamification System
   Badges, Streaks, Challenges & Rewards
   ============================================================ */

class GamificationSystem {
    constructor() {
        this.badges = [
            { id: 'first_workout', name: 'First Step', icon: 'fas fa-shoe-prints', description: 'Complete your first workout', unlocked: false },
            { id: 'streak_3', name: 'Habit Builder', icon: 'fas fa-fire', description: '3-day streak', unlocked: false },
            { id: 'streak_7', name: 'Week Warrior', icon: 'fas fa-calendar-week', description: '7-day streak', unlocked: false },
            { id: 'streak_30', name: 'Iron Will', icon: 'fas fa-dragon', description: '30-day streak', unlocked: false },
            { id: 'calories_1000', name: 'Calorie Torch', icon: 'fas fa-bolt', description: 'Burn 1,000 total calories', unlocked: false },
            { id: 'calories_5000', name: 'Furnace Mode', icon: 'fas fa-fire-alt', description: 'Burn 5,000 total calories', unlocked: false },
            { id: 'workouts_10', name: 'Dedicated', icon: 'fas fa-medal', description: 'Complete 10 workouts', unlocked: false },
            { id: 'workouts_50', name: 'Fitness Freak', icon: 'fas fa-trophy', description: 'Complete 50 workouts', unlocked: false },
            { id: 'water_50', name: 'Hydration Hero', icon: 'fas fa-tint', description: 'Drink 50 glasses of water', unlocked: false },
            { id: 'meals_logged', name: 'Nutrition Ninja', icon: 'fas fa-apple-alt', description: 'Log 30 meals', unlocked: false },
            { id: 'perfect_week', name: 'Perfect Week', icon: 'fas fa-star', description: 'Complete all workouts in a week', unlocked: false },
            { id: 'early_bird', name: 'Early Bird', icon: 'fas fa-sun', description: 'Workout before 7 AM', unlocked: false },
            { id: 'night_owl', name: 'Night Owl', icon: 'fas fa-moon', description: 'Workout after 9 PM', unlocked: false },
            { id: 'challenger', name: 'Challenge Accepted', icon: 'fas fa-tasks', description: 'Complete a challenge', unlocked: false },
            { id: 'milestone_10kg', name: 'Weight Milestone', icon: 'fas fa-weight', description: 'Reach a weight milestone', unlocked: false }
        ];
        
        this.challenges = [
            { id: 'ch_7day', name: '7-Day Challenge', description: 'Complete a workout every day for 7 days', progress: 0, target: 7, reward: '🌟 Champion badge', active: true },
            { id: 'ch_30day', name: '30-Day Transformation', description: 'Complete 20 workouts in 30 days', progress: 0, target: 20, reward: '🏆 Transformation badge', active: true },
            { id: 'ch_cardio', name: 'Cardio King', description: 'Burn 2,000 calories through cardio', progress: 0, target: 2000, reward: '❤️ Cardio badge', active: false },
            { id: 'ch_strength', name: 'Strength Builder', description: 'Complete 15 strength workouts', progress: 0, target: 15, reward: '💪 Strength badge', active: false },
            { id: 'ch_hydration', name: 'Hydration Station', description: 'Drink water 8 days straight', progress: 0, target: 8, reward: '💧 Hydration badge', active: true }
        ];
        
        this.streak = 0;
        this.longestStreak = 0;
        this.totalWorkouts = 0;
        this.totalCaloriesBurned = 0;
        this.totalMealsLogged = 0;
        this.totalWaterGlasses = 0;
        this.workoutDays = [];
        this.lastWorkoutDate = null;
        
        this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem('fital_gamification');
            if (saved) {
                const data = JSON.parse(saved);
                this.badges = data.badges || this.badges;
                this.challenges = data.challenges || this.challenges;
                this.streak = data.streak || 0;
                this.longestStreak = data.longestStreak || 0;
                this.totalWorkouts = data.totalWorkouts || 0;
                this.totalCaloriesBurned = data.totalCaloriesBurned || 0;
                this.totalMealsLogged = data.totalMealsLogged || 0;
                this.totalWaterGlasses = data.totalWaterGlasses || 0;
                this.workoutDays = data.workoutDays || [];
                this.lastWorkoutDate = data.lastWorkoutDate || null;
            }
        } catch (e) {
            console.log('Fresh start - no saved gamification data');
        }
    }

    saveState() {
        try {
            localStorage.setItem('fital_gamification', JSON.stringify({
                badges: this.badges,
                challenges: this.challenges,
                streak: this.streak,
                longestStreak: this.longestStreak,
                totalWorkouts: this.totalWorkouts,
                totalCaloriesBurned: this.totalCaloriesBurned,
                totalMealsLogged: this.totalMealsLogged,
                totalWaterGlasses: this.totalWaterGlasses,
                workoutDays: this.workoutDays,
                lastWorkoutDate: this.lastWorkoutDate
            }));
        } catch (e) {
            console.error('Failed to save gamification data', e);
        }
    }

    // ============================================================
    // STREAK MANAGEMENT
    // ============================================================
    logWorkout() {
        const today = new Date().toDateString();
        
        // Check if already logged today
        if (this.lastWorkoutDate === today) return;
        
        this.totalWorkouts++;
        this.workoutDays.push(today);
        
        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (this.lastWorkoutDate === yesterdayStr) {
            this.streak++;
        } else if (this.lastWorkoutDate !== today) {
            this.streak = 1;
        }
        
        if (this.streak > this.longestStreak) {
            this.longestStreak = this.streak;
        }
        
        this.lastWorkoutDate = today;
        
        // Check challenges
        this.checkChallenges();
        this.checkBadges();
        this.saveState();
    }

    logCalories(amount) {
        this.totalCaloriesBurned += amount;
        this.checkBadges();
        this.saveState();
    }

    logMeal() {
        this.totalMealsLogged++;
        this.checkBadges();
        this.saveState();
    }

    logWater() {
        this.totalWaterGlasses++;
        this.checkBadges();
        this.saveState();
    }

    // ============================================================
    // BADGE SYSTEM
    // ============================================================
    checkBadges() {
        const newlyUnlocked = [];
        
        this.badges.forEach(badge => {
            if (badge.unlocked) return;
            
            let shouldUnlock = false;
            
            switch (badge.id) {
                case 'first_workout':
                    shouldUnlock = this.totalWorkouts >= 1;
                    break;
                case 'streak_3':
                    shouldUnlock = this.streak >= 3 || this.longestStreak >= 3;
                    break;
                case 'streak_7':
                    shouldUnlock = this.streak >= 7 || this.longestStreak >= 7;
                    break;
                case 'streak_30':
                    shouldUnlock = this.streak >= 30 || this.longestStreak >= 30;
                    break;
                case 'calories_1000':
                    shouldUnlock = this.totalCaloriesBurned >= 1000;
                    break;
                case 'calories_5000':
                    shouldUnlock = this.totalCaloriesBurned >= 5000;
                    break;
                case 'workouts_10':
                    shouldUnlock = this.totalWorkouts >= 10;
                    break;
                case 'workouts_50':
                    shouldUnlock = this.totalWorkouts >= 50;
                    break;
                case 'water_50':
                    shouldUnlock = this.totalWaterGlasses >= 50;
                    break;
                case 'meals_logged':
                    shouldUnlock = this.totalMealsLogged >= 30;
                    break;
                case 'perfect_week': {
                    // Check if all workout days in current week are completed
                    const today = new Date();
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay());
                    const weekDays = [];
                    for (let i = 0; i < 7; i++) {
                        const d = new Date(startOfWeek);
                        d.setDate(startOfWeek.getDate() + i);
                        weekDays.push(d.toDateString());
                    }
                    shouldUnlock = weekDays.every(d => this.workoutDays.includes(d));
                    break;
                }
                case 'early_bird': {
                    const hour = new Date().getHours();
                    shouldUnlock = hour < 7 && this.workoutDays.includes(new Date().toDateString());
                    break;
                }
                case 'night_owl': {
                    const hour = new Date().getHours();
                    shouldUnlock = hour >= 21 && this.workoutDays.includes(new Date().toDateString());
                    break;
                }
                case 'challenger':
                    shouldUnlock = this.challenges.some(c => c.progress >= c.target);
                    break;
            }
            
            if (shouldUnlock) {
                badge.unlocked = true;
                newlyUnlocked.push(badge);
            }
        });
        
        if (newlyUnlocked.length > 0) {
            this.showBadgeUnlock(newlyUnlocked);
        }
        
        return newlyUnlocked;
    }

    showBadgeUnlock(badges) {
        badges.forEach(badge => {
            // Dispatch custom event for UI to handle
            const event = new CustomEvent('badgeUnlocked', { 
                detail: badge 
            });
            document.dispatchEvent(event);
        });
    }

    // ============================================================
    // CHALLENGE SYSTEM
    // ============================================================
    checkChallenges() {
        this.challenges.forEach(challenge => {
            if (challenge.progress >= challenge.target) return;
            
            switch (challenge.id) {
                case 'ch_7day':
                    challenge.progress = Math.min(challenge.target, this.streak);
                    break;
                case 'ch_30day':
                    challenge.progress = Math.min(challenge.target, this.totalWorkouts);
                    break;
                case 'ch_cardio':
                    // Would be updated with actual cardio tracking
                    break;
                case 'ch_strength':
                    // Would be updated with strength workout tracking
                    break;
                case 'ch_hydration':
                    challenge.progress = Math.min(challenge.target, this.totalWaterGlasses);
                    break;
            }
            
            if (challenge.progress >= challenge.target && !challenge.completed) {
                challenge.completed = true;
                this.showChallengeComplete(challenge);
            }
        });
    }

    showChallengeComplete(challenge) {
        const event = new CustomEvent('challengeComplete', { 
            detail: challenge 
        });
        document.dispatchEvent(event);
    }

    // ============================================================
    // RENDER HELPERS
    // ============================================================
    getUnlockedBadges() {
        return this.badges.filter(b => b.unlocked);
    }

    getLockedBadges() {
        return this.badges.filter(b => !b.unlocked);
    }

    getActiveChallenges() {
        return this.challenges.filter(c => c.active && (c.progress < c.target || !c.completed));
    }

    getCompletedChallenges() {
        return this.challenges.filter(c => c.completed);
    }

    renderBadges() {
        const grid = document.getElementById('badges-grid');
        if (!grid) return '';
        
        let html = '';
        this.badges.forEach(badge => {
            html += `
                <div class="badge-item ${badge.unlocked ? 'unlocked' : 'locked'}" title="${badge.description}">
                    <i class="${badge.icon}" style="font-size: 1.8rem; margin-bottom: 0.3rem; display: block;"></i>
                    <span class="badge-name">${badge.name}</span>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        return html;
    }

    renderChallenges() {
        const list = document.getElementById('challenge-list');
        if (!list) return '';
        
        const active = this.getActiveChallenges();
        if (active.length === 0) {
            list.innerHTML = '<p class="text-muted">No active challenges. Check back soon!</p>';
            return;
        }
        
        let html = '';
        active.forEach(challenge => {
            const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
            html += `
                <div class="challenge-item">
                    <div class="challenge-header">
                        <span class="challenge-name">${challenge.name}</span>
                        <span class="challenge-reward">${challenge.reward}</span>
                    </div>
                    <p class="challenge-desc">${challenge.description}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <span class="challenge-progress">${challenge.progress}/${challenge.target}</span>
                </div>
            `;
        });
        
        list.innerHTML = html;
        return html;
    }

    // ============================================================
    // WEEKLY REPORT GENERATION
    // ============================================================
    generateWeeklyReport() {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        
        const weekWorkouts = this.workoutDays.filter(d => {
            const date = new Date(d);
            return date >= weekStart;
        });
        
        const report = {
            workoutsCompleted: weekWorkouts.length,
            streaks: this.streak,
            badgesEarned: this.getUnlockedBadges().length,
            caloriesBurned: this.totalCaloriesBurned,
            challengesCompleted: this.getCompletedChallenges().length,
            consistency: Math.round((weekWorkouts.length / 7) * 100),
            recommendation: ''
        };
        
        if (report.workoutsCompleted === 0) {
            report.recommendation = "Start with a simple goal: Complete 3 workouts this week! 🎯";
        } else if (report.consistency >= 80) {
            report.recommendation = "Amazing consistency! Try increasing intensity next week 🚀";
        } else if (report.consistency >= 50) {
            report.recommendation = "Good progress! Aim for one more workout day this week 💪";
        } else {
            report.recommendation = "Every workout counts! Try adding just one more day 🔥";
        }
        
        return report;
    }
}

// Global instance
const gamification = new GamificationSystem();

