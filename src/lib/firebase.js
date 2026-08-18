import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5UD1VRSUbyvsEVX_qaFBpEto4GXRMTc0",
  authDomain: "aura-b7a48.firebaseapp.com",
  projectId: "aura-b7a48",
  storageBucket: "aura-b7a48.firebasestorage.app",
  messagingSenderId: "183539790839",
  appId: "1:183539790839:web:10cdcf4d3b89b8404d34f2",
  measurementId: "G-L5M9X8SNSP"
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth };