import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WorkoutHistoryScreen from "../screens/WorkoutHistoryScreen";

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryHome" component={WorkoutHistoryScreen} />
    </Stack.Navigator>
  );
}
