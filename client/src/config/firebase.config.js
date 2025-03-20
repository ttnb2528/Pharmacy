// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs8s6GuuMam9UdvlvxXzlWZW6pa4SAfHs",
  authDomain: "pharmacynb-65211.firebaseapp.com",
  projectId: "pharmacynb-65211",
  storageBucket: "pharmacynb-65211.firebasestorage.app",
  messagingSenderId: "870098845892",
  appId: "1:870098845892:web:dead59dde50fd7ba818991",
  measurementId: "G-J8EZSYWW1B",
};

// if (import.meta.env.NODE_ENV === "development") {
//   window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.languageCode = "vi";

export { auth, signInWithPhoneNumber, RecaptchaVerifier };