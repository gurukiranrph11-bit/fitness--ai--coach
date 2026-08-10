/* ============================================================
   FitAI - Dashboard Screen (React Native)
   ============================================================ */

import React from 'react';
import {
    View, Text, ScrollView, StyleSheet, SafeAreaView,
    TouchableOpacity, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const greeting = (() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    })();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Greeting */}
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>{greeting}, Athlete! 👋</Text>
                    <Text style={styles.motivation}>Let's crush today's workout!</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                        <Icon name="fire" size={24} color="#f9ca24" style={styles.statIcon} />
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>--</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                        <Icon name="lightning-bolt" size={24} color="#6c5ce7" style={styles.statIcon} />
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>--</Text>
                        <Text style={styles.statLabel}>Minutes</Text>
                        <Icon name="clock-outline" size={24} color="#6c5ce7" style={styles.statIcon} />
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Badges</Text>
                        <Icon name="medal" size={24} color="#6c5ce7" style={styles.statIcon} />
                    </View>
                </View>

                {/* Today's Workout Card */}
                <TouchableOpacity style={styles.workoutCard} onPress={() => navigation.navigate('Workout')}>
                    <View style={styles.workoutCardHeader}>
                        <Text style={styles.cardTitle}>
                            <Icon name="dumbbell" size={18} color="#6c5ce7" /> Today's Workout
                        </Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Ready</Text>
                        </View>
                    </View>
                    <Text style={styles.mutedText}>Complete onboarding to generate your plan</Text>
                </TouchableOpacity>

                {/* Weekly Activity Chart Placeholder */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        <Icon name="chart-bar" size={18} color="#6c5ce7" /> This Week
                    </Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.mutedText}>Weekly activity chart</Text>
                    </View>
                </View>

                {/* AI Coach Nudge */}
                <TouchableOpacity style={styles.nudgeCard} onPress={() => navigation.navigate('AICoach')}>
                    <View style={styles.nudgeContent}>
                        <View style={styles.nudgeAvatar}>
                            <Icon name="robot" size={24} color="#fff" />
                        </View>
                        <View style={styles.nudgeTextContainer}>
                            <Text style={styles.nudgeText}>Complete your profile so I can help you reach your goals! 🎯</Text>
                            <Text style={styles.nudgeTime}>AI Coach</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color="#6c6c8a" />
                    </View>
                </TouchableOpacity>

                {/* Recent Activity */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        <Icon name="history" size={18} color="#6c5ce7" /> Recent Activity
                    </Text>
                    <Text style={styles.mutedText}>No activity logged yet</Text>
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
        padding: 16,
        paddingBottom: 24,
    },
    greetingContainer: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    motivation: {
        fontSize: 14,
        color: '#6c6c8a',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1a1a3e',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#2a2a5e',
        overflow: 'hidden',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    statLabel: {
        fontSize: 10,
        color: '#6c6c8a',
        marginTop: 2,
    },
    statIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        opacity: 0.15,
    },
    card: {
        backgroundColor: '#1a1a3e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2a2a5e',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    workoutCard: {
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(108, 92, 231, 0.2)',
    },
    workoutCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badge: {
        backgroundColor: 'rgba(0, 230, 118, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        color: '#00e676',
        fontWeight: '600',
    },
    mutedText: {
        color: '#6c6c8a',
        fontSize: 14,
    },
    chartPlaceholder: {
        height: 150,
        backgroundColor: '#12122a',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nudgeCard: {
        backgroundColor: 'rgba(108, 92, 231, 0.08)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(108, 92, 231, 0.15)',
    },
    nudgeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    nudgeAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6c5ce7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nudgeTextContainer: {
        flex: 1,
    },
    nudgeText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    nudgeTime: {
        color: '#6c6c8a',
        fontSize: 12,
        marginTop: 4,
    },
});

