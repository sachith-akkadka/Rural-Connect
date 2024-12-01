import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyBLSmaRggkfODmei2e8ZgZAoJylgre7rPI",
  authDomain: "rc-2-e0968.firebaseapp.com",
  projectId: "rc-2-e0968",
  storageBucket: "rc-2-e0968.appspot.com",
  messagingSenderId: "514808568951",
  appId: "1:514808568951:web:1e2b5e89354b05d0bbba72",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getFirestore(app);
export const storage = getStorage(app); // Add and export Storage
