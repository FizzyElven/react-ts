import {initializeApp} from "firebase/app";
import {getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, type Firestore} from "firebase/firestore";
import type {AuthProvider, TaskData, TaskStore} from "../types/types.ts";
import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User} from "firebase/auth";
import {firebaseConfig} from "../../firebaseConfig.ts"

const USERS_COLLECTION = "users";
const TASK_COLLECTION = "tasks";

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
            ...snapshot.data(),
            id: snapshot.id,
        })) as TaskData[];
    }

    async delete(userId: string, taskId: string): Promise<void> {
        await deleteDoc(doc(this.db, USERS_COLLECTION, userId, TASK_COLLECTION, taskId));
    }

    async update(userId: string, taskId: string, taskData: Partial<TaskData>): Promise<void> {
        await updateDoc(doc(this.db, USERS_COLLECTION, userId, TASK_COLLECTION, taskId), taskData);
    }
}

export class FirebaseAuthProvider implements AuthProvider {
    async login() {
        await signInWithPopup(auth, provider)
        return auth.currentUser
    }

    async logout() {
        await signOut(auth)
    }

    checkLoggedIn(callback: (user: User | null) => void) {
        const auth = getAuth(firebaseApp);
        return onAuthStateChanged(auth, callback); // returns unsubscribe fn
    }
}

export const firebaseAuthProvider = new FirebaseAuthProvider();
export const firestoreTaskStore = new FirestoreTaskStore(db)