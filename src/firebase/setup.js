// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHKIEukunQiyn9z1z8ohwcAyaClVbPUZY",
  authDomain: "rural-connect-f1404.firebaseapp.com",
  projectId: "rural-connect-f1404",
  storageBucket: "rural-connect-f1404.firebasestorage.app",
  messagingSenderId: "28587287121",
  appId: "1:28587287121:web:b22892b403db641ea18e70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app)
export const database = getFirestore(app)