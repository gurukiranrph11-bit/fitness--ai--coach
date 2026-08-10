# FitAI - AI Coach Logic Flow

## 1. User Onboarding → Initial Plan Generation

```
Input: User Profile (age, weight, fitness level, goals, health conditions)
  ↓
AI Coach.initializePlan(profile)
  ↓
- Select exercises based on goal (weight_loss→more cardio, muscle_gain→strength focus)
- Calculate intensity based on fitness level (beginner=0.6, intermediate=0.75, advanced=0.9)
- Distribute workout days evenly across the week
- Assign workout focus (full_body, upper_body, lower_body, cardio)
- Generate exercises with appropriate sets/reps
- Estimate calorie burn using MET-based calculation
  ↓
Output: Weekly workout plan (7 days, rest days included)
```

## 2. Daily Tracking → Compliance Check

```
Daily:
- User completes/completes workout
- Exercises marked as completed
- Duration and calories logged
- Feedback collected (too_easy, good, too_hard)
  ↓
Gamification System:
- Update streak count
- Check badge unlocks
- Update challenge progress
- Log to workout history
```

## 3. Decision Engine → Adaptive Coaching

```
After each workout:
- Calculate completion rate (exercises_done / total_exercises)
- Analyze user feedback
  ↓
Decision Tree:
  IF completion >= 80% AND feedback != 'too_hard':
    → INCREASE intensity (fitness level upgrade)
    → "Great work! Intensity increased!"
  ELIF completion < 50% OR feedback == 'too_hard':
    → DECREASE intensity (fitness level downgrade)
    → "Adjusted to be more manageable!"
  ELSE:
    → MAINTAIN current intensity
    → "Right on track!"
  ↓
Regenerate weekly plan with new intensity
```

## 4. Adaptive Coaching → Weekly Plan Updates

```
Weekly:
- Aggregate workout data from past week
- Calculate consistency percentage
- Analyze trend (weight change, strength progress)
  ↓
Plan Updates:
- If consistently completing: increase volume/intensity
- If struggling: decrease volume or add rest days
- If plateau: change exercise selection (muscle confusion)
- Generate new weekly plan
```

## 5. Nutrition Guidance Engine

```
Daily macro targets calculated from:
- BMR (Mifflin-St Jeor equation)
- Activity level multiplier
- Goal adjustment (deficit for weight loss, surplus for muscle gain)

Meal suggestions personalized by:
- Goal type (high protein for muscle gain, low cal for weight loss)
- Macro balance recommendations
- Corrective feedback (too many carbs, not enough protein)
```

## 6. Motivation System

```
Triggers for motivational nudges:
- Morning: "Start your day strong!"
- Pre-workout: "Let's crush this!"
- Post-workout: "Amazing effort!"
- Streak milestones: "X-day streak! Keep going!"
- Struggle detected: "Remember why you started!"

Gamification:
- Badges for achievements (first workout, streaks, calories)
- Challenges for engagement (7-day streak, 30-day transformation)
- Visual progress tracking with charts
```

## 7. Progress Visualization → Predictive Insights

```
Data collected:
- Workout logs (date, duration, calories, exercises)
- Weight logs
- Nutrition logs

Insights generated:
- "At this pace, you'll reach your goal in X weeks"
- "Your consistency is X% this week"
- "You've burned X calories total"
- "Try increasing protein to reach your macros"

Charts:
- Weight trend line chart
- Weekly calorie bar chart
- Consistency heat map
- Workout frequency timeline
