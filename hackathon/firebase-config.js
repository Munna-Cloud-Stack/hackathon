// firebase-config.js (compat version)
const firebaseConfig = {
  apiKey: "AIzaSyB9ze-skskBgW83LqN23CuxBCm4OK0pF58",
  authDomain: "collage-a48fb.firebaseapp.com",
  projectId: "collage-a48fb",
  storageBucket: "collage-a48fb.appspot.com",
  messagingSenderId: "137232269122",
  appId: "1:137232269122:web:d6698a6f2de5a8418012db",
  measurementId: "G-R8DGBGYV2B"
};

// Initialize Firebase using compat SDK
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
