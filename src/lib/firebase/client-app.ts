// src/lib/firebase/client-app.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  "projectId": "studio-6588365639-fa5e2",
  "appId": "1:721521930140:web:3000c0d1e8eb1799956259",
  "storageBucket": "studio-6588365639-fa5e2.firebasestorage.app",
  "apiKey": "AIzaSyDjTXaJcQU7uak1yh818P-biRjc6-0SDl4",
  "authDomain": "studio-6588365639-fa5e2.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "721521930140",
  "databaseURL": "https://studio-6588365639-fa5e2-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
