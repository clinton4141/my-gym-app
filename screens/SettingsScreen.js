import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>

        {/* PROFILE */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-outline" size={24} color="white" />
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>

        {/* NOTIFICATIONS */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color="white" />
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>

        {/* THEME */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Theme")}
        >
          <Ionicons name="color-palette-outline" size={24} color="white" />
          <Text style={styles.optionText}>Theme</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  header: {
    color: "#ff6600",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    marginTop: 10,
  },
  option: {
    backgroundColor: "#1a1a1a",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  optionText: {
    color: "white",
    fontSize: 18,
    marginLeft: 12,
  },
});


