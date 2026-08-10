/* ============================================================
   FitAI - Nutrition Screen (React Native)
   ============================================================ */

import React, { useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, SafeAreaView,
    TouchableOpacity, TextInput, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const INITIAL_MACROS = { calories: 2000, protein: 150, carbs: 200, fat: 65 };
const MEAL_SUGGESTIONS = {
    breakfast: [
        { name: 'Greek Yogurt Parfait', calories: 320, protein: 22, carbs: 35, fat: 10, icon: '🥣' },
        { name: 'Oatmeal with Berries', calories: 290, protein: 12, carbs: 48, fat: 6, icon: '🥣' },
        { name: 'Scrambled Eggs on Toast', calories: 350, protein: 25, carbs: 25, fat: 16, icon: '🍳' },
    ],
    lunch: [
        { name: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 20, fat: 22, icon: '🥗' },
        { name: 'Quinoa Buddha Bowl', calories: 450, protein: 20, carbs: 55, fat: 18, icon: '🥣' },
        { name: 'Turkey Wrap', calories: 390, protein: 28, carbs: 35, fat: 14, icon: '🌯' },
    ],
    dinner: [
        { name: 'Baked Chicken with Veggies', calories: 460, protein: 40, carbs: 25, fat: 20, icon: '🍗' },
        { name: 'Grilled Fish Tacos', calories: 410, protein: 32, carbs: 35, fat: 16, icon: '🌮' },
        { name: 'Whole Wheat Pasta', calories: 500, protein: 30, carbs: 55, fat: 16, icon: '🍝' },
    ],
    snack: [
        { name: 'Apple with Almond Butter', calories: 220, protein: 7, carbs: 28, fat: 12, icon: '🍎' },
        { name: 'Protein Bar', calories: 250, protein: 20, carbs: 30, fat: 8, icon: '🥤' },
        { name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 8, fat: 16, icon: '🥜' },
    ]
};

export default function NutritionScreen() {
    const [consumed, setConsumed] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [water, setWater] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [mealForm, setMealForm] = useState({ type: 'breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' });

    const getPercentage = (current, target) => Math.min(100, Math.round((current / target) * 100));

    const logMeal = (meal) => {
        setConsumed(prev => ({
            calories: prev.calories + (meal.calories || 0),
            protein: prev.protein + (meal.protein || 0),
            carbs: prev.carbs + (meal.carbs || 0),
            fat: prev.fat + (meal.fat || 0)
        }));
    };

    const saveCustomMeal = () => {
        const meal = {
            name: mealForm.name,
            calories: parseInt(mealForm.calories) || 0,
            protein: parseInt(mealForm.protein) || 0,
            carbs: parseInt(mealForm.carbs) || 0,
            fat: parseInt(mealForm.fat) || 0
        };
        if (meal.name) {
            logMeal(meal);
            setShowModal(false);
            setMealForm({ type: 'breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' });
        }
    };

    const MacroCircle = ({ label, current, target, color }) => {
        const percent = getPercentage(current, target);
        return (
            <View style={styles.macroItem}>
                <View style={styles.macroCircleOuter}>
                    <View style={[styles.macroCircleInner, { borderColor: color, opacity: 0.2 }]} />
                    <View style={[styles.macroCircleProgress, {
                        borderColor: color,
                        borderLeftColor: percent > 25 ? color : 'transparent',
                        borderBottomColor: percent > 50 ? color : 'transparent',
                        borderRightColor: percent > 75 ? color : 'transparent',
                        opacity: percent > 0 ? 1 : 0.3
                    }]} />
                    <View style={styles.macroValueContainer}>
                        <Text style={[styles.macroCurrent, { color }]}>{current}</Text>
                        <Text style={styles.macroTarget}>{target}</Text>
                    </View>
                <Text style={styles.macroLabel}>{label}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        <Icon name="food-apple" size={20} color="#6c5ce7" /> Nutrition
                    </Text>
                    <TouchableOpacity style={styles.logBtn} onPress={() => setShowModal(true)}>
                        <Icon name="plus" size={16} color="#fff" />
                        <Text style={styles.logBtnText}>Log Meal</Text>
                    </TouchableOpacity>
                </View>

                {/* Macro Circles */}
                <View style={styles.macroGrid}>
                    <MacroCircle label="Calories" current={consumed.calories} target={INITIAL_MACROS.calories} color="#ff6b6b" />
                    <MacroCircle label="Protein (g)" current={consumed.protein} target={INITIAL_MACROS.protein} color="#4ecdc4" />
                    <MacroCircle label="Carbs (g)" current={consumed.carbs} target={INITIAL_MACROS.carbs} color="#45b7d1" />
                    <MacroCircle label="Fats (g)" current={consumed.fat} target={INITIAL_MACROS.fat} color="#f9ca24" />
                </View>

                {/* Meal Suggestions */}
                <Text style={styles.sectionTitle}>
                    <Icon name="utensils" size={16} color="#6c5ce7" /> Today's Meal Suggestions
                </Text>
                {Object.entries(MEAL_SUGGESTIONS).map(([type, meals]) => (
                    <View key={type}>
                        <Text style={styles.mealTypeLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                        {meals.map((meal, i) => (
                            <TouchableOpacity key={i} style={styles.mealItem} onPress={() => logMeal(meal)}>
                                <View style={styles.mealIcon}>
                                    <Text style={styles.mealEmoji}>{meal.icon}</Text>
                                </View>
                                <View style={styles.mealInfo}>
                                    <Text style={styles.mealName}>{meal.name}</Text>
                                    <Text style={styles.mealMacros}>
                                        {meal.calories} cal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                                    </Text>
                                </View>
                                <Icon name="plus-circle-outline" size={24} color="#6c5ce7" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Water Tracker */}
                <View style={styles.waterCard}>
                    <Text style={styles.sectionTitle}>
                        <Icon name="water" size={16} color="#45b7d1" /> Water Intake
                    </Text>
                    <View style={styles.waterGlasses}>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.waterGlass, i < water && styles.waterGlassFilled]}
                                onPress={() => setWater(Math.min(8, i + 1))}
                            >
                                <Icon name={i < water ? "water" : "water-outline"} size={20} color={i < water ? "#45b7d1" : "#6c6c8a"} />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.waterText}>{water}/8 glasses</Text>
                </View>
            </ScrollView>

            {/* Meal Log Modal */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Log Meal</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Icon name="close" size={24} color="#6c6c8a" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Meal Type</Text>
                        <View style={styles.typeRow}>
                            {['breakfast', 'lunch', 'dinner', 'snack'].map(t => (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.typeBtn, mealForm.type === t && styles.typeBtnActive]}
                                    onPress={() => setMealForm(prev => ({ ...prev, type: t }))}
                                >
                                    <Text style={[styles.typeBtnText, mealForm.type === t && styles.typeBtnTextActive]}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Food Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Grilled Chicken Salad"
                            placeholderTextColor="#6c6c8a"
                            value={mealForm.name}
                            onChangeText={v => setMealForm(prev => ({ ...prev, name: v }))}
                        />

                        <View style={styles.nutrientRow}>
                            <View style={styles.nutrientField}>
                                <Text style={styles.label}>Calories</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="450"
                                    placeholderTextColor="#6c6c8a"
                                    keyboardType="numeric"
                                    value={mealForm.calories}
                                    onChangeText={v => setMealForm(prev => ({ ...prev, calories: v }))}
                                />
                            </View>
                            <View style={styles.nutrientField}>
                                <Text style={styles.label}>Protein (g)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="30"
                                    placeholderTextColor="#6c6c8a"
                                    keyboardType="numeric"
                                    value={mealForm.protein}
                                    onChangeText={v => setMealForm(prev => ({ ...prev, protein: v }))}
                                />
                            </View>

                        <View style={styles.nutrientRow}>
                            <View style={styles.nutrientField}>
                                <Text style={styles.label}>Carbs (g)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="45"
                                    placeholderTextColor="#6c6c8a"
                                    keyboardType="numeric"
                                    value={mealForm.carbs}
                                    onChangeText={v => setMealForm(prev => ({ ...prev, carbs: v }))}
                                />
                            </View>
                            <View style={styles.nutrientField}>
                                <Text style={styles.label}>Fat (g)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="15"
                                    placeholderTextColor="#6c6c8a"
                                    keyboardType="numeric"
                                    value={mealForm.fat}
                                    onChangeText={v => setMealForm(prev => ({ ...prev, fat: v }))}
                                />
                            </View>

                        <TouchableOpacity style={styles.saveBtn} onPress={saveCustomMeal}>
                            <Icon name="check" size={20} color="#fff" />
                            <Text style={styles.saveBtnText}>Log Meal</Text>
                        </TouchableOpacity>
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
    logBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#6c5ce7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    logBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    macroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    macroItem: { width: '47%', alignItems: 'center', marginBottom: 12 },
    macroCircleOuter: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    macroCircleInner: { position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 5 },
    macroCircleProgress: { position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 5 },
    macroValueContainer: { alignItems: 'center' },
    macroCurrent: { fontSize: 16, fontWeight: '700' },
    macroTarget: { fontSize: 10, color: '#6c6c8a' },
    macroLabel: { fontSize: 11, color: '#b0b0cc' },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
    mealTypeLabel: { fontSize: 13, color: '#6c6c8a', textTransform: 'capitalize', marginBottom: 8, marginTop: 4 },
    mealItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1a1a3e', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a5e' },
    mealIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    mealEmoji: { fontSize: 24 },
    mealInfo: { flex: 1 },
    mealName: { fontSize: 14, fontWeight: '500', color: '#fff' },
    mealMacros: { fontSize: 11, color: '#6c6c8a', marginTop: 2 },
    waterCard: { backgroundColor: '#1a1a3e', borderRadius: 16, padding: 16, marginTop: 12, borderWidth: 1, borderColor: '#2a2a5e' },
    waterGlasses: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
    waterGlass: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#12122a', borderWidth: 1, borderColor: '#2a2a5e' },
    waterGlassFilled: { backgroundColor: 'rgba(69, 183, 209, 0.2)', borderColor: '#45b7d1' },
    waterText: { textAlign: 'center', fontSize: 13, color: '#6c6c8a' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1a1a3e', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    label: { color: '#b0b0cc', fontSize: 13, marginBottom: 6, marginTop: 12 },
    typeRow: { flexDirection: 'row', gap: 6 },
    typeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#12122a', borderWidth: 1, borderColor: '#2a2a5e' },
    typeBtnActive: { backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' },
    typeBtnText: { color: '#b0b0cc', fontSize: 12, fontWeight: '500' },
    typeBtnTextActive: { color: '#fff' },
    input: { backgroundColor: '#12122a', borderWidth: 1, borderColor: '#2a2a5e', borderRadius: 10, padding: 12, color: '#fff', fontSize: 14 },
    nutrientRow: { flexDirection: 'row', gap: 12 },
    nutrientField: { flex: 1 },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6c5ce7', padding: 14, borderRadius: 12, marginTop: 20 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
