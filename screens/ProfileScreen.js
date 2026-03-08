import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={110} color="#ff6600" />

        <Text style={styles.name}>Clinton</Text>
        <Text style={styles.subtitle}>Gym App User</Text>

        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.editText}>Edit Profile</Text>
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
    alignItems: "center",
  },
  header: {
    color: "#ff6600",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 30,
  },
  profileCard: {
    backgroundColor: "#1a1a1a",
    width: "90%",
    paddingVertical: 40,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  name: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 15,
  },
  subtitle: {
    color: "white",
    opacity: 0.6,
    marginBottom: 20,
    fontSize: 16,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#ff6600",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  editText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});
