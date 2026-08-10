 import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HISTORY = [
  { date: '2024-01-06', duration: 45, calories: 320, exercises: 6, type: 'Upper Body' },
  { date: '2024-01-05', duration: 40, calories: 280, exercises: 5, type: 'Lower Body' },
  { date: '2024-01-04', duration: 35, calories: 250, exercises: 5, type: 'Cardio' },
  { date: '2024-01-03', duration: 50, calories: 380, exercises: 7, type: 'Full Body' },
  { date: '2024-01-02', duration: 30, calories: 200, exercises: 4, type: 'Recovery' },
  { date: '2024-01-01', duration: 45, calories: 310, exercises: 6, type: 'Upper Body' },
];

const BADGES = [
  { id: '1', name: 'First Workout', icon: 'trophy', unlocked: true },
  { id: '2', name: '7-Day Streak', icon: 'fire', unlocked: true },
  { id: '3', name: '30-Day Warrior', icon: 'arm-flex', unlocked: false },
  { id: '4', name: '10K Cal Burn', icon: 'lightning-bolt', unlocked: true },
  { id: '5', name: 'Perfect Week', icon: 'star', unlocked: false },
  { id: '6', name: 'Early Bird', icon: 'weather-sunset-up', unlocked: false },
  { id: '7', name: 'Challenge King', icon: 'crown', unlocked: false },
  { id: '8', name: 'Strength Up', icon: 'weight-lifter', unlocked: true },
];

export default function ProgressScreen() {
  const [tab, setTab] = useState('charts');
  const s = useMemo(() => {
    const t = HISTORY.length;
    const c = HISTORY.reduce((a, w) => a + w.calories, 0);
    const m = HISTORY.reduce((a, w) => a + w.duration, 0);
    return { total: t, cal: c, min: m, streak: 7 };
  }, []);

  const bars = HISTORY.slice(0, 7).reverse();
  const colors = ['#ff6b6b','#ff9a6c','#6c5ce7','#45b7d1','#4ecdc4','#f9ca24','#ff6b6b'];

  return (
    <SafeAreaView style={st.container}>
      <ScrollView style={st.scroll}>
        <Text style={st.title}><Icon name="chart-line" size={20} color="#6c5ce7" /> Progress</Text>

        {/* Tabs */}
        <View style={st.tabRow}>
          {['charts','history','badges'].map(t => (
            <TouchableOpacity key={t} style={[st.tab, tab === t && st.tabActive]} onPress={() => setTab(t)}>
              <Icon name={t==='charts'?'chart-bar':t==='history'?'history':'trophy'} size={16} color={tab===t?'#fff':'#6c6c8a'} />
              <Text style={[st.tabText, tab===t && st.tabActiveText]}>{t.charAt(0).toUpperCase()+t.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={st.statRow}>
          <View style={st.statCard}><Icon name="fire" size={24} color="#ff6b6b" /><Text style={st.statVal}>{s.cal}</Text><Text style={st.statLbl}>Calories</Text></View>
          <View style={st.statCard}><Icon name="clock-outline" size={24} color="#45b7d1" /><Text style={st.statVal}>{s.min}</Text><Text style={st.statLbl}>Minutes</Text></View>
          <View style={st.statCard}><Icon name="run" size={24} color="#4ecdc4" /><Text style={st.statVal}>{s.total}</Text><Text style={st.statLbl}>Workouts</Text></View>


        {/* Prediction */}
        <View style={st.predCard}>
          <Icon name="robot" size={28} color="#ff6b6b" />
          <View style={st.predText}><Text style={st.predTitle}>AI Insight</Text><Text style={st.predBody}>At this pace, you'll reach your goal in ~6 weeks!</Text></View>

        {/* Charts Tab */}
        {tab === 'charts' && (
          <View style={st.card}>
            <Text style={st.cardTitle}>Weekly Calorie Burn</Text>
            <View style={st.chart}>
              {bars.map((w, i) => (
                <View key={i} style={st.barCol}>
                  <Text style={st.barVal}>{w.calories}</Text>
                  <View style={[st.bar, { height: Math.max(20, (w.calories/400)*120), backgroundColor: colors[i] }]} />
                  <Text style={st.barLbl}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}</Text>
                </View>
              ))}
            </View>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <>
            <Text style={st.sectionTitle}>Recent Workouts</Text>
            {HISTORY.map((w, i) => (
              <View key={i} style={st.histItem}>
                <View style={st.histDate}>
                  <Text style={st.histDay}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(w.date).getDay()]}</Text>
                  <Text style={st.histNum}>{new Date(w.date).getDate()}</Text>
                </View>
                <View style={st.histInfo}>
                  <Text style={st.histName}>{w.type}</Text>
                  <Text style={st.histDetail}>{w.duration}min | {w.calories}cal</Text>
                </View>
                <Icon name="check-circle" size={24} color="#4ecdc4" />
              </View>
            ))}
          </>
        )}

        {/* Badges Tab */}
        {tab === 'badges' && (
          <>
            <Text style={st.sectionTitle}>Badges</Text>
            <View style={st.badgeGrid}>
              {BADGES.map(b => (
                <View key={b.id} style={[st.badge, !b.unlocked && st.badgeLock]}>
                  <Icon name={b.icon} size={28} color={b.unlocked?'#6c5ce7':'#6c6c8a'} />
                  <Text style={st.badgeName}>{b.name}</Text>
                  {!b.unlocked && <Icon name="lock" size={12} color="#6c6c8a" />}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  scroll: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
  tabRow: { flexDirection: 'row', backgroundColor: '#1a1a3e', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  tabActive: { backgroundColor: '#6c5ce7' },
  tabText: { fontSize: 13, color: '#6c6c8a', fontWeight: '500' },
  tabActiveText: { color: '#fff' },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statCard: { width: '47%', backgroundColor: '#1a1a3e', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a5e' },
  statVal: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 8 },
  statLbl: { fontSize: 11, color: '#6c6c8a', marginTop: 4 },
  predCard: { flexDirection: 'row', gap: 12, backgroundColor: 'rgba(255,107,53,0.1)', borderWidth: 1, borderColor: 'rgba(255,107,53,0.3)', borderRadius: 16, padding: 16, marginBottom: 16 },
  predText: { flex: 1 },
  predTitle: { fontSize: 16, fontWeight: '600', color: '#ff6b6b', marginBottom: 4 },
  predBody: { fontSize: 13, color: '#b0b0cc', lineHeight: 20 },
  card: { backgroundColor: '#1a1a3e', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a5e' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 16 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barCol: { alignItems: 'center', flex: 1 },
  barVal: { fontSize: 10, color: '#6c6c8a', marginBottom: 4 },
  bar: { width: 24, borderRadius: 12 },
  barLbl: { fontSize: 10, color: '#6c6c8a', marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  histItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1a1a3e', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a5e' },
  histDate: { alignItems: 'center', width: 40 },
  histDay: { fontSize: 11, color: '#6c6c8a' },
  histNum: { fontSize: 18, fontWeight: '700', color: '#fff' },
  histInfo: { flex: 1 },
  histName: { fontSize: 14, fontWeight: '500', color: '#fff' },
  histDetail: { fontSize: 11, color: '#6c6c8a', marginTop: 2 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: { width: '22%', backgroundColor: '#1a1a3e', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a5e' },
  badgeLock: { opacity: 0.4 },
  badgeName: { fontSize: 10, color: '#b0b0cc', textAlign: 'center', marginTop: 4 },
});
