import {initializeApp} from "firebase/app";
import {getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, type Firestore} from "firebase/firestore";
import type {AuthProvider, TaskData, TaskStore} from "../types/types.ts";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User} from "firebase/auth";

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
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export class FirestoreTaskStore implements TaskStore {
    private readonly db: Firestore;

    constructor(db: Firestore) {
        this.db = db;
    }

    async add(userId: string, taskData: TaskData): Promise<void> {
        await addDoc(collection(this.db, USERS_COLLECTION, userId, TASK_COLLECTION), taskData);
    }

    async getAll(userId: string): Promise<TaskData[]> {
        const querySnapshot = await getDocs(
            collection(this.db, USERS_COLLECTION, userId, TASK_COLLECTION)
        );
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            ...snapshot.data(),
        })) as TaskData[];
    }

    async delete(userId: string, taskId: string): Promise<void> {
        await deleteDoc(doc(this.db, USERS_COLLECTION, userId, TASK_COLLECTION, taskId));
    }

    async update(
        userId: string,
        taskId: string,
        taskData: Partial<TaskData>
    ): Promise<void> {
        await updateDoc(
            doc(this.db, USERS_COLLECTION, userId, TASK_COLLECTION, taskId),
            taskData
        );
    }
}

export class FirebaseAuthProvider implements AuthProvider {
    async login() {
        await signInWithPopup(auth, provider)
        return auth.currentUser
    }

    async logout() {
        try {
            await signOut(auth)
            return true
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async checkLoggedIn(): Promise<User | null> {
        return auth.currentUser;
    }
}

export const firebaseAuthProvider = new FirebaseAuthProvider();
export const firestoreTaskStore = new FirestoreTaskStore(db)