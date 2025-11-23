import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

export const firebaseConfig = {
    apiKey: "AIzaSyBNGbKVBawiKvqYpKwq2_WGd50fx-z-Ptw",
    authDomain: "smart-traffic-system-c4b0b.firebaseapp.com",
    projectId: "smart-traffic-system-c4b0b",
    storageBucket: "smart-traffic-system-c4b0b.firebasestorage.app",
    messagingSenderId: "880538722912",
    appId: "1:880538722912:web:27d175ac2985fe9d671905",
    measurementId: "G-BMDTXD1M4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Connect to emulators if in development mode
if (location.hostname === "localhost") {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFunctionsEmulator(functions, "localhost", 5001);
}

export { app, db, auth, functions };
