// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClCZrothVuL2FeDwjzpGQslqbuK3HJkr4",
    authDomain: "task-manager-reactts.firebaseapp.com",
    projectId: "task-manager-reactts",
    storageBucket: "task-manager-reactts.firebasestorage.app",
    messagingSenderId: "219132739302",
    appId: "1:219132739302:web:0cbc6914933c00fc360527"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);