import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEppkQrfb-HCZWvG-ct1WOQWcys7BZxdI",
  authDomain: "contect-bcf7a.firebaseapp.com",
  projectId: "contect-bcf7a",
  storageBucket: "contect-bcf7a.appspot.com",
  messagingSenderId: "663916920840",
  appId: "1:663916920840:web:85107ec1fc9218d72751bd"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // 🔥 add machan innum iruku wait ipo css anupata