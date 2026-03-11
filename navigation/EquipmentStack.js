import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddEquipmentScreen from "../screens/AddEquipmentScreen";
import EquipmentScreen from "../screens/EquipmentScreen";
import EditEquipmentScreen from "../screens/EditEquipmentScreen";

const Stack = createNativeStackNavigator();

export default function EquipmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* FIRST SCREEN */}
      <Stack.Screen name="AddEquipment" component={AddEquipmentScreen} />

      {/* IMPORTANT: This name MUST be EXACT */}
      <Stack.Screen name="EquipmentHome" component={EquipmentScreen} />

      <Stack.Screen name="EditEquipment" component={EditEquipmentScreen} />
    </Stack.Navigator>
  );
}


