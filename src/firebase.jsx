import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC07G6_SS95RrlixRSCTXX-QGA-LdIcedA",
  authDomain: "student-info-8125f.firebaseapp.com",
  projectId: "student-info-8125f",
  storageBucket: "student-info-8125f.firebasestorage.app",
  messagingSenderId: "759128944075",
  appId: "1:759128944075:web:221f473baf523e67365a4e",
  measurementId: "G-LCXKQC1NF3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);

export { app, auth, db, googleProvider };
