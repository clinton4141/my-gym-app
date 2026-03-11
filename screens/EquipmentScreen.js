import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useThemeColors from "../hooks/useThemeColors";

export default function EquipmentScreen({ navigation }) {
  const colors = useThemeColors();

  const [equipment, setEquipment] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadEquipment();
    });
    return unsubscribe;
  }, [navigation]);

  const loadEquipment = async () => {
    const stored = await AsyncStorage.getItem("equipment");
    const parsed = stored ? JSON.parse(stored) : [];
    setEquipment(parsed);
  };

  const saveEquipment = async () => {
    if (!name.trim()) return;

    const newItem = {
      name,
      bodyPart,
      type,
      description,
      video,
      image,
    };

    setEquipment((prev) => {
      const updated = [...prev, newItem];
      AsyncStorage.setItem("equipment", JSON.stringify(updated));
      return updated;
    });

    setName("");
    setBodyPart("");
    setType("");
    setDescription("");
    setVideo("");
    setImage("");

    setModalVisible(false);
  };

  const deleteEquipment = async (index) => {
    setEquipment((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      AsyncStorage.setItem("equipment", JSON.stringify(updated));
      return updated;
    });
  };

  const editEquipment = (item, index) => {
    navigation.navigate("EditEquipmentScreen", { item, index });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Your Equipment</Text>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.accent }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.addButtonText, { color: colors.text }]}>
          + Add Equipment
        </Text>
      </TouchableOpacity>

      <ScrollView style={{ marginTop: 20 }}>
        {equipment.length === 0 && (
          <Text style={[styles.empty, { color: colors.subtext }]}>
            No equipment added yet.
          </Text>
        )}

        {equipment.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}

            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.accent }]}>
                {item.name}
              </Text>

              <Text style={[styles.field, { color: colors.subtext }]}>
                Body Part:{" "}
                <Text style={[styles.value, { color: colors.text }]}>
                  {item.bodyPart}
                </Text>
              </Text>

              <Text style={[styles.field, { color: colors.subtext }]}>
                Type:{" "}
                <Text style={[styles.value, { color: colors.text }]}>
                  {item.type}
                </Text>
              </Text>

              <Text style={[styles.field, { color: colors.subtext }]}>
                Description:
              </Text>
              <Text style={[styles.description, { color: colors.text }]}>
                {item.description}
              </Text>

              {item.video ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.video)}>
                  <Text style={[styles.video, { color: colors.accent }]}>
                    Watch Video
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.iconColumn}>
              <TouchableOpacity onPress={() => editEquipment(item, index)}>
                <Text style={[styles.editIcon, { color: colors.accent }]}>
                  ✏️
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteEquipment(index)}>
                <Text style={[styles.trashIcon, { color: "red" }]}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ADD EQUIPMENT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Equipment
            </Text>

            <ScrollView>
              <TextInput
                placeholder="Name"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  { backgroundColor: colors.bg, color: colors.text },
                ]}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Body Part"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  { backgroundColor: colors.bg, color: colors.text },
                ]}
                value={bodyPart}
                onChangeText={setBodyPart}
              />

              <TextInput
                placeholder="Type (e.g., Dumbbells, Machine)"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  { backgroundColor: colors.bg, color: colors.text },
                ]}
                value={type}
                onChangeText={setType}
              />

              <TextInput
                placeholder="Description"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.bg,
                    color: colors.text,
                    height: 80,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <TextInput
                placeholder="Video URL"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  { backgroundColor: colors.bg, color: colors.text },
                ]}
                value={video}
                onChangeText={setVideo}
              />

              <TextInput
                placeholder="Image URL (optional)"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  { backgroundColor: colors.bg, color: colors.text },
                ]}
                value={image}
                onChangeText={setImage}
              />

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.accent }]}
                onPress={saveEquipment}
              >
                <Text style={[styles.saveText, { color: colors.text }]}>
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelText, { color: colors.subtext }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  addButton: {
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    borderWidth: 1,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },

  field: {
    fontSize: 14,
    marginTop: 4,
  },

  value: {
    fontWeight: "600",
  },

  description: {
    marginTop: 4,
    marginBottom: 10,
  },

  video: {
    marginTop: 10,
    fontWeight: "bold",
  },

  iconColumn: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },

  editIcon: {
    fontSize: 22,
  },

  trashIcon: {
    fontSize: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    padding: 20,
    borderRadius: 12,
    maxHeight: "90%",
    borderWidth: 1,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  input: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },

  saveButton: {
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveText: {
    fontWeight: "bold",
  },

  cancelButton: {
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
  },
});





