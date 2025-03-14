// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkbr_0AxvPBuuuQS4R5UVZevF1a-TmTxM",
  authDomain: "layanan-gg-suspension.firebaseapp.com",
  projectId: "layanan-gg-suspension",
  storageBucket: "layanan-gg-suspension.firebasestorage.app",
  messagingSenderId: "857043299790",
  appId: "1:857043299790:web:84e85487dbef1414dbcf9f",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const db = getFirestore(app);