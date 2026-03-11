import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from '../screens/SettingsScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import ThemeScreen from '../screens/ThemeScreen.js';
import NotificationsScreen from '../screens/NotificationsScreen.js';
import WorkoutReminderScreen from '../screens/WorkoutReminderScreen.js';

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SettingsHome"   // ⭐ FIX: ensures full settings page loads first
    >
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />

      {/* Sub‑pages */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Theme" component={ThemeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="WorkoutReminder" component={WorkoutReminderScreen} />
    </Stack.Navigator>
  );
}

