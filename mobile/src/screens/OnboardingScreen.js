/* ============================================================
   FitAI - Onboarding Screen (React Native)
   ============================================================ */

import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    StyleSheet, SafeAreaView, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const STEPS = [
    { title: 'Basic Information', icon: 'account-outline' },
    { title: 'Fitness Level', icon: 'chart-line' },
    { title: 'Your Goals', icon: 'target' },
    { title: 'Health Conditions', icon: 'medical-bag' },
    { title: 'Preferences', icon: 'clock-outline' },
];

export default function OnboardingScreen({ navigation, onComplete }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        age: '', gender: 'male', weight: '', height: '',
        fitnessLevel: null, activityLevel: 'moderate',
        goal: null, targetWeight: '',
        healthConditions: [], injuries: '',
        daysPerWeek: 3, duration: 45, workoutType: null
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleHealthCondition = (condition) => {
        setFormData(prev => ({
            ...prev,
            healthConditions: prev.healthConditions.includes(condition)
                ? prev.healthConditions.filter(c => c !== condition)
                : [...prev.healthConditions, condition]
        }));
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
        else handleComplete();
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleComplete = () => {
        // Save user data and complete onboarding
        onComplete(formData);
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <View>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your age"
                            placeholderTextColor="#6c6c8a"
                            keyboardType="numeric"
                            value={formData.age}
                            onChangeText={v => updateField('age', v)}
                        />
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.row}>
                            {['male', 'female', 'other'].map(g => (
                                <TouchableOpacity
                                    key={g}
                                    style={[styles.optionBtn, formData.gender === g && styles.optionBtnActive]}
                                    onPress={() => updateField('gender', g)}
                                >
                                    <Text style={[styles.optionText, formData.gender === g && styles.optionTextActive]}>
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="70"
                            placeholderTextColor="#6c6c8a"
                            keyboardType="numeric"
                            value={formData.weight}
                            onChangeText={v => updateField('weight', v)}
                        />
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="175"
                            placeholderTextColor="#6c6c8a"
                            keyboardType="numeric"
                            value={formData.height}
                            onChangeText={v => updateField('height', v)}
                        />
                    </View>
                );
            case 1:
                return (
                    <View>
                        <Text style={styles.label}>Current Fitness Level</Text>
                        {['beginner', 'intermediate', 'advanced'].map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.cardOption, formData.fitnessLevel === level && styles.cardOptionActive]}
                                onPress={() => updateField('fitnessLevel', level)}
                            >
                                <Icon
                                    name={level === 'beginner' ? 'sprout' : level === 'intermediate' ? 'walk' : 'run'}
                                    size={24}
                                    color={formData.fitnessLevel === level ? '#fff' : '#6c5ce7'}
                                />
                                <Text style={[styles.cardOptionText, formData.fitnessLevel === level && { color: '#fff' }]}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.label}>Daily Activity</Text>
                        {['sedentary', 'light', 'moderate', 'active', 'extreme'].map(a => (
                            <TouchableOpacity
                                key={a}
                                style={[styles.optionBtn, formData.activityLevel === a && styles.optionBtnActive]}
                                onPress={() => updateField('activityLevel', a)}
                            >
                                <Text style={[styles.optionText, formData.activityLevel === a && styles.optionTextActive]}>
                                    {a.charAt(0).toUpperCase() + a.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 2:
                return (
                    <View>
                        <Text style={styles.label}>Primary Goal</Text>
                        {[
                            { key: 'weight_loss', icon: 'weight', label: 'Weight Loss' },
                            { key: 'muscle_gain', icon: 'dumbbell', label: 'Muscle Gain' },
                            { key: 'endurance', icon: 'heart-pulse', label: 'Endurance' },
                            { key: 'general_fitness', icon: 'heart', label: 'General Fitness' }
                        ].map(g => (
                            <TouchableOpacity
                                key={g.key}
                                style={[styles.cardOption, formData.goal === g.key && styles.cardOptionActive]}
                                onPress={() => updateField('goal', g.key)}
                            >
                                <Icon name={g.icon} size={24} color={formData.goal === g.key ? '#fff' : '#6c5ce7'} />
                                <Text style={[styles.cardOptionText, formData.goal === g.key && { color: '#fff' }]}>
                                    {g.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.label}>Target Weight (optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Leave blank if unsure"
                            placeholderTextColor="#6c6c8a"
                            keyboardType="numeric"
                            value={formData.targetWeight}
                            onChangeText={v => updateField('targetWeight', v)}
                        />
                    </View>
                );
            case 3:
                return (
                    <View>
                        <Text style={styles.label}>Health Conditions</Text>
                        <View style={styles.checkboxGrid}>
                            {['None', 'Diabetes', 'Hypertension', 'Asthma', 'Joint Pain', 'Back Pain', 'Heart Condition'].map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.checkbox, formData.healthConditions.includes(c) && styles.checkboxActive]}
                                    onPress={() => toggleHealthCondition(c)}
                                >
                                    <Icon
                                        name={formData.healthConditions.includes(c) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                        size={20}
                                        color={formData.healthConditions.includes(c) ? '#6c5ce7' : '#6c6c8a'}
                                    />
                                    <Text style={[styles.checkboxText, formData.healthConditions.includes(c) && { color: '#fff' }]}>
                                        {c}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.label}>Injuries or Limitations</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            placeholder="Describe any injuries..."
                            placeholderTextColor="#6c6c8a"
                            multiline
                            value={formData.injuries}
                            onChangeText={v => updateField('injuries', v)}
                        />
                    </View>
                );
            case 4:
                return (
                    <View>
                        <Text style={styles.label}>Days per Week</Text>
                        <View style={styles.row}>
                            {[1, 2, 3, 4, 5, 6, 7].map(d => (
                                <TouchableOpacity
                                    key={d}
                                    style={[styles.dayBtn, formData.daysPerWeek === d && styles.dayBtnActive]}
                                    onPress={() => updateField('daysPerWeek', d)}
                                >
                                    <Text style={[styles.dayBtnText, formData.daysPerWeek === d && styles.dayBtnTextActive]}>
                                        {d}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.label}>Duration: {formData.duration} min</Text>
                        <View style={styles.row}>
                            {[15, 30, 45, 60, 90, 120].map(d => (
                                <TouchableOpacity
                                    key={d}
                                    style={[styles.durationBtn, formData.duration === d && styles.durationBtnActive]}
                                    onPress={() => updateField('duration', d)}
                                >
                                    <Text style={[styles.durationBtnText, formData.duration === d && styles.durationBtnTextActive]}>
                                        {d}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.label}>Workout Type</Text>
                        {[
                            { key: 'home', icon: 'home', label: 'Home' },
                            { key: 'gym', icon: 'office-building', label: 'Gym' },
                            { key: 'outdoor', icon: 'tree', label: 'Outdoor' },
                            { key: 'mixed', icon: 'swap-horizontal', label: 'Mixed' }
                        ].map(w => (
                            <TouchableOpacity
                                key={w.key}
                                style={[styles.cardOption, formData.workoutType === w.key && styles.cardOptionActive]}
                                onPress={() => updateField('workoutType', w.key)}
                            >
                                <Icon name={w.icon} size={24} color={formData.workoutType === w.key ? '#fff' : '#6c5ce7'} />
                                <Text style={[styles.cardOptionText, formData.workoutType === w.key && { color: '#fff' }]}>
                                    {w.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Progress */}
                <View style={styles.progressBar}>
                    {STEPS.map((_, i) => (
                        <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
                    ))}
                </View>
                <Text style={styles.stepIndicator}>Step {step + 1} of {STEPS.length}</Text>

                {/* Step Icon */}
                <View style={styles.stepIconContainer}>
                    <Icon name={STEPS[step].icon} size={40} color="#fff" />
                </View>
                <Text style={styles.stepTitle}>{STEPS[step].title}</Text>

                {/* Form Content */}
                {renderStep()}

                {/* Navigation */}
                <View style={styles.navContainer}>
                    {step > 0 && (
                        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                            <Icon name="arrow-left" size={20} color="#fff" />
                            <Text style={styles.backBtnText}>Back</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.nextBtn, step === 0 && { flex: 1 }]}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextBtnText}>
                            {step === STEPS.length - 1 ? 'Start Journey' : 'Next'}
                        </Text>
                        <Icon name="arrow-right" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
    },
    scrollContent: {
        padding: 24,
        minHeight: '100%',
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2a2a5e',
    },
    progressDotActive: {
        backgroundColor: '#6c5ce7',
        width: 30,
    },
    stepIndicator: {
        color: '#6c6c8a',
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 14,
    },
    stepIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#6c5ce7',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 24,
    },
    label: {
        color: '#b0b0cc',
        marginBottom: 8,
        marginTop: 16,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#12122a',
        borderWidth: 1,
        borderColor: '#2a2a5e',
        borderRadius: 12,
        padding: 14,
        color: '#fff',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2a2a5e',
        backgroundColor: '#1a1a3e',
    },
    optionBtnActive: {
        backgroundColor: '#6c5ce7',
        borderColor: '#6c5ce7',
    },
    optionText: {
        color: '#b0b0cc',
        fontSize: 14,
    },
    optionTextActive: {
        color: '#fff',
    },
    cardOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2a2a5e',
        backgroundColor: '#1a1a3e',
        marginBottom: 8,
    },
    cardOptionActive: {
        backgroundColor: '#6c5ce7',
        borderColor: '#6c5ce7',
    },
    cardOptionText: {
        color: '#b0b0cc',
        fontSize: 16,
        fontWeight: '500',
    },
    checkboxGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2a2a5e',
        backgroundColor: '#1a1a3e',
    },
    checkboxActive: {
        borderColor: '#6c5ce7',
    },
    checkboxText: {
        color: '#b0b0cc',
        fontSize: 14,
    },
    dayBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#2a2a5e',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a3e',
    },
    dayBtnActive: {
        backgroundColor: '#6c5ce7',
        borderColor: '#6c5ce7',
    },
    dayBtnText: {
        color: '#b0b0cc',
        fontWeight: '600',
    },
    dayBtnTextActive: {
        color: '#fff',
    },
    durationBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2a2a5e',
        backgroundColor: '#1a1a3e',
    },
    durationBtnActive: {
        backgroundColor: '#6c5ce7',
        borderColor: '#6c5ce7',
    },
    durationBtnText: {
        color: '#b0b0cc',
        fontSize: 14,
    },
    durationBtnTextActive: {
        color: '#fff',
    },
    navContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 32,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2a2a5e',
    },
    backBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    nextBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#6c5ce7',
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

