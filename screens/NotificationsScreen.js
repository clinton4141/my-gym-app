import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);

    if (status !== "granted") {
      Alert.alert("Permission Needed", "Enable notifications in settings.");
      return;
    }

    if (Device.isDevice) {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
    }
  };

  const sendLocalTestNotification = async () => {
    if (permissionStatus !== "granted") {
      Alert.alert("Notifications Disabled", "Please enable notifications first.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Local Test Notification",
        body: "Local notifications are working perfectly!",
        sound: "default",
      },
      trigger: null,
    });

    Alert.alert("Success", "Local test notification sent!");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Push Notifications</Text>

        <Text style={styles.description}>
          Manage your notification settings and test alerts.
        </Text>

        {/* LOCAL TEST BUTTON */}
        <TouchableOpacity style={styles.button} onPress={sendLocalTestNotification}>
          <Text style={styles.buttonText}>Send Local Test Notification</Text>
        </TouchableOpacity>

        {/* EXPO PUSH TOKEN */}
        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>Expo Push Token:</Text>
          <Text style={styles.tokenValue}>
            {expoPushToken ? expoPushToken : "Generating..."}
          </Text>
        </View>

        {/* FUTURE PUSH TEST BUTTON */}
        <TouchableOpacity
          style={[styles.buttonDisabled]}
          onPress={() => Alert.alert("Coming Soon", "Push test will be enabled when backend is ready.")}
        >
          <Text style={styles.buttonText}>Send Expo Push Test (Coming Soon)</Text>
        </TouchableOpacity>

        {/* STATUS */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Permission Status:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: permissionStatus === "granted" ? "#4CAF50" : "#ff4444" },
            ]}
          >
            {permissionStatus || "Checking..."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tokenBox: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 20,
  },
  tokenLabel: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
  },
  tokenValue: {
    color: "#ff6600",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusBox: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 40,
  },
  statusLabel: {
    color: "#ccc",
    fontSize: 14,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
});


