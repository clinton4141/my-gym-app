import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditEquipmentScreen({ route, navigation }) {
  const { item, index } = route.params;

  const [name, setName] = useState(item.name);
  const [bodyPart, setBodyPart] = useState(item.bodyPart);
  const [type, setType] = useState(item.type);
  const [description, setDescription] = useState(item.description);
  const [video, setVideo] = useState(item.video);
  const [image, setImage] = useState(item.image);

  const saveChanges = async () => {
    try {
      const stored = await AsyncStorage.getItem("equipment");
      const list = stored ? JSON.parse(stored) : [];

      list[index] = {
        name,
        bodyPart,
        type,
        description,
        video,
        image,
      };

      await AsyncStorage.setItem("equipment", JSON.stringify(list));
      navigation.goBack();
    } catch (error) {
      console.log("Error saving equipment:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Equipment</Text>

      <ScrollView style={{ marginTop: 20 }}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Body Part"
          placeholderTextColor="#777"
          value={bodyPart}
          onChangeText={setBodyPart}
        />

        <TextInput
          style={styles.input}
          placeholder="Type"
          placeholderTextColor="#777"
          value={type}
          onChangeText={setType}
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description"
          placeholderTextColor="#777"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Video URL"
          placeholderTextColor="#777"
          value={video}
          onChangeText={setVideo}
        />

        <TextInput
          style={styles.input}
          placeholder="Image URL"
          placeholderTextColor="#777"
          value={image}
          onChangeText={setImage}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
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
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#ff6600",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: "#aaa",
    fontSize: 16,
  },
});

