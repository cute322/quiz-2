// Import the functions you need from the SDKs you need using full CDN paths
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
// Import Firestore service using full CDN path
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2_fD7505f45epj9QsFNAclxw9eYRIwz8",
  authDomain: "quiz2-68922.firebaseapp.com",
  projectId: "quiz2-68922",
  storageBucket: "quiz2-68922.firebasestorage.app",
  messagingSenderId: "274854228617",
  appId: "1:274854228617:web:acbc6cacd938bd4cbb8c58",
  // measurementId: "G-N5TRSKS21C" // Analytics is not used in this app, can be removed or kept.
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export db so it can be used in other modules
export { db };