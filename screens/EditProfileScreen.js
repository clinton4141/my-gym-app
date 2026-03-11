import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import useThemeColors from "../hooks/useThemeColors";

export default function EditProfileScreen({ navigation }) {
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
    const loadProfile = async () => {
      const saved = await AsyncStorage.getItem("userProfile");
      if (saved) setProfile(JSON.parse(saved));
    };
    loadProfile();
  }, []);

  // 🔥 100% WORKING ALBUM PICKER
  const pickImage = async () => {
    try {
      // Request permission FIRST
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "Please allow photo access to choose an image."
        );
        return;
      }

      // Open album
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setProfile({ ...profile, photo: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Could not open photo library.");
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
      Alert.alert("Saved", "Your profile has been updated.");
      navigation.goBack();
    } catch (e) {
      console.log("Error saving profile:", e);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Profile
        </Text>

        <TouchableOpacity
          style={[styles.saveSmallButton, { backgroundColor: colors.accent }]}
          onPress={saveProfile}
        >
          <Text style={styles.saveSmallText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        {/* PHOTO PICKER */}
        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {profile.photo ? (
            <Image source={{ uri: profile.photo }} style={styles.photo} />
          ) : (
            <View
              style={[
                styles.photoPlaceholder,
                { borderColor: colors.accent },
              ]}
            >
              <Text style={{ color: colors.accent }}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* NAME */}
        <Text style={[styles.label, { color: colors.subtext }]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          value={profile.name}
          onChangeText={(t) => setProfile({ ...profile, name: t })}
        />

        {/* AGE */}
        <Text style={[styles.label, { color: colors.subtext }]}>Age</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          keyboardType="numeric"
          value={profile.age}
          onChangeText={(t) => setProfile({ ...profile, age: t })}
        />

        {/* HEIGHT */}
        <Text style={[styles.label, { color: colors.subtext }]}>Height (cm)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          keyboardType="numeric"
          value={profile.height}
          onChangeText={(t) => setProfile({ ...profile, height: t })}
        />

        {/* WEIGHT */}
        <Text style={[styles.label, { color: colors.subtext }]}>Weight (kg)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          keyboardType="numeric"
          value={profile.weight}
          onChangeText={(t) => setProfile({ ...profile, weight: t })}
        />

        {/* GOAL */}
        <Text style={[styles.label, { color: colors.subtext }]}>Fitness Goal</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          value={profile.goal}
          onChangeText={(t) => setProfile({ ...profile, goal: t })}
        />

        {/* CALORIES */}
        <Text style={[styles.label, { color: colors.subtext }]}>Daily Calories</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          keyboardType="numeric"
          value={profile.calories}
          onChangeText={(t) => setProfile({ ...profile, calories: t })}
        />

        {/* PROTEIN */}
        <Text style={[styles.label, { color: colors.subtext }]}>Daily Protein (g)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          keyboardType="numeric"
          value={profile.protein}
          onChangeText={(t) => setProfile({ ...profile, protein: t })}
        />

        {/* CARBS */}
        <Text style={[styles.label, { color: colors.subtext }]}>Daily Carbs (g)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          keyboardType="numeric"
          value={profile.carbs}
          onChangeText={(t) => setProfile({ ...profile, carbs: t })}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  saveSmallButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  saveSmallText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  label: { marginTop: 15, fontSize: 16 },

  input: {
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
  },

  photoContainer: { alignItems: "center", marginBottom: 20 },
  photo: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

