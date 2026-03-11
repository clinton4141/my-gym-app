import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { fullSync } from "../services/syncService";
import useThemeColors from "../hooks/useThemeColors";

export default function SettingsScreen({ navigation }) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      {/* 🔥 Manual Backup Button */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={async () => {
          await fullSync();
          alert("Backup completed!");
        }}
      >
        <Text style={[styles.itemText, { color: colors.text }]}>
          Backup Now
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={[styles.itemText, { color: colors.text }]}>Profile</Text>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => navigation.navigate("Notifications")}
      >
        <Text style={[styles.itemText, { color: colors.text }]}>
          Notifications
        </Text>
      </TouchableOpacity>

      {/* Theme */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => navigation.navigate("Theme")}
      >
        <Text style={[styles.itemText, { color: colors.text }]}>Theme</Text>
      </TouchableOpacity>

      {/* Workout Reminder */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => navigation.navigate("WorkoutReminder")}
      >
        <Text style={[styles.itemText, { color: colors.text }]}>
          Workout Reminder
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  item: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },

  itemText: {
    fontSize: 18,
    fontWeight: "500",
  },
});






