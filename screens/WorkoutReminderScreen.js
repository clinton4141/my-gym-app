import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function WorkoutReminderScreen() {
  const [permissionStatus, setPermissionStatus] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const [message, setMessage] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const [reminders, setReminders] = useState([]);

  // NEW: track editing mode
  const [editingReminder, setEditingReminder] = useState(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    requestPermissions();
    setupAndroidChannel();
    loadReminders();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
  };

  const setupAndroidChannel = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  };

  const loadReminders = async () => {
    const stored = await AsyncStorage.getItem("reminders");
    if (stored) setReminders(JSON.parse(stored));
  };

  const saveReminders = async (list) => {
    setReminders(list);
    await AsyncStorage.setItem("reminders", JSON.stringify(list));
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const scheduleReminder = async (reminder) => {
    const dayMap = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7,
    };

    const ids = [];

    for (const day of reminder.days) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Workout Reminder",
          body: reminder.message || "Time to train!",
        },
        trigger: {
          weekday: dayMap[day],
          hour: reminder.hour,
          minute: reminder.minute,
          repeats: true,
          channelId: "default",
        },
      });

      ids.push(id);
    }

    return ids;
  };

  const cancelReminder = async (reminder) => {
    if (!reminder.notificationIds) return;
    for (const id of reminder.notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  };

  const addReminder = async () => {
    if (selectedDays.length === 0) {
      alert("Please select at least one day.");
      return;
    }

    const newReminder = {
      id: uuid.v4(),
      days: selectedDays,
      hour: parseInt(hour),
      minute: parseInt(minute),
      message,
      enabled: true,
      notificationIds: [],
    };

    const ids = await scheduleReminder(newReminder);
    newReminder.notificationIds = ids;

    const updated = [...reminders, newReminder];
    saveReminders(updated);

    setModalVisible(false);
    setMessage("");
    setSelectedDays([]);
  };

  // NEW: update existing reminder
  const updateReminder = async () => {
    if (!editingReminder) return;

    await cancelReminder(editingReminder);

    const updatedReminder = {
      ...editingReminder,
      days: selectedDays,
      hour: parseInt(hour),
      minute: parseInt(minute),
      message,
      enabled: true,
    };

    const ids = await scheduleReminder(updatedReminder);
    updatedReminder.notificationIds = ids;

    const updatedList = reminders.map((r) =>
      r.id === editingReminder.id ? updatedReminder : r
    );

    saveReminders(updatedList);

    setEditingReminder(null);
    setModalVisible(false);
  };

  const toggleReminder = async (reminder) => {
    const updated = reminders.map((r) => {
      if (r.id === reminder.id) {
        return { ...r, enabled: !r.enabled };
      }
      return r;
    });

    saveReminders(updated);

    if (!reminder.enabled) {
      const ids = await scheduleReminder(reminder);
      reminder.notificationIds = ids;
    } else {
      await cancelReminder(reminder);
    }
  };

  // NEW: delete reminder
  const deleteReminder = async (reminder) => {
    await cancelReminder(reminder);

    const updated = reminders.filter((r) => r.id !== reminder.id);
    saveReminders(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Reminders</Text>

      {/* ADD REMINDER BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setEditingReminder(null);
          setHour("08");
          setMinute("00");
          setMessage("");
          setSelectedDays([]);
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>

      {/* REMINDER LIST */}
      <ScrollView style={{ marginTop: 20 }}>
        {reminders.map((r) => (
          <View key={r.id} style={styles.reminderItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderText}>
                {r.days.join(", ")} — {r.hour.toString().padStart(2, "0")}:
                {r.minute.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.reminderMessage}>{r.message}</Text>
            </View>

            {/* Toggle */}
            <Switch
              value={r.enabled}
              onValueChange={() => toggleReminder(r)}
              thumbColor={r.enabled ? "#ff6600" : "#666"}
            />

            {/* Edit */}
            <TouchableOpacity
              onPress={() => {
                setEditingReminder(r);
                setHour(r.hour.toString().padStart(2, "0"));
                setMinute(r.minute.toString().padStart(2, "0"));
                setMessage(r.message);
                setSelectedDays(r.days);
                setModalVisible(true);
              }}
              style={styles.editButton}
            >
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              onPress={() => deleteReminder(r)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingReminder ? "Edit Reminder" : "New Reminder"}
            </Text>

            <View style={styles.daysRow}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* DIGITAL TIME PICKER */}
            <View style={styles.timeRow}>
              <ScrollView style={styles.timeColumn}>
                {Array.from({ length: 24 }).map((_, i) => {
                  const val = i.toString().padStart(2, "0");
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setHour(val)}
                      style={[
                        styles.timeItem,
                        hour === val && styles.timeItemSelected,
                      ]}
                    >
                      <Text style={styles.timeText}>{val}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.timeColon}>:</Text>

              <ScrollView style={styles.timeColumn}>
                {Array.from({ length: 60 }).map((_, i) => {
                  const val = i.toString().padStart(2, "0");
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setMinute(val)}
                      style={[
                        styles.timeItem,
                        minute === val && styles.timeItemSelected,
                      ]}
                    >
                      <Text style={styles.timeText}>{val}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Reminder message"
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingReminder ? updateReminder : addReminder}
            >
              <Text style={styles.saveButtonText}>
                {editingReminder ? "Save Changes" : "Save Reminder"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditingReminder(null);
                setModalVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
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

  reminderItem: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    color: "white",
    fontSize: 18,
  },
  reminderMessage: {
    color: "#ccc",
    fontSize: 14,
  },

  editButton: {
    marginLeft: 10,
    padding: 6,
  },
  editText: {
    fontSize: 20,
    color: "#ffaa00",
  },

  deleteButton: {
    marginLeft: 10,
    padding: 6,
  },
  deleteText: {
    fontSize: 20,
    color: "#ff4444",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  dayButtonSelected: {
    backgroundColor: "#ff6600",
  },
  dayText: {
    color: "white",
    fontSize: 14,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  timeColumn: {
    height: 120,
    width: 60,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  timeItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
  timeItemSelected: {
    backgroundColor: "#ff6600",
  },
  timeText: {
    color: "white",
    fontSize: 18,
  },
  timeColon: {
    color: "white",
    fontSize: 28,
    marginHorizontal: 10,
  },

  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },

  saveButton: {
    backgroundColor: "#ff6600",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  cancelButton: {
    padding: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ccc",
    fontSize: 16,
  },
});

