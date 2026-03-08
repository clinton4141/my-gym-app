import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function StartWorkoutScreen({ navigation }) {
  const [duration, setDuration] = useState(30);
  const [focus, setFocus] = useState('Full Body');
  const [intensity, setIntensity] = useState('Medium');
  const [equipmentKeywords, setEquipmentKeywords] = useState([]);

  useEffect(() => {
    const loadEquipment = async () => {
      const stored = await AsyncStorage.getItem('equipment');
      const parsed = stored ? JSON.parse(stored) : [];
      const keywords = parsed.map(item => (item.name || '').toLowerCase());
      setEquipmentKeywords(keywords);
    };

    loadEquipment();
  }, []);

  const equipmentAI = {
  "Push Ups": {
    name: "Bodyweight",
    bodyPart: "Chest",
    type: "Bodyweight",
    description: "A basic push movement using your own body weight.",
    video: "https://www.youtube.com/watch?v=_l3ySVKYVJ8"
  },
  "Squats": {
    name: "Bodyweight",
    bodyPart: "Legs",
    type: "Bodyweight",
    description: "Lower body movement targeting quads and glutes.",
    video: "https://www.youtube.com/watch?v=aclHkVaku9U"
  },
  "Lunges": {
    name: "Bodyweight",
    bodyPart: "Legs",
    type: "Bodyweight",
    description: "Targets quads, glutes, and balance.",
    video: "https://www.youtube.com/watch?v=QOVaa3sYkqE"
  },
  "Plank": {
    name: "Bodyweight",
    bodyPart: "Core",
    type: "Bodyweight",
    description: "Core stability exercise.",
    video: "https://www.youtube.com/watch?v=pSHjTRCQxIw"
  },
  "Burpees": {
    name: "Bodyweight",
    bodyPart: "Full Body",
    type: "Bodyweight",
    description: "Explosive full-body conditioning movement.",
    video: "https://www.youtube.com/watch?v=TU8QYVW0gDU"
  },
  "Mountain Climbers": {
    name: "Bodyweight",
    bodyPart: "Core",
    type: "Bodyweight",
    description: "Dynamic core and cardio movement.",
    video: "https://www.youtube.com/watch?v=nmwgirgXLYM"
  },
  "Jumping Jacks": {
    name: "Bodyweight",
    bodyPart: "Full Body",
    type: "Bodyweight",
    description: "Warm-up and cardio movement.",
    video: "https://www.youtube.com/watch?v=c4DAnQ6DtF8"
  },
  "Shoulder Press": {
    name: "Dumbbells",
    bodyPart: "Shoulders",
    type: "Free Weight",
    description: "Overhead pressing movement using dumbbells.",
    video: "https://www.youtube.com/watch?v=B-aVuyhvLHU"
  },
  "Bicep Curls": {
    name: "Dumbbells",
    bodyPart: "Arms",
    type: "Free Weight",
    description: "Curling movement targeting the biceps.",
    video: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
  },
  "Rows": {
    name: "Dumbbells",
    bodyPart: "Back",
    type: "Free Weight",
    description: "Pulling movement targeting the back.",
    video: "https://www.youtube.com/watch?v=pYcpY20QaE8"
  },
  "Chest Press": {
    name: "Bench + Dumbbells",
    bodyPart: "Chest",
    type: "Machine/Free Weight",
    description: "Pressing movement for chest strength.",
    video: "https://www.youtube.com/watch?v=VmB1G1K7v94"
  },
  "Leg Raises": {
    name: "Bodyweight",
    bodyPart: "Core",
    type: "Bodyweight",
    description: "Lower ab isolation movement.",
    video: "https://www.youtube.com/watch?v=JB2oyawG9KI"
  },
  "Russian Twists": {
    name: "Bodyweight",
    bodyPart: "Core",
    type: "Bodyweight",
    description: "Rotational core exercise.",
    video: "https://www.youtube.com/watch?v=wkD8rjkodUI"
  }
};

 const generateWorkout = async () => {
  // -----------------------------
  // 1. MASTER EXERCISE DATABASE
  // -----------------------------
  const db = [
    { name: "Push Ups", body: "Chest", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Shoulder Press", body: "Shoulders", type: "Free Weight", equipment: "Dumbbells" },
    { name: "Bicep Curls", body: "Arms", type: "Free Weight", equipment: "Dumbbells" },
    { name: "Rows", body: "Back", type: "Free Weight", equipment: "Dumbbells" },
    { name: "Chest Press", body: "Chest", type: "Free Weight", equipment: "Bench + Dumbbells" },
    { name: "Squats", body: "Legs", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Lunges", body: "Legs", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Plank", body: "Core", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Leg Raises", body: "Core", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Russian Twists", body: "Core", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Mountain Climbers", body: "Core", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Jumping Jacks", body: "Full Body", type: "Bodyweight", equipment: "Bodyweight" },
    { name: "Burpees", body: "Full Body", type: "Bodyweight", equipment: "Bodyweight" }
  ];

  // -----------------------------
  // 2. LOAD USER EQUIPMENT
  // -----------------------------
  const stored = await AsyncStorage.getItem("equipment");
  const owned = stored ? JSON.parse(stored).map(e => e.name.toLowerCase()) : [];

  // -----------------------------
  // 3. FILTER BY FOCUS
  // -----------------------------
  const focusMap = {
    "Full Body": ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"],
    "Upper Body": ["Chest", "Back", "Shoulders", "Arms"],
    "Lower Body": ["Legs"],
    "Push": ["Chest", "Shoulders", "Arms"],
    "Pull": ["Back", "Arms"],
    "Core": ["Core"]
  };

  const allowedBodies = focusMap[focus];

  let filtered = db.filter(ex => allowedBodies.includes(ex.body));

  // -----------------------------
  // 4. EQUIPMENT-AWARE FILTERING
  // -----------------------------
  filtered = filtered.filter(ex => {
    if (ex.equipment === "Bodyweight") return true;
    return owned.includes(ex.equipment.toLowerCase());
  });

  // Fallback if user has no equipment
  if (filtered.length < 5) {
    filtered = db.filter(ex => ex.equipment === "Bodyweight");
  }

  // -----------------------------
  // 5. CLEAN EXERCISE COUNT FORMULA
  // -----------------------------
  let exerciseCount = Math.max(5, Math.floor(duration / 10) + 4);

  // -----------------------------
  // 6. BALANCED BODY PART SELECTION
  // -----------------------------
  const byBody = {};
  filtered.forEach(ex => {
    if (!byBody[ex.body]) byBody[ex.body] = [];
    byBody[ex.body].push(ex);
  });

  const chosen = [];
  const bodyParts = Object.keys(byBody);

  while (chosen.length < exerciseCount) {
    for (let part of bodyParts) {
      if (chosen.length >= exerciseCount) break;
      const list = byBody[part];
      if (list && list.length > 0) {
        const pick = list[Math.floor(Math.random() * list.length)];
        if (!chosen.find(c => c.name === pick.name)) {
          chosen.push(pick);
        }
      }
    }
  }

  // -----------------------------
  // 7. INTENSITY SETTINGS
  // -----------------------------
  const intensitySettings = {
    Easy:   { sets: 2, reps: 10, kgMin: 0,  kgMax: 5,  rest: 30 },
    Medium: { sets: 3, reps: 12, kgMin: 5,  kgMax: 15, rest: 20 },
    Hard:   { sets: 4, reps: 15, kgMin: 10, kgMax: 25, rest: 15 }
  };

  const settings = intensitySettings[intensity];

  // -----------------------------
  // 8. WARM-UP + COOL-DOWN
  // -----------------------------
  const warmup = [
    { name: "Jumping Jacks", body: "Full Body" },
    { name: "Mountain Climbers", body: "Core" }
  ];

  const cooldown = [
    { name: "Plank", body: "Core" }
  ];

  // -----------------------------
  // 9. BUILD FINAL PLAN
  // -----------------------------
  const plan = [];

  // Warm-up (optional)
  plan.push({
    name: warmup[Math.floor(Math.random() * warmup.length)].name,
    sets: 1,
    reps: 20,
    kg: 0,
    rest: 10
  });

  // Main workout
  chosen.forEach(ex => {
    plan.push({
      name: ex.name,
      sets: settings.sets,
      reps: settings.reps,
      kg: Math.floor(Math.random() * (settings.kgMax - settings.kgMin + 1)) + settings.kgMin,
      rest: settings.rest
    });
  });

  // Cool-down
  plan.push({
    name: cooldown[0].name,
    sets: 1,
    reps: 30,
    kg: 0,
    rest: 10
  });

  // -----------------------------
  // 10. AUTO-SAVE EQUIPMENT
  // -----------------------------
  const autoEquipment = [];
  plan.forEach(ex => {
    if (equipmentAI[ex.name]) autoEquipment.push(equipmentAI[ex.name]);
  });

  await AsyncStorage.setItem("equipment", JSON.stringify(autoEquipment));

  // -----------------------------
  // 11. NAVIGATE
  // -----------------------------
  navigation.navigate("WorkoutOverview", { workout: plan });
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Workout</Text>

      {/* Duration Dropdown */}
      <Text style={styles.label}>Duration</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={duration}
          dropdownIconColor="white"
          style={styles.picker}
          onValueChange={(value) => setDuration(value)}
        >
          <Picker.Item label="15 minutes" value={15} />
          <Picker.Item label="30 minutes" value={30} />
          <Picker.Item label="45 minutes" value={45} />
          <Picker.Item label="60 minutes" value={60} />
        </Picker>
      </View>

      {/* Focus Dropdown */}
      <Text style={styles.label}>Focus</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={focus}
          dropdownIconColor="white"
          style={styles.picker}
          onValueChange={(value) => setFocus(value)}
        >
          <Picker.Item label="Full Body" value="Full Body" />
          <Picker.Item label="Upper Body" value="Upper Body" />
          <Picker.Item label="Lower Body" value="Lower Body" />
          <Picker.Item label="Push" value="Push" />
          <Picker.Item label="Pull" value="Pull" />
          <Picker.Item label="Core" value="Core" />
        </Picker>
      </View>

      {/* Intensity Dropdown */}
      <Text style={styles.label}>Intensity</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={intensity}
          dropdownIconColor="white"
          style={styles.picker}
          onValueChange={(value) => setIntensity(value)}
        >
          <Picker.Item label="Easy" value="Easy" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Hard" value="Hard" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generateWorkout}>
        <Text style={styles.generateText}>Generate Workout</Text>
      </TouchableOpacity>

      <ScrollView style={styles.result}>
        <Text style={{ color: '#aaa', textAlign: 'center' }}>
          Your workout will appear on the next screen.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    color: '#ff6600',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4
  },
  dropdown: {
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 10
  },
  picker: {
    color: 'white',
    width: '100%'
  },
  generateButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  generateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  result: {
    marginTop: 20
  }
});



