import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfpLk58UZnfDEsi1PrUTfPId8BbKvYDfM",
  authDomain: "interview-platform-3f5c8.firebaseapp.com",
  projectId: "interview-platform-3f5c8",
  storageBucket: "interview-platform-3f5c8.firebasestorage.app",
  messagingSenderId: "441607243662",
  appId: "1:441607243662:web:44594637cbaff6d01b06df",
  measurementId: "G-GDTS9R8P77"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);