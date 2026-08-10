/* ============================================================
   FitAI - API Service Layer
   Handles communication with backend server
   ============================================================ */

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    static async request(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'API Error');
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // User endpoints
    static async registerUser(profile) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(profile)
        });
    }

    static async getUser(userId) {
        return this.request(`/users/${userId}`);
    }

    static async updateUser(userId, updates) {
        return this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    // Workout endpoints
    static async generatePlan(params) {
        return this.request('/workouts/generate', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    static async logWorkout(userId, workoutData) {
        return this.request('/workouts/log', {
            method: 'POST',
            body: JSON.stringify({ userId, workoutData })
        });
    }

    static async getWorkoutHistory(userId) {
        return this.request(`/workouts/${userId}`);
    }

    static async getTodaysWorkout(userId) {
        return this.request(`/workouts/today/${userId}`);
    }

    // AI Coach endpoints
    static async chatWithCoach(userId, message, context = {}) {
        return this.request('/coach/chat', {
            method: 'POST',
            body: JSON.stringify({ userId, message, context })
        });
    }

    static async getMotivation() {
        return this.request('/coach/motivation');
    }

    // Nutrition endpoints
    static async logMeal(userId, meal) {
        return this.request('/nutrition/meal', {
            method: 'POST',
            body: JSON.stringify({ userId, meal })
        });
    }

    static async getNutritionLogs(userId) {
        return this.request(`/nutrition/${userId}`);
    }

    // Progress endpoints
    static async logWeight(userId, weight) {
        return this.request('/progress/weight', {
            method: 'POST',
            body: JSON.stringify({ userId, weight })
        });
    }

    static async getProgress(userId) {
        return this.request(`/progress/${userId}`);
    }
}

export default ApiService;
