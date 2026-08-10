/* ============================================================
   FitAI - Main Application Controller
   UI logic, state management, navigation & event handling
   ============================================================ */

// ============================================================
// APPLICATION STATE
// ============================================================
const AppState = {
    user: null,
    currentScreen: 'dashboard',
    onboardingStep: 1,
    totalOnboardingSteps: 5,
    
    // Onboarding data
    onboarding: {
        age: null,
        gender: 'male',
        weight: null,
        height: null,
        fitnessLevel: null,
        activityLevel: 'moderate',
        goal: null,
        targetWeight: null,
        healthConditions: [],
        injuries: '',
        daysPerWeek: 3,
        duration: 45,
        workoutType: null
    },
    
    // Workout tracking
    activeWorkout: null,
    workoutTimer: null,
    workoutSeconds: 0,
    currentExercise: 0,
    isPaused: false,
    
    // Theme
    theme: 'dark'
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved state
    loadUserState();
    
    // Show splash then app
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        
        if (AppState.user) {
            showMainApp();
        } else {
            document.getElementById('screen-onboarding').style.display = 'flex';
        }
        
        document.getElementById('app').style.display = 'flex';
    }, 2000);
    
    // Listen for badge unlocks
    document.addEventListener('badgeUnlocked', (e) => {
        showBadgeToast(e.detail);
    });
    
    // Listen for challenge completes
    document.addEventListener('challengeComplete', (e) => {
        showChallengeToast(e.detail);
    });
    
    // Check for daily reset
    checkDailyReset();
    
    // Set up theme
    const savedTheme = localStorage.getItem('fital_theme') || 'dark';
    setTheme(savedTheme);
    
    // Set up duration display
    const durationInput = document.getElementById('input-duration');
    if (durationInput) {
        durationInput.addEventListener('input', function() {
            document.getElementById('duration-display').textContent = this.value + ' min';
        });
    }
}

function loadUserState() {
    try {
        const saved = localStorage.getItem('fital_user');
        if (saved) {
            AppState.user = JSON.parse(saved);
            AppState.onboarding = { ...AppState.onboarding, ...AppState.user };
        }
    } catch (e) {
        console.log('No saved user state');
    }
}

function saveUserState() {
    try {
        localStorage.setItem('fital_user', JSON.stringify(AppState.user));
    } catch (e) {
        console.error('Failed to save user state', e);
    }
}

function checkDailyReset() {
    const lastDate = localStorage.getItem('fital_last_date');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
        // Reset daily nutrition
        nutritionEngine.resetDaily();
        localStorage.setItem('fital_last_date', today);
    }
}

// ============================================================
// THEME
// ============================================================
function setTheme(theme) {
    AppState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fital_theme', theme);
    
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function toggleTheme() {
    setTheme(AppState.theme === 'dark' ? 'light' : 'dark');
}

// ============================================================
// SCREEN NAVIGATION
// ============================================================
function showScreen(screenName) {
    AppState.currentScreen = screenName;
    
    // Hide all screens
    document.querySelectorAll('.screen-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Show target screen
    const target = document.getElementById('screen-' + screenName);
    if (target) target.classList.add('active');
    
    // Update nav
    const navBtn = document.querySelector(`.nav-btn[data-screen="${screenName}"]`);
    if (navBtn) navBtn.classList.add('active');
    
    // Close profile dropdown
    document.getElementById('profile-dropdown')?.classList.remove('show');
    
    // Refresh screen content
    refreshScreen(screenName);
}

function refreshScreen(screenName) {
    switch (screenName) {
        case 'dashboard':
            refreshDashboard();
            break;
        case 'workout':
            refreshWorkout();
            break;
        case 'coach':
            refreshCoach();
            break;
        case 'nutrition':
            refreshNutrition();
            break;
        case 'progress':
            refreshProgress();
            break;
    }
}

// ============================================================
// ONBOARDING
// ============================================================
let selectedFitnessLevel = null;
let selectedGoal = null;
let selectedWorkoutType = null;
let selectedDays = [3]; // Default day 3 selected

function selectFitnessLevel(el) {
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedFitnessLevel = el.dataset.value;
}

function selectGoal(el) {
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedGoal = el.dataset.value;
}

function selectWorkoutType(el) {
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedWorkoutType = el.dataset.value;
}

function toggleDay(btn) {
    const day = parseInt(btn.dataset.day);
    const idx = selectedDays.indexOf(day);
    
    if (idx > -1) {
        if (selectedDays.length > 1) {
            selectedDays.splice(idx, 1);
            btn.classList.remove('active');
        }
    } else {
        selectedDays.push(day);
        btn.classList.add('active');
    }
    
    AppState.onboarding.daysPerWeek = selectedDays.length;
}

function nextOnboardingStep() {
    // Validate current step
    if (!validateOnboardingStep()) return;
    
    if (AppState.onboardingStep < AppState.totalOnboardingSteps) {
        // Save step data
        saveOnboardingStep();
        
        document.getElementById(`onboarding-step-${AppState.onboardingStep}`).style.display = 'none';
        AppState.onboardingStep++;
        document.getElementById(`onboarding-step-${AppState.onboardingStep}`).style.display = 'block';
        
        updateOnboardingUI();
    }
}

function prevOnboardingStep() {
    if (AppState.onboardingStep > 1) {
        document.getElementById(`onboarding-step-${AppState.onboardingStep}`).style.display = 'none';
        AppState.onboardingStep--;
        document.getElementById(`onboarding-step-${AppState.onboardingStep}`).style.display = 'block';
        
        updateOnboardingUI();
    }
}

function validateOnboardingStep() {
    const step = AppState.onboardingStep;
    
    switch (step) {
        case 1:
            const age = document.getElementById('input-age').value;
            const weight = document.getElementById('input-weight').value;
            if (!age || age < 10 || age > 120) {
                showToast('Please enter a valid age (10-120)', 'error');
                return false;
            }
            if (!weight || weight < 20 || weight > 300) {
                showToast('Please enter a valid weight (20-300 kg)', 'error');
                return false;
            }
            return true;
        case 2:
            if (!selectedFitnessLevel) {
                showToast('Please select your fitness level', 'error');
                return false;
            }
            return true;
        case 3:
            if (!selectedGoal) {
                showToast('Please select your fitness goal', 'error');
                return false;
            }
            return true;
        case 4:
            return true; // Health conditions optional
        case 5:
            if (!selectedWorkoutType) {
                showToast('Please select your preferred workout type', 'error');
                return false;
            }
            return true;
        default:
            return true;
    }
}

function saveOnboardingStep() {
    const step = AppState.onboardingStep;
    
    switch (step) {
        case 1:
            AppState.onboarding.age = parseInt(document.getElementById('input-age').value);
            AppState.onboarding.gender = document.getElementById('input-gender').value;
            AppState.onboarding.weight = parseInt(document.getElementById('input-weight').value);
            AppState.onboarding.height = parseInt(document.getElementById('input-height').value);
            break;
        case 2:
            AppState.onboarding.fitnessLevel = selectedFitnessLevel;
            AppState.onboarding.activityLevel = document.getElementById('input-activity').value;
            break;
        case 3:
            AppState.onboarding.goal = selectedGoal;
            AppState.onboarding.targetWeight = document.getElementById('input-target').value;
            break;
        case 4:
            const checkboxes = document.querySelectorAll('#onboarding-step-4 input[type="checkbox"]');
            AppState.onboarding.healthConditions = [];
            checkboxes.forEach(cb => {
                if (cb.checked) AppState.onboarding.healthConditions.push(cb.value);
            });
            AppState.onboarding.injuries = document.getElementById('input-injuries').value;
            break;
        case 5:
            AppState.onboarding.daysPerWeek = selectedDays.length;
            AppState.onboarding.duration = parseInt(document.getElementById('input-duration').value);
            AppState.onboarding.workoutType = selectedWorkoutType;
            break;
    }
}

function updateOnboardingUI() {
    // Update progress bar
    const progress = (AppState.onboardingStep / AppState.totalOnboardingSteps) * 100;
    document.getElementById('onboarding-progress-fill').style.width = progress + '%';
    document.getElementById('onboarding-step-text').textContent = `Step ${AppState.onboardingStep} of ${AppState.totalOnboardingSteps}`;
    
    // Update buttons
    document.getElementById('onboarding-prev').style.display = AppState.onboardingStep > 1 ? 'flex' : 'none';
    document.getElementById('onboarding-next').style.display = AppState.onboardingStep < AppState.totalOnboardingSteps ? 'flex' : 'none';
    document.getElementById('onboarding-finish').style.display = AppState.onboardingStep === AppState.totalOnboardingSteps ? 'flex' : 'none';
}

function finishOnboarding() {
    if (!validateOnboardingStep()) return;
    saveOnboardingStep();
    
    // Create user profile
    AppState.user = { ...AppState.onboarding };
    saveUserState();
    
    // Initialize AI Coach with profile
    aiCoach.initializePlan(AppState.user);
    
    // Set macro targets
    nutritionEngine.setMacroTargets(AppState.user);
    
    // Show main app
    showMainApp();
    
    showToast('Profile created! Your personalized fitness plan is ready! 🎉', 'success');
}

function showMainApp() {
    document.getElementById('screen-onboarding').style.display = 'none';
    document.getElementById('screen-main').style.display = 'flex';
    
    // Set user name
    document.getElementById('user-name-display').textContent = AppState.user?.name || getUserDefaultName();
    document.getElementById('user-avatar-text').textContent = (AppState.user?.name || 'U')[0].toUpperCase();
    
    // Refresh dashboard
    refreshDashboard();
}

function getUserDefaultName() {
    const names = ['Champion', 'Athlete', 'Warrior', 'Fitness Star', 'Hustler'];
    return names[Math.floor(Math.random() * names.length)];
}

// ============================================================
// DASHBOARD
// ============================================================
function refreshDashboard() {
    updateGreeting();
    updateStats();
    updateTodayWorkout();
    updateDashboardChart();
    updateAINudge();
    updateActivityList();
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    
    document.querySelector('.greeting h2').innerHTML = `${greeting}, <span id="user-name-display">${getUserDefaultName()}</span>! 👋`;
    
    // Daily motivation
    const motivation = aiCoach.getDailyNudge(hour);
    document.getElementById('daily-motivation').textContent = motivation;
}

function updateStats() {
    document.getElementById('streak-count').textContent = gamification.streak;
    document.getElementById('badge-count').textContent = gamification.getUnlockedBadges().length;
    
    // Calculate today's stats
    const today = new Date().toDateString();
    const todayWorkouts = progressTracker.workoutLog.filter(w => 
        new Date(w.date).toDateString() === today
    );
    
    const todayCalories = todayWorkouts.reduce((sum, w) => sum + (w.caloriesBurn || 0), 0);
    const todayMinutes = todayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    
    document.getElementById('today-calories').textContent = todayCalories || '--';
    document.getElementById('today-minutes').textContent = todayMinutes || '--';
}

function updateTodayWorkout() {
    const container = document.getElementById('today-workout-preview');
    const status = document.getElementById('workout-status');
    
    if (!AppState.user) {
        container.innerHTML = '<p class="text-muted">Complete onboarding to generate your plan</p>';
        return;
    }
    
    const today = new Date().getDay();
    const todaysPlan = aiCoach.workoutPlans[today];
    
    if (!todaysPlan || todaysPlan.focus === 'rest') {
        container.innerHTML = `
            <p>Today is a <strong>rest day</strong> 🧘</p>
            <p class="text-muted" style="font-size: 0.8rem; margin-top: 0.3rem;">${todaysPlan?.recoveryTip || 'Active recovery: Go for a light walk'}</p>
        `;
        status.textContent = 'Rest Day';
        status.className = 'badge badge-secondary';
        return;
    }
    
    const exercises = todaysPlan.exercises || [];
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 600; text-transform: capitalize;">${todaysPlan.focus.replace('_', ' ')}</span>
            <span style="color: var(--text-muted); font-size: 0.8rem;">${todaysPlan.duration} min</span>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${exercises.slice(0, 3).map(ex => `
                <span style="background: var(--bg-secondary); padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.75rem;">
                    ${ex.name}
                </span>
            `).join('')}
            ${exercises.length > 3 ? `<span style="background: var(--bg-secondary); padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.75rem;">+${exercises.length - 3} more</span>` : ''}
        </div>
    `;
    status.textContent = 'Ready';
    status.className = 'badge badge-success';
}

function updateDashboardChart() {
    progressTracker.generateDashboardChart('weekly-chart-dashboard');
}

function updateAINudge() {
    const nudgeText = document.getElementById('ai-nudge-text');
    if (!AppState.user) {
        nudgeText.textContent = 'Complete your profile so I can help you reach your goals! 🎯';
        return;
    }
    
    const today = new Date().getDay();
    const todaysPlan = aiCoach.workoutPlans[today];
    
    if (todaysPlan && todaysPlan.focus !== 'rest' && !todaysPlan.completed) {
        nudgeText.textContent = `You have a ${todaysPlan.focus.replace('_', ' ')} workout today! Ready to crush it? 💪`;
    } else if (gamification.streak > 0) {
        nudgeText.textContent = `🔥 ${gamification.streak}-day streak! You're on fire! Keep it going!`;
    } else {
        nudgeText.textContent = aiCoach.getMotivationalMessage();
    }
}

function updateActivityList() {
    const list = document.getElementById('activity-list');
    const recent = progressTracker.workoutLog.slice(-5).reverse();
    
    if (recent.length === 0) {
        list.innerHTML = '<p class="text-muted">No activity logged yet</p>';
        return;
    }
    
    list.innerHTML = recent.map(w => `
        <div class="activity-item">
            <i class="fas fa-dumbbell"></i>
            <div class="activity-text">
                <strong>${w.focus || 'Workout'}</strong> - ${w.duration || 0} min
            </div>
            <span class="activity-time">${timeAgo(new Date(w.date))}</span>
        </div>
    `).join('');
}

// ============================================================
// WORKOUT SCREEN
// ============================================================
function refreshWorkout() {
    renderWeekDays();
    const today = new Date().getDay();
    selectDay(document.querySelector(`.week-day[data-day="${today}"]`));
}

function renderWeekDays() {
    const container = document.getElementById('week-days');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    container.innerHTML = days.map((day, i) => {
        const isToday = i === today;
        const plan = aiCoach.workoutPlans[i];
        const hasWorkout = plan && plan.focus !== 'rest';
        
        return `
            <div class="week-day ${isToday ? 'active' : ''} ${hasWorkout ? 'workout-day' : ''}" 
                 data-day="${i}" onclick="selectDay(this)">
                <div>${day}</div>
                ${hasWorkout ? '<div style="font-size: 0.55rem; margin-top: 0.2rem;">💪</div>' : ''}
            </div>
        `;
    }).join('');
}

function selectDay(el) {
    document.querySelectorAll('.week-day').forEach(d => d.classList.remove('active'));
    el.classList.add('active');
    
    const day = parseInt(el.dataset.day);
    renderWorkoutDetail(day);
}

function renderWorkoutDetail(day) {
    const plan = aiCoach.workoutPlans[day];
    const container = document.getElementById('exercise-list');
    const title = document.getElementById('workout-day-title');
    const intensity = document.getElementById('workout-intensity');
    const duration = document.getElementById('workout-duration');
    const calories = document.getElementById('workout-calories-burn');
    
    if (!plan || plan.focus === 'rest') {
        title.textContent = 'Rest Day';
        intensity.textContent = 'Recovery';
        intensity.className = 'workout-intensity low';
        duration.textContent = '0';
        calories.textContent = '0';
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 0; color: var(--text-muted);">
                <i class="fas fa-bed" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p>Rest and recover today! 🧘</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem;">${plan.recoveryTip || 'Your body needs rest to grow stronger'}</p>
            </div>
        `;
        return;
    }
    
    title.textContent = `${plan.day} - ${plan.focus.replace('_', ' ').toUpperCase()}`;
    
    intensity.textContent = plan.intensity.label || 'Moderate';
    intensity.className = `workout-intensity ${(plan.intensity.label || 'moderate').toLowerCase()}`;
    
    duration.textContent = plan.duration;
    calories.textContent = plan.caloriesBurn || '--';
    
    container.innerHTML = (plan.exercises || []).map((ex, i) => `
        <div class="exercise-item">
            <div class="exercise-check ${ex.completed ? 'completed' : ''}" onclick="toggleExercise(${i})">
                ${ex.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div>
                <div class="exercise-name">${ex.name}</div>
                <div class="exercise-detail">${ex.sets} x ${ex.reps} | ${ex.muscle}</div>
            </div>
            ${ex.completed ? '<span class="exercise-completed"><i class="fas fa-check-circle"></i> Done</span>' : ''}
        </div>
    `).join('');
}

function toggleExercise(index) {
    const day = parseInt(document.querySelector('.week-day.active')?.dataset.day || new Date().getDay());
    const plan = aiCoach.workoutPlans[day];
    if (!plan || !plan.exercises[index]) return;
    
    plan.exercises[index].completed = !plan.exercises[index].completed;
    renderWorkoutDetail(day);
}

function regenerateWorkouts() {
    if (!AppState.user) {
        showToast('Complete onboarding first!', 'error');
        return;
    }
    
    aiCoach.initializePlan(AppState.user);
    renderWeekDays();
    const today = new Date().getDay();
    selectDay(document.querySelector(`.week-day[data-day="${today}"]`));
    showToast('Workout plan regenerated! 🔄', 'success');
}

// ============================================================
// ACTIVE WORKOUT
// ============================================================
function startWorkout() {
    const today = new Date().getDay();
    const plan = aiCoach.workoutPlans[today];
    
    if (!plan || plan.focus === 'rest') {
        showToast("It's a rest day! Take it easy 🧘", 'info');
        return;
    }
    
    if (!plan.exercises || plan.exercises.length === 0) {
        showToast('No exercises in this plan', 'error');
        return;
    }
    
    AppState.activeWorkout = plan;
    AppState.currentExercise = 0;
    AppState.workoutSeconds = 0;
    AppState.isPaused = false;
    
    document.getElementById('workout-modal').style.display = 'flex';
    updateActiveExercise();
    startTimer();
}

function updateActiveExercise() {
    const exercises = AppState.activeWorkout.exercises;
    const exercise = exercises[AppState.currentExercise];
    
    document.getElementById('active-exercise-name').textContent = exercise.name;
    document.getElementById('active-exercise-detail').textContent = `${exercise.sets} x ${exercise.reps}`;
    document.getElementById('exercise-counter').textContent = `${AppState.currentExercise + 1}/${exercises.length}`;
}

function startTimer() {
    if (AppState.workoutTimer) clearInterval(AppState.workoutTimer);
    
    AppState.workoutTimer = setInterval(() => {
        if (!AppState.isPaused) {
            AppState.workoutSeconds++;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(AppState.workoutSeconds / 60);
    const secs = AppState.workoutSeconds % 60;
    document.getElementById('timer-display').textContent = 
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    // Update progress circle
    const totalSeconds = AppState.activeWorkout.duration * 60;
    const progress = AppState.workoutSeconds / totalSeconds;
    const circumference = 339.292;
    document.getElementById('timer-progress').style.strokeDashoffset = 
        circumference * (1 - Math.min(1, progress));
}

function completeExercise() {
    if (AppState.currentExercise < AppState.activeWorkout.exercises.length - 1) {
        AppState.currentExercise++;
        updateActiveExercise();
    } else {
        // Workout complete!
        completeWorkout();
    }
}

function pauseWorkout() {
    AppState.isPaused = !AppState.isPaused;
    document.querySelector('.workout-controls .btn-secondary').innerHTML = 
        AppState.isPaused ? 
        '<i class="fas fa-play"></i> Resume' : 
        '<i class="fas fa-pause"></i> Pause';
}

function endWorkout() {
    if (confirm('Are you sure you want to end this workout?')) {
        clearInterval(AppState.workoutTimer);
        AppState.workoutTimer = null;
        document.getElementById('workout-modal').style.display = 'none';
        
        // Log partial workout
        completeWorkout(true);
    }
}

function completeWorkout(partial = false) {
    clearInterval(AppState.workoutTimer);
    AppState.workoutTimer = null;
    
    const plan = AppState.activeWorkout;
    const completedExercises = plan.exercises.filter(e => e.completed).length;
    const totalExercises = plan.exercises.length;
    
    // Log workout
    const workoutData = {
        focus: plan.focus,
        duration: Math.round(AppState.workoutSeconds / 60),
        caloriesBurn: Math.round(plan.caloriesBurn * (partial ? completedExercises / totalExercises : 1)),
        exercisesCompleted: completedExercises,
        totalExercises: totalExercises
    };
    
    progressTracker.logWorkoutSession(workoutData);
    gamification.logWorkout();
    gamification.logCalories(workoutData.caloriesBurn);
    
    // Mark plan as completed
    plan.completed = true;
    plan.logged = true;
    
    document.getElementById('workout-modal').style.display = 'none';
    
    // Show completion message
    const message = partial ? 
        `Partial workout logged! You completed ${completedExercises}/${totalExercises} exercises. 💪` :
        `🎉 Amazing workout! You crushed it! 🔥`;
    
    showToast(message, 'success');
    
    // Refresh views
    refreshDashboard();
    refreshWorkout();
}

// ============================================================
// AI COACH
// ============================================================
function refreshCoach() {
    // Update coach status based on onboarding
    document.getElementById('coach-subtitle').textContent = 
        AppState.user ? 'Your personal AI fitness assistant' : 'Complete onboarding to activate';
    
    updateCoachInsights();
}

function updateCoachInsights() {
    const container = document.getElementById('insights-list');
    
    if (!AppState.user) {
        container.innerHTML = `
            <div class="insight-item">
                <i class="fas fa-check-circle insight-icon green"></i>
                <span>Complete your profile for personalized insights</span>
            </div>
        `;
        return;
    }
    
    const insights = [];
    const today = new Date().getDay();
    const todaysPlan = aiCoach.workoutPlans[today];
    
    if (todaysPlan && todaysPlan.focus !== 'rest' && !todaysPlan.completed) {
        insights.push({ icon: 'fa-dumbbell', color: 'green', text: `Today's ${todaysPlan.focus.replace('_', ' ')} workout is ready!` });
    }
    
    const nutritionAdvice = nutritionEngine.getNutritionAdvice();
    nutritionAdvice.forEach(advice => {
        const color = advice.type === 'warning' ? 'yellow' : advice.type === 'success' ? 'green' : 'blue';
        insights.push({ icon: 'fa-apple-alt', color, text: advice.text });
    });
    
    if (gamification.streak > 0) {
        insights.push({ icon: 'fa-fire', color: 'yellow', text: `${gamification.streak}-day streak! Keep it going! 🔥` });
    }
    
    if (insights.length === 0) {
        insights.push({ icon: 'fa-check-circle', color: 'green', text: 'You\'re all set! Ask your coach for help anytime.' });
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <i class="fas ${insight.icon} insight-icon ${insight.color}"></i>
            <span>${insight.text}</span>
        </div>
    `).join('');
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chat-input-field');
    const message = input.value.trim();
    if (!message) return;
    
    input.value = '';
    addMessageToChat('user', message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process with AI Coach
    setTimeout(() => {
        removeTypingIndicator();
        const response = aiCoach.processMessage(message);
        addMessageToChat('bot', response.text);
        
        // Scroll to bottom
        const messages = document.getElementById('chat-messages');
        messages.scrollTop = messages.scrollHeight;
    }, 800 + Math.random() * 700);
}

function sendQuickReply(text) {
    document.getElementById('chat-input-field').value = text;
    sendMessage();
}

function addMessageToChat(role, content) {
    const messages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    
    // Convert markdown-style formatting
    const formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    div.innerHTML = `<div class="message-content">${formatted}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    const messages = document.getElementById('chat-messages');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(indicator);
    messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// ============================================================
// NUTRITION SCREEN
// ============================================================
function refreshNutrition() {
    updateMacroDisplay();
    updateMealSuggestions();
    updateWaterTracker();
}

function updateMacroDisplay() {
    const status = nutritionEngine.getMacroStatus();
    
    // Update values
    document.getElementById('cal-consumed').textContent = status.consumed.calories;
    document.getElementById('cal-target').textContent = status.targets.calories;
    document.getElementById('protein-consumed').textContent = status.consumed.protein;
    document.getElementById('carbs-consumed').textContent = status.consumed.carbs;
    document.getElementById('fat-consumed').textContent = status.consumed.fat;
    
    // Update progress circles
    updateMacroCircle('cal-progress', status.percentages.calories);
    updateMacroCircle('protein-progress', status.percentages.protein);
    updateMacroCircle('carbs-progress', status.percentages.carbs);
    updateMacroCircle('fat-progress', status.percentages.fat);
}

function updateMacroCircle(elementId, percentage) {
    const circle = document.getElementById(elementId);
    if (!circle) return;
    
    const circumference = 219.91;
    const offset = circumference * (1 - percentage / 100);
    circle.style.strokeDashoffset = offset;
}

function updateMealSuggestions() {
    const container = document.getElementById('meal-list');
    const suggestions = nutritionEngine.getPersonalizedMealSuggestion(AppState.user?.goal);
    
    let html = '';
    for (const [type, meals] of Object.entries(suggestions)) {
        meals.forEach(meal => {
            html += `
                <div class="meal-item" onclick="logSuggestedMeal('${type}', '${meal.name}', ${meal.calories}, ${meal.protein}, ${meal.carbs}, ${meal.fat})">
                    <div class="meal-icon ${type}">
                        <span>${meal.icon}</span>
                    </div>
                    <div class="meal-info">
                        <div class="meal-name">${meal.name}</div>
                        <div class="meal-macros">${meal.calories} cal | P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g</div>
                        <div class="meal-time" style="text-transform: capitalize;">${type}</div>
                    </div>
                    <button style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-plus-circle"></i> Add
                    </button>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

function logSuggestedMeal(type, name, calories, protein, carbs, fat) {
    nutritionEngine.logMeal({
        type: type,
        name: name,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
    });
    
    updateMacroDisplay();
    showToast(`Logged: ${name} (${calories} cal) ✅`, 'success');
}

function logMeal() {
    document.getElementById('meal-modal').style.display = 'flex';
}

function closeMealModal() {
    document.getElementById('meal-modal').style.display = 'none';
}

function saveMeal() {
    const meal = {
        type: document.getElementById('meal-type').value,
        name: document.getElementById('meal-name').value,
        calories: parseInt(document.getElementById('meal-calories').value) || 0,
        protein: parseInt(document.getElementById('meal-protein').value) || 0,
        carbs: parseInt(document.getElementById('meal-carbs').value) || 0,
        fat: parseInt(document.getElementById('meal-fat').value) || 0
    };
    
    if (!meal.name) {
        showToast('Please enter a food name', 'error');
        return;
    }
    
    nutritionEngine.logMeal(meal);
    updateMacroDisplay();
    closeMealModal();
    
    // Clear form
    document.getElementById('meal-name').value = '';
    document.getElementById('meal-calories').value = '';
    document.getElementById('meal-protein').value = '';
    document.getElementById('meal-carbs').value = '';
    document.getElementById('meal-fat').value = '';
    
    showToast(`Logged: ${meal.name} ✅`, 'success');
}

function refreshMeals() {
    updateMealSuggestions();
    showToast('Meal suggestions refreshed! 🔄', 'success');
}

function updateWaterTracker() {
    const count = nutritionEngine.waterGlasses;
    document.getElementById('water-count').textContent = count;
    
    const glasses = document.querySelectorAll('.water-glass');
    glasses.forEach((glass, i) => {
        glass.classList.toggle('filled', i < count);
    });
}

function drinkWater(index) {
    if (index === nutritionEngine.waterGlasses) {
        nutritionEngine.drinkWater();
        updateWaterTracker();
        updateMacroDisplay();
    }
}

// ============================================================
// PROGRESS SCREEN
// ============================================================
function refreshProgress() {
    updatePrediction();
    progressTracker.generateWeightChart('weight-chart');
    progressTracker.generateConsistencyChart('consistency-chart');
    updateBadges();
    updateWeeklyReport();
}

function updatePrediction() {
    const prediction = progressTracker.getPredictiveInsight(AppState.user);
    document.getElementById('prediction-text').innerHTML = prediction;
    
    // Update prediction badge
    const badge = document.getElementById('progress-prediction');
    if (gamification.streak >= 3) {
        badge.textContent = '🌟 On Track';
        badge.className = 'badge badge-success';
    } else if (AppState.user) {
        badge.textContent = '📈 Getting Started';
        badge.className = 'badge badge-primary';
    } else {
        badge.textContent = '⏳ Setup Needed';
        badge.className = 'badge';
    }
}

function updateBadges() {
    gamification.renderBadges();
}

function updateWeeklyReport() {
    const container = document.getElementById('weekly-report');
    if (progressTracker.workoutLog.length === 0) {
        container.innerHTML = '<p class="text-muted">Complete a full week of workouts to see your report</p>';
        return;
    }
    
    container.innerHTML = progressTracker.generateWeeklyReportHTML();
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function showNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function closeNotifications() {
    document.getElementById('notification-panel').style.display = 'none';
}

// ============================================================
// PROFILE MENU
// ============================================================
function toggleProfileMenu() {
    document.getElementById('profile-dropdown').classList.toggle('show');
}

// Close dropdown on click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-avatar')) {
        document.getElementById('profile-dropdown')?.classList.remove('show');
    }
    if (!e.target.closest('.notification-btn') && !e.target.closest('.notification-panel')) {
        document.getElementById('notification-panel').style.display = 'none';
    }
});

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--primary)' };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}"></i>
        <p>${message}</p>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3500);
}

function showBadgeToast(badge) {
    showToast(`🏅 Badge unlocked: ${badge.name}!`, 'success');
    
    // Confetti effect
    createConfetti();
}

function showChallengeToast(challenge) {
    showToast(`🎉 Challenge complete: ${challenge.name}!`, 'success');
    createConfetti();
}

function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    const colors = ['#6c5ce7', '#00e676', '#ff6b6b', '#f9ca24', '#45b7d1', '#a29bfe'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 4) + 'px';
        piece.style.height = (Math.random() * 8 + 4) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        
        container.appendChild(piece);
    }
    
    setTimeout(() => container.remove(), 4000);
}

// ============================================================
// RESET
// ============================================================
function resetApp() {
    if (confirm('Reset all data? This will restart the app completely.')) {
        localStorage.clear();
        location.reload();
    }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];
    
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'just now';
}


