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

export default function EditEquipmentScreen({ route, navigation }) {
  const colors = useThemeColors();
  const { item } = route.params;

  const [name, setName] = useState(item.name);
  const [bodyPart, setBodyPart] = useState(item.bodyPart);
  const [type, setType] = useState(item.type);
  const [description, setDescription] = useState(item.description);
  const [videoUrl, setVideoUrl] = useState(item.videoUrl);

  const save = async () => {
    const stored = await AsyncStorage.getItem("equipment_list");
    const list = stored ? JSON.parse(stored) : [];

    const updated = list.map((eq) =>
      eq.id === item.id
        ? { ...eq, name, bodyPart, type, description, videoUrl }
        : eq
    );

    await AsyncStorage.setItem("equipment_list", JSON.stringify(updated));
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Edit Equipment</Text>

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

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.accent }]}
        onPress={save}
      >
        <Text style={styles.saveText}>Save Changes</Text>
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
});

