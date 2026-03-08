import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import EquipmentScreen from '../screens/EquipmentScreen';
import AddEquipmentScreen from '../screens/AddEquipmentScreen';
import StartWorkoutScreen from '../screens/StartWorkoutScreen';
import WorkoutOverviewScreen from '../screens/WorkoutOverviewScreen';
import WorkoutPlayerScreen from '../screens/WorkoutPlayerScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ThemeScreen from '../screens/ThemeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Equipment" component={EquipmentScreen} />
        <Stack.Screen name="AddEquipment" component={AddEquipmentScreen} />
        <Stack.Screen name="StartWorkout" component={StartWorkoutScreen} />
        <Stack.Screen name="WorkoutOverview" component={WorkoutOverviewScreen} />
        <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Theme" component={ThemeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

