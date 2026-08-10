// Yo inicializo Firebase una sola vez y expongo Authentication y Firestore.
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const camposFaltantes = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (camposFaltantes.length > 0) {
  throw new Error(
    `Falta configurar Firebase en el archivo .env: ${camposFaltantes.join(", ")}`,
  );
}

// Yo reutilizo Firebase si ya fue inicializado para evitar instancias duplicadas.
const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Yo utilizo Firebase Authentication para registrar, iniciar y cerrar sesión.
export const firebaseAuth = getAuth(firebaseApp);

// Yo utilizo Firestore para almacenar los perfiles de los doctores.
export const firestoreDb = getFirestore(firebaseApp);