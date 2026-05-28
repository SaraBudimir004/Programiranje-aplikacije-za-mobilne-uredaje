import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAEqwYJFMneNdSB7PWm18WfMW3i2Is1bSo",
    authDomain: "smartexpensetracker-a1d75.firebaseapp.com",
    projectId: "smartexpensetracker-a1d75",
    storageBucket: "smartexpensetracker-a1d75.firebasestorage.app",
    messagingSenderId: "449100790474",
    appId: "1:449100790474:web:c787655edbd5ed5fe55233"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const firestore = getFirestore(app);