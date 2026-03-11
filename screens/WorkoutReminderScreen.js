import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Notification handler (required)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function WorkoutReminderScreen() {
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    requestPermissions();
    setupAndroidChannel();
  }, []);

  // Ask for notification permissions
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
  };

  // Android requires a channel
  const setupAndroidChannel = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  };

  // Schedule a test reminder
  const scheduleReminder = async () => {
    if (permissionStatus !== "granted") {
      alert("Enable notifications in settings.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Workout Reminder",
        body: "Time to train! Stay consistent.",
      },
      trigger: {
        channelId: "default", // REQUIRED on Android
        seconds: 5,           // Fires in 5 seconds
      },
    });

    alert("Reminder set for 5 seconds from now!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Reminder</Text>
      <Text style={styles.subtitle}>Set a quick test reminder.</Text>

      <TouchableOpacity style={styles.button} onPress={scheduleReminder}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
