import {initializeApp} from "firebase/app";
import {getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc} from "firebase/firestore";
import type {TaskData} from "../types/types.ts";

const USERS_COLLECTION = "users";
const TASK_COLLECTION = "tasks";
const firebaseConfig = {
    apiKey: "AIzaSyClCZrothVuL2FeDwjzpGQslqbuK3HJkr4",
    authDomain: "task-manager-reactts.firebaseapp.com",
    projectId: "task-manager-reactts",
    storageBucket: "task-manager-reactts.firebasestorage.app",
    messagingSenderId: "219132739302",
    appId: "1:219132739302:web:0cbc6914933c00fc360527"
};

export const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export async function addTaskToUser(userId: string, taskData: TaskData) {
    try {
        await addDoc(collection(db, USERS_COLLECTION, userId, TASK_COLLECTION), taskData);
    } catch (e) {
        console.log(e);
    }
}

export async function getUserTasks(userId: string) {
    try {
        const querySnapshot = await getDocs(collection(db, USERS_COLLECTION, userId, TASK_COLLECTION));
        if (querySnapshot.empty) return
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as TaskData))
    } catch (e) {
        console.log(e);
    }
}

export async function deleteUserTask(userId: string, taskId: string) {
    try {
        await deleteDoc(doc(db, USERS_COLLECTION, userId, TASK_COLLECTION, taskId));
    } catch (e) {
        console.log(e);
    }
}

export async function updateUserTask(userId: string, taskId: string, taskData: TaskData) {
    try {
        await updateDoc(doc(db, USERS_COLLECTION, userId, TASK_COLLECTION, taskId), {
            ...taskData,
        })

    } catch (e) {
        console.log(e);
    }
}