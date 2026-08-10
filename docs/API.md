# FitAI API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
Future versions will include JWT-based auth. Currently open.

## Endpoints

### User Management

**POST /api/users/register** - Create user profile
```json
{
  "name": "User",
  "email": "user@example.com",
  "age": 28,
  "gender": "male",
  "weight": 75,
  "height": 178,
  "fitnessLevel": "intermediate",
  "goal": "weight_loss",
  "healthConditions": [],
  "activityLevel": "moderate",
  "daysPerWeek": 3,
  "duration": 45,
  "workoutType": "mixed",
  "targetWeight": 65
}
```

### Workout Plans

**POST /api/workouts/generate** - Generate weekly plan
**POST /api/workouts/log** - Log completed workout
**GET /api/workouts/:userId** - Get workout history
**GET /api/workouts/today/:userId** - Get today's workout

### AI Coach

**POST /api/coach/chat** - Chat with AI coach
**GET /api/coach/motivation** - Get motivational message

### Nutrition

**POST /api/nutrition/meal** - Log a meal
**GET /api/nutrition/:userId** - Get nutrition logs

### Progress

**POST /api/progress/weight** - Log weight
**GET /api/progress/:userId** - Get progress data
