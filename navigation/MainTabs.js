import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeStack from "./HomeStack";
import EquipmentStack from "./EquipmentStack";
import HistoryStack from "./HistoryStack";
import SettingsNavigator from "./SettingsNavigator";   // ✅ FIXED

import useThemeColors from "../hooks/useThemeColors";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 105,
          paddingBottom: 20,
          paddingTop: 10,
          position: "absolute",
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.subtext,
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "HomeTab") iconName = "barbell";
          if (route.name === "EquipmentTab") iconName = "add-circle";
          if (route.name === "HistoryTab") iconName = "stats-chart";
          if (route.name === "SettingsTab") iconName = "settings";

          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: "Home" }} />

      <Tab.Screen
        name="EquipmentTab"
        component={EquipmentStack}
        options={{ title: "Add Equipment" }}
      />

      <Tab.Screen name="HistoryTab" component={HistoryStack} options={{ title: "History" }} />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsNavigator}   // ✅ FIXED
        options={{ title: "Settings" }}
      />
    </Tab.Navigator>
  );
}
