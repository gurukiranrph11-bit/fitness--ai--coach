/* ============================================================
   FitAI - Progress Visualization Engine
   Charts, predictive insights & weekly reports
   ============================================================ */

class ProgressTracker {
    constructor() {
        this.weightLog = [];
        this.workoutLog = [];
        this.charts = {};
        
        this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem('fital_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.weightLog = data.weightLog || [];
                this.workoutLog = data.workoutLog || [];
            }
        } catch (e) {
            console.log('Fresh progress data');
        }
    }

    saveState() {
        try {
            localStorage.setItem('fital_progress', JSON.stringify({
                weightLog: this.weightLog,
                workoutLog: this.workoutLog
            }));
        } catch (e) {
            console.error('Failed to save progress data', e);
        }
    }

    // ============================================================
    // DATA LOGGING
    // ============================================================
    logWeight(weight) {
        this.weightLog.push({
            date: new Date().toISOString(),
            weight: parseFloat(weight)
        });
        this.saveState();
    }

    logWorkoutSession(workoutData) {
        this.workoutLog.push({
            date: new Date().toISOString(),
            ...workoutData
        });
        this.saveState();
    }

    // ============================================================
    // CHART GENERATION
    // ============================================================
    generateWeightChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const data = this.getLastNWeightEntries(14);
        
        // Add some simulated data if no real data exists
        const labels = [];
        const values = [];
        
        if (data.length === 0) {
            // Generate demo data
            const baseWeight = 82;
            for (let i = 13; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                values.push(baseWeight + (Math.random() - 0.5) * 2);
            }
        } else {
            data.forEach(entry => {
                labels.push(new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                values.push(entry.weight);
            });
        }

        const ctx = canvas.getContext('2d');
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Weight (kg)',
                    data: values,
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6c5ce7',
                    pointBorderColor: '#6c5ce7',
                    pointRadius: 4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#6c6c8a' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6c6c8a' }
                    }
                }
            }
        });
    }

    generateConsistencyChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        // Generate weekly consistency data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const values = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toDateString();
            const hasWorkout = gamification.workoutDays.includes(dateStr);
            values.push(hasWorkout ? 100 : 0);
        }

        const ctx = canvas.getContext('2d');
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Workout Complete',
                    data: values,
                    backgroundColor: values.map(v => v > 0 ? 'rgba(0, 230, 118, 0.6)' : 'rgba(255, 107, 107, 0.2)'),
                    borderColor: values.map(v => v > 0 ? '#00e676' : '#ff6b6b'),
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { 
                            color: '#6c6c8a',
                            callback: function(value) { return value + '%'; }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6c6c8a' }
                    }
                }
            }
        });
    }

    generateDashboardChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const caloriesData = [];
        const minutesData = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toDateString();
            
            const dayWorkouts = this.workoutLog.filter(w => 
                new Date(w.date).toDateString() === dateStr
            );
            
            const dayCalories = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurn || 0), 0);
            const dayMinutes = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
            
            caloriesData.push(dayCalories || Math.round(Math.random() * 300));
            minutesData.push(dayMinutes || Math.round(Math.random() * 30));
        }

        const ctx = canvas.getContext('2d');
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Calories',
                        data: caloriesData,
                        backgroundColor: 'rgba(108, 92, 231, 0.6)',
                        borderColor: '#6c5ce7',
                        borderWidth: 1,
                        borderRadius: 4,
                        order: 1
                    },
                    {
                        label: 'Minutes',
                        data: minutesData,
                        type: 'line',
                        borderColor: '#00e676',
                        backgroundColor: 'rgba(0, 230, 118, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#00e676',
                        pointRadius: 4,
                        borderWidth: 2,
                        order: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#b0b0cc', font: { size: 11 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#6c6c8a' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6c6c8a' }
                    }
                }
            }
        });
    }

    // ============================================================
    // PREDICTIVE INSIGHTS
    // ============================================================
    getPredictiveInsight(profile) {
        if (!profile) {
            return "Complete your profile to see AI-powered predictive insights about your fitness journey! 🎯";
        }

        const workoutsThisWeek = this.getWorkoutsThisWeek();
        const consistency = (workoutsThisWeek.length / profile.daysPerWeek) * 100;
        
        // Generate prediction based on goal
        let prediction = "";
        
        if (profile.goal === 'weight_loss') {
            const currentWeight = parseFloat(profile.weight) || 70;
            const targetWeight = parseFloat(profile.targetWeight);
            
            if (targetWeight && targetWeight < currentWeight) {
                const weeklyLoss = consistency >= 80 ? 0.7 : consistency >= 50 ? 0.4 : 0.2;
                const weeksToGoal = Math.round((currentWeight - targetWeight) / weeklyLoss);
                
                if (weeksToGoal > 0 && weeksToGoal < 52) {
                    prediction = `📈 At your current pace (${consistency.toFixed(0)}% consistency), you're on track to reach your goal weight in approximately <strong>${weeksToGoal} weeks</strong>!`;
                    
                    if (consistency < 50) {
                        prediction += `<br><br>💡 <strong>Tip:</strong> Try to increase your workout frequency to at least ${profile.daysPerWeek} days per week for better results.`;
                    }
                } else {
                    prediction = `🎯 Stay consistent with your workouts and nutrition. You're building healthy habits that will lead to sustainable results!`;
                }
            } else {
                prediction = `🎯 Focus on maintaining a calorie deficit while hitting your protein targets. Consistency is key for weight loss!`;
            }
        } else if (profile.goal === 'muscle_gain') {
            prediction = `💪 You're building muscle! Focus on progressive overload - gradually increase weights or reps each week.<br><br>📊 <strong>Key focus:</strong> Hit your protein target (${nutritionEngine.macroTargets.protein}g) daily for optimal muscle growth.`;
        } else if (profile.goal === 'endurance') {
            prediction = `🏃 Your endurance is improving! Aim to gradually increase workout duration or intensity each week.<br><br>📊 <strong>Current consistency:</strong> ${workoutsThisWeek.length}/${profile.daysPerWeek} workouts this week.`;
        } else {
            prediction = `🌟 You're on a great path! Maintaining general fitness is all about consistency.<br><br>📊 You've completed ${gamification.totalWorkouts} workouts total. Keep it up!`;
        }
        
        return prediction;
    }

    getWorkoutsThisWeek() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        return this.workoutLog.filter(w => new Date(w.date) >= startOfWeek);
    }

    getLastNWeightEntries(n) {
        return this.weightLog.slice(-n);
    }

    // ============================================================
    // WEEKLY REPORT
    // ============================================================
    generateWeeklyReportHTML() {
        const report = gamification.generateWeeklyReport();
        const workoutsThisWeek = this.getWorkoutsThisWeek();
        const totalCalories = workoutsThisWeek.reduce((sum, w) => sum + (w.caloriesBurn || 0), 0);
        const totalMinutes = workoutsThisWeek.reduce((sum, w) => sum + (w.duration || 0), 0);
        
        return `
            <div class="report-stat">
                <span>📅 Workouts Completed</span>
                <span><strong>${report.workoutsCompleted}</strong></span>
            </div>
            <div class="report-stat">
                <span>🔥 Calories Burned</span>
                <span><strong>${totalCalories}</strong></span>
            </div>
            <div class="report-stat">
                <span>⏱️ Total Minutes</span>
                <span><strong>${totalMinutes}</strong></span>
            </div>
            <div class="report-stat">
                <span>📈 Consistency</span>
                <span><strong>${report.consistency}%</strong></span>
            </div>
            <div class="report-stat">
                <span>🏆 Current Streak</span>
                <span><strong>${report.streaks} days</strong></span>
            </div>
            <div class="report-stat" style="border: none; padding-bottom: 0;">
                <span>💪 <strong>Coach's Note:</strong></span>
            </div>
            <p style="padding: 0.5rem 0; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5;">
                ${report.recommendation}
            </p>
        `;
    }

    // ============================================================
    // MILESTONE CHECK
    // ============================================================
    checkMilestones() {
        const milestones = [];
        const totalWorkouts = gamification.totalWorkouts;
        const totalCalories = gamification.totalCaloriesBurned;
        
        if (totalWorkouts >= 5) milestones.push({ icon: '🎉', text: 'Completed 5 workouts!' });
        if (totalWorkouts >= 10) milestones.push({ icon: '🎊', text: 'Double digits! 10 workouts done!' });
        if (totalWorkouts >= 25) milestones.push({ icon: '🏅', text: '25 workouts - you\'re a machine!' });
        if (totalWorkouts >= 50) milestones.push({ icon: '🏆', text: '50 workouts - legend status!' });
        
        if (totalCalories >= 1000) milestones.push({ icon: '🔥', text: 'Burned 1,000 calories total!' });
        if (totalCalories >= 5000) milestones.push({ icon: '🔥', text: 'Burned 5,000 calories - incredible!' });
        if (totalCalories >= 10000) milestones.push({ icon: '💪', text: '10,000 calorie burnout!' });
        
        if (gamification.longestStreak >= 3) milestones.push({ icon: '📅', text: `${gamification.longestStreak}-day streak!` });
        if (gamification.longestStreak >= 7) milestones.push({ icon: '🔥', text: 'One full week streak!' });
        if (gamification.longestStreak >= 30) milestones.push({ icon: '⚡', text: '30-day streak - unstoppable!' });
        
        return milestones;
    }
}

// Global instance
const progressTracker = new ProgressTracker();


