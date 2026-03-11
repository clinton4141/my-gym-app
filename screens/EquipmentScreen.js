import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "../hooks/useThemeColors";
import { defaultEquipment } from "../data/defaultEquipment";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function EquipmentScreen({ navigation }) {
  const colors = useThemeColors();

  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      initializeEquipment();
      loadEquipment();
    });
    return unsubscribe;
  }, [navigation]);

  // AUTO‑LOAD DEFAULT EQUIPMENT ON FIRST RUN
  const initializeEquipment = async () => {
    const stored = await AsyncStorage.getItem("equipment_list");

    if (stored && JSON.parse(stored).length > 0) return;

    const withIds = defaultEquipment.map((item) => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      favorite: false,
    }));

    await AsyncStorage.setItem("equipment_list", JSON.stringify(withIds));
  };

  const loadEquipment = async () => {
    const stored = await AsyncStorage.getItem("equipment_list");
    setEquipment(stored ? JSON.parse(stored) : []);
  };

  const deleteItem = (id) => {
    Alert.alert("Delete Equipment", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = equipment.filter((item) => item.id !== id);
          setEquipment(updated);
          await AsyncStorage.setItem("equipment_list", JSON.stringify(updated));
        },
      },
    ]);
  };

  const toggleFavorite = async (id) => {
    const updated = equipment.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    setEquipment(updated);
    await AsyncStorage.setItem("equipment_list", JSON.stringify(updated));
  };

  // CSV EXPORT (console only)
  const exportCSV = () => {
    const header = "Name,Body Part,Type,Description,Video URL\n";

    const rows = equipment
      .map(
        (item) =>
          `"${item.name}","${item.bodyPart}","${item.type}","${item.description}","${item.videoUrl}"`
      )
      .join("\n");

    const csv = header + rows;

    console.log(csv);
    Alert.alert("CSV Exported", "CSV printed to console.");
  };

  // PDF EXPORT
  const exportPDF = async () => {
    const html = `
      <html>
        <body>
          <h1>My Equipment List</h1>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr>
              <th>Name</th>
              <th>Body Part</th>
              <th>Type</th>
              <th>Description</th>
              <th>Video URL</th>
            </tr>
            ${equipment
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.bodyPart}</td>
                <td>${item.type}</td>
                <td>${item.description}</td>
                <td>${item.videoUrl}</td>
              </tr>`
              )
              .join("")}
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    await Sharing.shareAsync(uri);
  };

  // FILTER + SEARCH
  const filtered = equipment
    .filter((item) =>
      category === "All" ? true : item.bodyPart === category
    )
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

  const favorites = filtered.filter((item) => item.favorite);
  const nonFavorites = filtered.filter((item) => !item.favorite);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={[styles.title, { color: colors.text }]}>My Equipment</Text>

        {/* SEARCH BAR */}
        <TextInput
          placeholder="Search equipment..."
          placeholderTextColor={colors.subtext}
          style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
          value={search}
          onChangeText={setSearch}
        />

        {/* CATEGORY FILTERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: category === cat ? colors.accent : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={{
                  color: category === cat ? "#fff" : colors.text,
                  fontWeight: "600",
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* EXPORT BUTTONS */}
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: colors.accent }]}
          onPress={exportCSV}
        >
          <Ionicons name="download-outline" size={22} color="#fff" />
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: colors.accent }]}
          onPress={exportPDF}
        >
          <Ionicons name="document-outline" size={22} color="#fff" />
          <Text style={styles.exportText}>Export PDF</Text>
        </TouchableOpacity>

        {/* FAVORITES SECTION */}
        {favorites.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorites</Text>

            {favorites.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.name, { color: colors.text }]}>
                    {item.name}
                  </Text>

                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Ionicons name="star" size={26} color={colors.accent} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.detail, { color: colors.subtext }]}>
                  Body Part: {item.bodyPart}
                </Text>
                <Text style={[styles.detail, { color: colors.subtext }]}>
                  Type: {item.type}
                </Text>
                <Text style={[styles.detail, { color: colors.subtext }]}>
                  {item.description}
                </Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditEquipment", { item })
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={26}
                      color={colors.accent}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={26}
                      color={colors.accent}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* ALL EQUIPMENT SECTION */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>All Equipment</Text>

        {nonFavorites.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No equipment found.
          </Text>
        ) : (
          nonFavorites.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {item.name}
                </Text>

                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Ionicons
                    name={item.favorite ? "star" : "star-outline"}
                    size={26}
                    color={colors.accent}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.detail, { color: colors.subtext }]}>
                Body Part: {item.bodyPart}
              </Text>
              <Text style={[styles.detail, { color: colors.subtext }]}>
                Type: {item.type}
              </Text>
              <Text style={[styles.detail, { color: colors.subtext }]}>
                {item.description}
              </Text>

              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditEquipment", { item })
                  }
                >
                  <Ionicons
                    name="create-outline"
                    size={26}
                    color={colors.accent}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <Ionicons
                    name="trash-outline"
                    size={26}
                    color={colors.accent}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },

  searchInput: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },

  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },

  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  exportText: { color: "#fff", fontSize: 16, marginLeft: 10 },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  emptyText: { fontSize: 16, marginTop: 20 },

  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  detail: { fontSize: 14, marginBottom: 4 },

  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 20,
  },
});






