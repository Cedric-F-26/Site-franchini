// =================================================================================
// FICHIER DE CONFIGURATION CENTRAL DE FIREBASE
// =================================================================================
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
    addDoc,
    getDocs, 
    query, 
    orderBy,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

// =================================================================================
// [AVERTISSEMENT DE SÉCURITÉ - À LIRE]
// =================================================================================
// Les informations ci-dessous sont publiques et visibles par les visiteurs de votre site.
// La clé 'apiKey' permet d'identifier votre projet Firebase.
//
// POUR SÉCURISER VOTRE PROJET :
// 1. Allez sur la console Google Cloud : https://console.cloud.google.com/
// 2. Naviguez vers "APIs et services" > "Identifiants".
// 3. Trouvez la clé correspondant à la valeur 'apiKey' ci-dessous.
// 4. Cliquez dessus et dans "Restrictions relatives aux applications", sélectionnez "Sites Web".
// 5. Ajoutez l'URL de votre site (ex: https://mon-site-web-xi.vercel.app/*)
// 6. Dans "Restrictions relatives aux API", sélectionnez "Limiter la clé" et n'autorisez
//    que les services Firebase que vous utilisez (ex: "Cloud Firestore API", "Identity Toolkit API").
//
// Cela empêchera des tiers d'utiliser votre clé sur des sites non autorisés.
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyASpJx2yap1ieqxDv-UYkF9CTTNr9SgQm4",
  authDomain: "mon-site-web-38a05.firebaseapp.com",
  projectId: "mon-site-web-38a05",
  storageBucket: "mon-site-web-38a05.firebasestorage.app",
  messagingSenderId: "604335659289",
  appId: "1:604335659289:web:f2c318da9504464e7a0d88",
  measurementId: "G-E9JGBGF2Y0"
};

// Configuration pour les services externes (ex: Cloudinary)
const externalServicesConfig = {
    cloudinary: {
        cloud_name: 'dokuchvas',
        upload_preset: 'Site Web'
    }
};

// Initialiser les services Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialisation simplifiée et robuste
const storage = getStorage(app);

// Configurer la persistance de l'authentification (une seule fois)
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Erreur de configuration de la persistance:", error);
  });

// Exporter tout ce qui est nécessaire pour les autres modules
export {
    // Services
    auth, 
    db, 
    storage,
    externalServicesConfig,
    
    // Fonctions d'authentification
    onAuthStateChanged, 
    signOut,
    
    // Fonctions Firestore
    collection, 
    addDoc,
    getDocs, 
    query, 
    orderBy,
    doc,
    deleteDoc,
    
    // Fonctions Storage
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject
};