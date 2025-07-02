// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGHkjy5MwzQ5b3r7R_tQGl8omWcshB3e0",
  authDomain: "gacha-infinity-final-e9994.firebaseapp.com",
  projectId: "gacha-infinity-final-e9994",
  storageBucket: "gacha-infinity-final-e9994.firebasestorage.app",
  messagingSenderId: "382808654174",
  appId: "1:382808654174:web:ea69a67b28a4dd06814fcf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
