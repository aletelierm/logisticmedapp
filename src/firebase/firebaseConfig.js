import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain:process.env.REACT_APP_AUTHDOMAIN,
  projectId:process.env.REACT_APP_PROJECTID,
  storageBucket:process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId:process.env.REACT_APP_MESSAGINGSENDERID,
  appId:process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {db, auth};

export const recovery = async (email) => {
  const auth = getAuth(app);
  return sendPasswordResetEmail(auth, email);
}
  

export const createUser = async (email, password) => {
    return createUserWithEmailAndPassword(getAuth(app), email, password);
  }
  
  export const signInUser = async (email, password) => {
    return signInWithEmailAndPassword(getAuth(app), email, password);
  }