import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useThemeColors from "../hooks/useThemeColors";

export default function AddEquipmentScreen({ navigation }) {
  const colors = useThemeColors();

  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const save = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required.");
      return;
    }

    const stored = await AsyncStorage.getItem("equipment_list");
    const list = stored ? JSON.parse(stored) : [];

    const newItem = {
      id: Date.now().toString(),
      name,
      bodyPart,
      type,
      description,
      videoUrl,
      favorite: false,
    };

    const updated = [...list, newItem];
    await AsyncStorage.setItem("equipment_list", JSON.stringify(updated));

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Add Equipment</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Body Part"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        value={bodyPart}
        onChangeText={setBodyPart}
      />

      <TextInput
        placeholder="Type"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        value={type}
        onChangeText={setType}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Video URL"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        value={videoUrl}
        onChangeText={setVideoUrl}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.accent }]}
        onPress={save}
      >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

      {/* FIXED: ORANGE VIEW EQUIPMENT BUTTON */}
      <TouchableOpacity
        style={[
          styles.viewButton,
          { backgroundColor: colors.accent, borderColor: colors.accent }
        ]}
        onPress={() =>
          navigation.navigate("EquipmentTab", {
            screen: "EquipmentHome",
          })
        }
      >
        <Text style={[styles.viewText, { color: "#fff" }]}>
          View My Equipment
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },

  input: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },

  saveButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  viewButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
  },
  viewText: {
    fontSize: 16,
    fontWeight: "600",
  },
});




