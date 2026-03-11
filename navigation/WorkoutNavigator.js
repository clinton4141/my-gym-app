import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartWorkoutScreen from '../screens/StartWorkoutScreen';
import WorkoutPreviewScreen from '../screens/WorkoutPreviewScreen';
import WorkoutPlayerScreen from '../screens/WorkoutPlayerScreen';
import WorkoutOverviewScreen from '../screens/WorkoutOverviewScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import WorkoutGenerator from '../screens/WorkoutGenerator';

const Stack = createNativeStackNavigator();

export default function WorkoutNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartWorkout" component={StartWorkoutScreen} />
      <Stack.Screen name="WorkoutPreview" component={WorkoutPreviewScreen} />
      <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />
      <Stack.Screen name="WorkoutOverview" component={WorkoutOverviewScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="WorkoutGenerator" component={WorkoutGenerator} />
    </Stack.Navigator>
  );
}
