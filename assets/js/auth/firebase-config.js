// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"; // Si vous utilisez Firestore
import { getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js"; // Si vous utilisez Storage

// Your web app's Firebase configuration
// Pour des raisons de sécurité, ces informations sont généralement stockées dans des variables d'environnement
// ou un fichier de configuration non versionné pour les projets réels.
// Pour cet exemple, vous devrez remplacer les valeurs ci-dessous par les vôtres.
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialiser Firestore si utilisé
const storage = getStorage(app); // Initialiser Storage si utilisé

export { auth, db, storage };
