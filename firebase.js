// firebase.js
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyAGHkjy5MwzQ5b3r7R_tQGl8omWcshB3e0",
    authDomain: "gacha-infinity-final-e9994.firebaseapp.com",
    projectId: "gacha-infinity-final-e9994",
    storageBucket: "gacha-infinity-final-e9994.firebasestorage.app",
    messagingSenderId: "382808654174",
    appId: "1:382808654174:web:ea69a67b28a4dd06814fcf"
  };

  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();