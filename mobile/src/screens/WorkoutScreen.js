/* ============================================================
   FitAI - Workout Screen (React Native)
   ============================================================ */

import React, { useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, SafeAreaView,
    TouchableOpacity, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SAMPLE_WORKOUT = {
    1: {
        focus: 'full_body',
        duration: 45,
        intensity: 'Moderate',
        calories: 350,
        exercises: [
            { name: 'Push-ups', sets: 3, reps: '12-15', completed: false },
            { name: 'Squats', sets: 3, reps: '15-20', completed: false },
            { name: 'Plank', sets: 3, reps: '30-60 sec', completed: false },
            { name: 'Dumbbell Rows', sets: 3, reps: '12 each', completed: false },
            { name: 'Mountain Climbers', sets: 3, reps: '30 sec', completed: false },
        ]
    }
};

export default function WorkoutScreen() {
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());
    const [showModal, setShowModal] = useState(false);
    const [activeExercise, setActiveExercise] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const todaysWorkout = SAMPLE_WORKOUT[selectedDay];

    const startWorkout = () => {
        setShowModal(true);
        setActiveExercise(0);
        setTimer(0);
        setIsActive(true);
    };

    const completeCurrentExercise = () => {
        if (todaysWorkout && activeExercise < todaysWorkout.exercises.length - 1) {
            setActiveExercise(prev => prev + 1);
        } else {
            // Workout complete
            setShowModal(false);
            setIsActive(false);
        }
    };

    const endWorkout = () => {
        setShowModal(false);
        setIsActive(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        <Icon name="dumbbell" size={20} color="#6c5ce7" /> Workout Plans
                    </Text>
                    <TouchableOpacity style={styles.regenerateBtn}>
                        <Icon name="sync" size={16} color="#fff" />
                        <Text style={styles.regenerateText}>Regenerate</Text>
                    </TouchableOpacity>
                </View>

                {/* Week Days */}
                <Text style={styles.sectionTitle}>This Week's Plan</Text>
                <View style={styles.weekDays}>
                    {DAYS.map((day, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.dayBtn, selectedDay === i && styles.dayBtnActive]}
                            onPress={() => setSelectedDay(i)}
                        >
                            <Text style={[styles.dayText, selectedDay === i && styles.dayTextActive]}>{day}</Text>
                            <Text style={[styles.dayIndicator, selectedDay === i && styles.dayIndicatorActive]}>
                                {i % 2 === 0 ? '💪' : ''}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Workout Detail */}
                {todaysWorkout ? (
                    <View style={styles.card}>
                        <View style={styles.workoutHeader}>
                            <Text style={styles.workoutTitle}>
                                {todaysWorkout.focus.replace('_', ' ').toUpperCase()}
                            </Text>
                            <View style={styles.intensityBadge}>
                                <Text style={styles.intensityText}>{todaysWorkout.intensity}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.workoutMeta}>
                            <Text style={styles.metaText}>
                                <Icon name="clock-outline" size={14} color="#6c6c8a" /> {todaysWorkout.duration} min
                            </Text>
                            <Text style={styles.metaText}>
                                <Icon name="fire" size={14} color="#6c6c8a" /> {todaysWorkout.calories} cal
                            </Text>
                        </View>

                        {todaysWorkout.exercises.map((ex, i) => (
                            <View key={i} style={styles.exerciseItem}>
                                <TouchableOpacity style={[styles.checkBtn, ex.completed && styles.checkBtnDone]}>
                                    {ex.completed && <Icon name="check" size={14} color="#fff" />}
                                </TouchableOpacity>
                                <View style={styles.exerciseInfo}>
                                    <Text style={styles.exerciseName}>{ex.name}</Text>
                                    <Text style={styles.exerciseDetail}>{ex.sets} x {ex.reps}</Text>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.startBtn} onPress={startWorkout}>
                            <Icon name="play" size={20} color="#fff" />
                            <Text style={styles.startBtnText}>Start Workout</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.restDay}>
                            <Icon name="bed" size={48} color="#6c6c8a" />
                            <Text style={styles.restTitle}>Rest Day</Text>
                            <Text style={styles.restText}>Take time to recover and recharge</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Workout Modal */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerText}>
                                {String(Math.floor(timer / 60)).padStart(2, '0')}:
                                {String(timer % 60).padStart(2, '0')}
                            </Text>
                        </View>
                        
                        {todaysWorkout && (
                            <>
                                <Text style={styles.activeExerciseName}>
                                    {todaysWorkout.exercises[activeExercise]?.name}
                                </Text>
                                <Text style={styles.activeExerciseDetail}>
                                    {todaysWorkout.exercises[activeExercise]?.sets} x {todaysWorkout.exercises[activeExercise]?.reps}
                                </Text>
                                <Text style={styles.exerciseCounter}>
                                    {activeExercise + 1}/{todaysWorkout.exercises.length}
                                </Text>
                            </>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtn}>
                                <Icon name="pause" size={20} color="#fff" />
                                <Text style={styles.modalBtnText}>Pause</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={completeCurrentExercise}>
                                <Icon name="check" size={20} color="#fff" />
                                <Text style={styles.modalBtnText}>Complete</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.endWorkoutBtn} onPress={endWorkout}>
                            <Icon name="stop" size={20} color="#fff" />
                            <Text style={styles.endWorkoutText}>End Workout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    scrollContent: { padding: 16, paddingBottom: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    regenerateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#6c5ce7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    regenerateText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    sectionTitle: { color: '#6c6c8a', fontSize: 14, marginBottom: 12 },
    weekDays: { flexDirection: 'row', gap: 6, marginBottom: 16 },
    dayBtn: { flex: 1, alignItems: 'center', padding: 8, borderRadius: 10, backgroundColor: '#1a1a3e', borderWidth: 1, borderColor: '#2a2a5e' },
    dayBtnActive: { backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' },
    dayText: { color: '#b0b0cc', fontSize: 12, fontWeight: '500' },
    dayTextActive: { color: '#fff' },
    dayIndicator: { fontSize: 10, marginTop: 2 },
    dayIndicatorActive: { color: '#fff' },
    card: { backgroundColor: '#1a1a3e', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2a2a5e' },
    workoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    workoutTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
    intensityBadge: { backgroundColor: 'rgba(249, 202, 36, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    intensityText: { fontSize: 11, color: '#f9ca24', fontWeight: '600' },
    workoutMeta: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    metaText: { fontSize: 13, color: '#6c6c8a' },
    exerciseItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#12122a', borderRadius: 10, marginBottom: 8 },
    checkBtn: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#2a2a5e', alignItems: 'center', justifyContent: 'center' },
    checkBtnDone: { backgroundColor: '#00e676', borderColor: '#00e676' },
    exerciseInfo: { flex: 1 },
    exerciseName: { fontSize: 14, fontWeight: '500', color: '#fff' },
    exerciseDetail: { fontSize: 12, color: '#6c6c8a', marginTop: 2 },
    startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6c5ce7', padding: 14, borderRadius: 12, marginTop: 8 },
    startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    restDay: { alignItems: 'center', padding: 24 },
    restTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 12 },
    restText: { color: '#6c6c8a', fontSize: 14, marginTop: 4 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#1a1a3e', borderRadius: 20, padding: 24, width: '85%', alignItems: 'center' },
    timerContainer: { marginBottom: 20 },
    timerText: { fontSize: 48, fontWeight: '700', color: '#6c5ce7', fontVariant: ['tabular-nums'] },
    activeExerciseName: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
    activeExerciseDetail: { color: '#6c6c8a', fontSize: 16, marginTop: 4 },
    exerciseCounter: { color: '#6c6c8a', fontSize: 14, marginTop: 8, marginBottom: 24 },
    modalButtons: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 },
    modalBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#2a2a5e' },
    modalBtnPrimary: { backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' },
    modalBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    endWorkoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, backgroundColor: '#ff6b6b', width: '100%' },
    endWorkoutText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

