import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useThemeColors from "../hooks/useThemeColors";

export default function ProfileScreen({ navigation }) {
  const colors = useThemeColors();

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    calories: "",
    protein: "",
    carbs: "",
    photo: null,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("userProfile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.log("Error loading profile:", e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* HEADER WITH EDIT BUTTON */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Profile
        </Text>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        
        {/* PHOTO */}
        {profile.photo ? (
          <Image source={{ uri: profile.photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photoPlaceholder, { borderColor: colors.accent }]}>
            <Text style={{ color: colors.accent }}>No Photo</Text>
          </View>
        )}

        {/* INFO BOX */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.subtext }]}>Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.name || "Not set"}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Age</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.age || "Not set"}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Height</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.height || "Not set"}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Weight</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.weight || "Not set"}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Goal</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.goal || "Not set"}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Daily Calories</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.calories || "Not set"}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Daily Protein</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.protein || "Not set"}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Daily Carbs</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile.carbs || "Not set"}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },

  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  /* CONTENT */
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },

  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  infoBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  label: { fontSize: 14, marginTop: 10 },
  value: { fontSize: 18, fontWeight: "bold" },
});

