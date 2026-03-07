// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc} from "firebase/firestore";
import type {TaskData} from "../types/types.ts";
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

export async function addTaskToUser(userId: string, taskData: TaskData) {
    try {
        const tasksRef = await addDoc(collection(db, "users", userId, "tasks"), taskData);
        console.log("Document written with ID: ", tasksRef.id);
    } catch (e) {
        console.log(e);
    }
}

export async function getUserTasks(userId: string) {
    try {
        //const querySnapshot = await getDocs(collection(db, "users"));
        const querySnapshot = await getDocs(collection(db, "users", userId, "tasks"));
        if (querySnapshot.empty) return
        console.log(querySnapshot.docs);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TaskData))
    } catch (e) {
        console.log(e);
    }
}

export async function deleteUserTask(userId: string, taskId: string) {
    try {
        await deleteDoc(doc(db, "users", userId, "tasks", taskId));
        console.log("task deleted successfully.")
    } catch (e) {
        console.log(e);
    }
}
export async function updateUserTask(userId: string, taskId: string, taskData: TaskData) {
    try {
        await updateDoc(doc(db, "users", userId, "tasks", taskId), {
            ...taskData,
        })

    } catch (e) {
        console.log(e);
    }
}