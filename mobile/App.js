/* ============================================================
   FitAI - React Native Mobile App Entry Point
   ============================================================ */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Store
import { store } from './src/store';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import AICoachScreen from './src/screens/AICoachScreen';
import NutritionScreen from './src/screens/NutritionScreen';
import ProgressScreen from './src/screens/ProgressScreen';

LogBox.ignoreLogs(['Remote debugger']);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Dashboard': iconName = 'view-dashboard-outline'; break;
                        case 'Workout': iconName = 'dumbbell'; break;
                        case 'AICoach': iconName = 'robot-outline'; break;
                        case 'Nutrition': iconName = 'food-apple-outline'; break;
                        case 'Progress': iconName = 'chart-line'; break;
                        default: iconName = 'circle';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6c5ce7',
                tabBarInactiveTintColor: '#6c6c8a',
                tabBarStyle: {
                    backgroundColor: '#12122a',
                    borderTopColor: '#2a2a5e',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60
                },
                headerStyle: {
                    backgroundColor: '#12122a',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: '700',
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Workout" component={WorkoutScreen} />
            <Tab.Screen name="AICoach" component={AICoachScreen} options={{ title: 'AI Coach' }} />
            <Tab.Screen name="Nutrition" component={NutritionScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [isOnboarded, setIsOnboarded] = React.useState(false);

    return (
        <Provider store={store}>
            <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {!isOnboarded ? (
                        <Stack.Screen name="Onboarding">
                            {props => <OnboardingScreen {...props} onComplete={() => setIsOnboarded(true)} />}
                        </Stack.Screen>
                    ) : (
                        <Stack.Screen name="Main" component={MainTabs} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

