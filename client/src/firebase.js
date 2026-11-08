import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2tt-ZrJFIqLgj3BeepG_lxkB4QjtMdC4",
  authDomain: "learnai-8e6d8.firebaseapp.com",
  projectId: "learnai-8e6d8",
  storageBucket: "learnai-8e6d8.firebasestorage.app",
  messagingSenderId: "1019861733515",
  appId: "1:1019861733515:web:0b78e492a035241cc8c48e",
  measurementId: "G-Z4DQQ8TJ8T",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
