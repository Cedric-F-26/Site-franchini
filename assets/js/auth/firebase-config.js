// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { 
    getAuth, 
    setPersistence, 
    browserSessionPersistence,
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { 
    getFirestore,
    initializeFirestore,
    doc,
    setDoc,
    deleteDoc,
    collection, 
    getDocs, 
    query, 
    orderBy
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASpJx2yap1ieqxDv-UYkF9CTTNr9SgQm4",
  authDomain: "mon-site-web-38a05.firebaseapp.com",
  projectId: "mon-site-web-38a05",
  storageBucket: "mon-site-web-38a05.firebasestorage.app",
  messagingSenderId: "604335659289",
  appId: "1:604335659289:web:f2c318da9504464e7a0d88",
  measurementId: "G-E9JGBGF2Y0"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialiser Firestore avec configuration optimisée
let db;
if (typeof window !== 'undefined') {
  try {
    // Désactiver temporairement la persistance
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true, // Pour les connexions moins stables
      experimentalAutoDetectLongPolling: true,
      useFetchStreams: false
    });
    
    // Vérifier la connexion
    const testDoc = doc(collection(db, 'test'));
    await setDoc(testDoc, { test: new Date().toISOString() });
    await deleteDoc(testDoc);
    
    console.log("Firestore initialisé avec succès");
  } catch (error) {
    console.error("Erreur d'initialisation Firestore:", error);
    // En cas d'échec, essayer sans configuration spéciale
    db = getFirestore(app);
  }
} else {
  // Environnement sans fenêtre (ex: SSR), initialiser sans persistance
  db = getFirestore(app);
}

const storage = getStorage(app);

// Configurer la persistance de l'authentification
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Erreur de configuration de la persistance:", error);
  });

export {
    // Services
    auth, 
    db, 
    storage,
    
    // Auth
    onAuthStateChanged, 
    signOut,
    
    // Firestore
    collection, 
    getDocs, 
    query, 
    orderBy,
    
    // Storage
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject
};
