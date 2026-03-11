import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const USER_ID = "clinton"; // or your auth UID

export async function pullFromCloud() {
  try {
    const ref = doc(db, "users", USER_ID);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.equipment)
      await AsyncStorage.setItem("equipment", JSON.stringify(data.equipment));

    if (data.workout_history)
      await AsyncStorage.setItem(
        "workout_history",
        JSON.stringify(data.workout_history)
      );

    if (data.settings)
      await AsyncStorage.setItem("settings", JSON.stringify(data.settings));

    console.log("Cloud → Local sync complete");
  } catch (e) {
    console.log("Pull error:", e);
  }
}

export async function fullSync() {
  try {
    const equipment = JSON.parse(await AsyncStorage.getItem("equipment")) || [];
    const history =
      JSON.parse(await AsyncStorage.getItem("workout_history")) || [];
    const settings =
      JSON.parse(await AsyncStorage.getItem("settings")) || {};

    const ref = doc(db, "users", USER_ID);

    await setDoc(ref, {
      equipment,
      workout_history: history,
      settings,
    });

    console.log("Local → Cloud backup complete");
  } catch (e) {
    console.log("Backup error:", e);
  }
}

