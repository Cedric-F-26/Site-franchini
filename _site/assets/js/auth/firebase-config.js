// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
    getFirestore, collection, getDocs, orderBy, query, addDoc, deleteDoc, doc, writeBatch, updateDoc
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {
    getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

// Your web app's Firebase configuration
// Pour des raisons de sécurité, ces informations sont généralement stockées dans des variables d'environnement
// ou un fichier de configuration non versionné pour les projets réels.
// Pour cet exemple, vous devrez remplacer les valeurs ci-dessous par les vôtres.
const firebaseConfig = {
  apiKey: "AIzaSyASpJx2yap1ieqxDv-UYkF9CTTNr9SgQm4",
  authDomain: "mon-site-web-38a05.firebaseapp.com",
  projectId: "mon-site-web-38a05",
  storageBucket: "mon-site-web-38a05.firebasestorage.app",
  messagingSenderId: "604335659289",
  appId: "1:604335659289:web:f2c318da9504464e7a0d88",
  measurementId: "G-E9JGBGF2Y0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialiser Firestore si utilisé
const storage = getStorage(app); // Initialiser Storage si utilisé

export {
    // Services
    auth, db, storage,
    // Auth
    onAuthStateChanged, signOut,
    // Firestore
    collection, getDocs, orderBy, query, addDoc, deleteDoc, doc, writeBatch, updateDoc,
    // Storage
    ref, uploadBytes, getDownloadURL, deleteObject
};
