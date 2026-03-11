import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAZS5rkXQrKDe3G7OMZi69r6e2b2bl2WA",
  authDomain: "gym-app-b5ed8.firebaseapp.com",
  projectId: "gym-app-b5ed8",
  storageBucket: "gym-app-b5ed8.appspot.com",
  messagingSenderId: "723492900480",
  appId: "1:723492900480:web:cded0630af7c06199ae065",
};

// 🔥 LOG MUST BE AFTER firebaseConfig
console.log("🔥 USING THIS FIREBASE CONFIG:", firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

