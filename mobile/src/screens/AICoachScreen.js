/* ============================================================
   FitAI - AI Coach Screen (React Native)
   ============================================================ */

import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, ScrollView, StyleSheet,
    SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const INITIAL_MESSAGE = {
    role: 'bot',
    text: "Hey there! 👋 I'm your AI fitness coach. I can help you with:\n\n• 💪 Personalized workout plans\n• 🥗 Nutrition & meal guidance\n• 📊 Progress tracking & insights\n• 🎯 Motivation & tips\n\nWhat would you like help with today?"
};

const QUICK_REPLIES = [
    { icon: 'dumbbell', text: 'Plan Workout' },
    { icon: 'food-apple', text: 'Meal Ideas' },
    { icon: 'chart-line', text: 'My Progress' },
    { icon: 'fire', text: 'Motivate Me' },
];

export default function AICoachScreen() {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();

    const sendMessage = (text) => {
        const message = text || inputText;
        if (!message.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: message }]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false);
            const response = generateResponse(message);
            setMessages(prev => [...prev, { role: 'bot', text: response }]);
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 1000);
    };

    const generateResponse = (query) => {
        const lower = query.toLowerCase();
        if (lower.includes('workout') || lower.includes('plan')) {
            return "Here's today's workout plan! 🎯\n\n**FULL BODY** - Moderate intensity\nDuration: 45 min\n\n1. Push-ups - 3x12-15\n2. Squats - 3x15-20\n3. Plank - 3x30-60 sec\n4. Dumbbell Rows - 3x12 each\n5. Mountain Climbers - 3x30 sec\n\nReady to crush it? 💪";
        }
        if (lower.includes('meal') || lower.includes('food') || lower.includes('eat')) {
            return "Here's a nutritious meal idea! 🍽️\n\n**Grilled Chicken Salad** 🥗\n• 200g grilled chicken breast\n• Mixed greens, cherry tomatoes\n• Avocado, cucumber\n• Olive oil dressing\n\nMacros: ~420 cal | P: 35g | C: 20g | F: 22g\n\nWant more suggestions?";
        }
        if (lower.includes('progress') || lower.includes('improving')) {
            return "📊 **Your Progress Report**\n\n✅ Workouts completed: 5\n🔥 Total calories burned: 1,750\n📅 Current streak: 3 days\n\n🌟 You're on track! At this pace, you'll reach your goal in about 6 weeks!";
        }
        if (lower.includes('motivate') || lower.includes('tired') || lower.includes('hard')) {
            return "You're crushing it! 💪 Remember why you started! 🎯\n\n\"The only bad workout is the one you didn't do.\" - Unknown\n\nTake a deep breath, you've got this! Let's go! 🔥";
        }
        return "I'm here to help with your fitness journey! Try asking me about:\n• 📋 Planning a workout\n• 🥗 Nutrition advice\n• 📈 Your progress\n• 🔥 Motivation\n\nWhat interests you? 🤔";
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Chat Messages */}
                <ScrollView
                    ref={scrollRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                >
                    {messages.map((msg, i) => (
                        <View key={i} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
                            <View style={[styles.messageContent, msg.role === 'user' ? styles.userContent : styles.botContent]}>
                                <Text style={[styles.messageText, msg.role === 'user' && styles.userText]}>
                                    {msg.text}
                                </Text>
                            </View>
                        </View>
                    ))}
                    {isTyping && (
                        <View style={styles.typingIndicator}>
                            <View style={styles.typingDot} />
                            <View style={[styles.typingDot, { animationDelay: '0.2s' }]} />
                            <View style={[styles.typingDot, { animationDelay: '0.4s' }]} />
                        </View>
                    )}
                </ScrollView>

                {/* Quick Replies */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplies}>
                    {QUICK_REPLIES.map((qr, i) => (
                        <TouchableOpacity key={i} style={styles.quickReplyBtn} onPress={() => sendMessage(qr.text)}>
                            <Icon name={qr.icon} size={16} color="#6c5ce7" />
                            <Text style={styles.quickReplyText}>{qr.text}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask your AI coach anything..."
                        placeholderTextColor="#6c6c8a"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={() => sendMessage()}
                        returnKeyType="send"
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
                        <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    flex: { flex: 1 },
    messagesContainer: { flex: 1 },
    messagesContent: { padding: 16, paddingBottom: 8 },
    message: { marginBottom: 12, maxWidth: '85%' },
    userMessage: { alignSelf: 'flex-end' },
    botMessage: { alignSelf: 'flex-start' },
    messageContent: { padding: 12, borderRadius: 16 },
    userContent: { backgroundColor: '#6c5ce7', borderBottomRightRadius: 4 },
    botContent: { backgroundColor: '#1a1a3e', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#2a2a5e' },
    messageText: { color: '#fff', fontSize: 14, lineHeight: 20 },
    userText: { color: '#fff' },
    typingIndicator: { flexDirection: 'row', gap: 4, padding: 12, backgroundColor: '#1a1a3e', borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
    typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6c6c8a' },
    quickReplies: { paddingHorizontal: 16, marginBottom: 8 },
    quickReplyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a3e', borderWidth: 1, borderColor: '#2a2a5e', marginRight: 8 },
    quickReplyText: { color: '#b0b0cc', fontSize: 13, fontWeight: '500' },
    inputContainer: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: '#12122a', borderTopWidth: 1, borderTopColor: '#2a2a5e' },
    input: { flex: 1, backgroundColor: '#1a1a3e', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 14 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6c5ce7', alignItems: 'center', justifyContent: 'center' },
});

