import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState(null);

  // Ask for permission + get token
  async function registerForPushNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Enable notifications in settings.");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
    await AsyncStorage.setItem("pushToken", token);
  }

  // Load saved toggle state
  useEffect(() => {
    async function loadSettings() {
      const saved = await AsyncStorage.getItem("notificationsEnabled");
      if (saved !== null) setEnabled(saved === "true");
    }
    loadSettings();
  }, []);

  // Save toggle state + register token
  async function toggleNotifications(value) {
    setEnabled(value);
    await AsyncStorage.setItem("notificationsEnabled", value.toString());

    if (value) {
      registerForPushNotifications();
    }
  }

  // Send a test notification
  async function sendTestNotification() {
    if (!expoPushToken) {
      Alert.alert("No token", "Enable notifications first.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "Your push notifications are working!",
      },
      trigger: null,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Enable Push Notifications</Text>
        <Switch
          value={enabled}
          onValueChange={toggleNotifications}
          thumbColor={enabled ? "#ff6600" : "#888"}
          trackColor={{ true: "#ff6600", false: "#333" }}
        />
      </View>

      {enabled && (
        <TouchableOpacity style={styles.testButton} onPress={sendTestNotification}>
          <Text style={styles.testText}>Send Test Notification</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.info}>
        Notifications remind you about workouts, goals, and progress.
      </Text>
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
  row: {
    backgroundColor: "#1a1a1a",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 18,
  },
  testButton: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  testText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    color: "white",
    opacity: 0.6,
    marginTop: 20,
    fontSize: 14,
  },
});

