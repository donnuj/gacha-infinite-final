const firebaseConfig = {
  apiKey: "AIzaSyD6FbfV9jXYaxm_pnRSsDCJmuvzm0MCHD4",
  authDomain: "gacha-infinite.firebaseapp.com",
  projectId: "gacha-infinite",
  storageBucket: "gacha-infinite.firebasestorage.app",
  messagingSenderId: "209879362378",
  appId: "1:209879362378:web:b0604956c9153053696fb3"
  };

// 👇 ESSENCIAL para evitar "No Firebase App '[DEFAULT]'..."
firebase.initializeApp(firebaseConfig);

// Usos globais
const db = firebase.firestore();
const auth = firebase.auth();
