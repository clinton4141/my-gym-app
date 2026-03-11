import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import EquipmentScreen from '../screens/EquipmentScreen';
import HistoryScreen from '../screens/WorkoutHistoryScreen';
import SettingsNavigator from './SettingsNavigator';
import WorkoutNavigator from './WorkoutNavigator';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF7A00',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#222',
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Equipment" component={EquipmentScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"   // ⭐ FIX: ensures tabs load first
    >

      {/* Hidden workout flow */}
      <RootStack.Screen name="WorkoutFlow" component={WorkoutNavigator} />

      {/* Main tabs */}
      <RootStack.Screen name="MainTabs" component={MainTabs} />

    </RootStack.Navigator>
  );
}

