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
    collection, 
    getDocs, 
    query, 
    orderBy,
    enableIndexedDbPersistence,
    CACHE_SIZE_UNLIMITED
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

// Initialiser Firestore
const db = getFirestore(app);

// Activer la persistance hors ligne
async function enableOfflinePersistence() {
  try {
    await enableIndexedDbPersistence(db, { 
      cacheSizeBytes: CACHE_SIZE_UNLIMITED 
    });
    console.log("La persistance hors ligne est activée");
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.warn("La persistance a échoué car plusieurs onglets sont ouverts");
    } else if (err.code === 'unimplemented') {
      console.warn("Le navigateur actuel ne supporte pas la persistance");
    }
  }
}

if (typeof window !== 'undefined') {
  enableOfflinePersistence();
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
