
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-iq-13820.firebaseapp.com",
  projectId: "interview-iq-13820",
  storageBucket: "interview-iq-13820.firebasestorage.app",
  messagingSenderId: "462458611619",
  appId: "1:462458611619:web:a6c8c44559e95357b79c16"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}