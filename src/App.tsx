import {Navigate, Route, Routes, useNavigate} from "react-router";
import Login from "./components/Login.tsx";
import Tasks from "./components/Tasks.tsx";
import Navbar from "./components/Navbar.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import firebase from "firebase/compat/app";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {firebaseApp} from "./services/firebase.ts";
import {FireContext} from "./Context.tsx";
import {useAuth} from "./hooks/Hooks.tsx";
import Loader from "./components/Loader.tsx";
import {useState} from "react";
import Modal from "./components/Modal.tsx";
import {ConfirmationDialog} from "./components/ConfirmationDialog.tsx";
import type {ConfirmDialog} from "./types/types.ts";

function App() {
    const navigate = useNavigate();
    const {loading, user} = useAuth()
    const auth = getAuth(firebaseApp);
    console.log(auth)
    const firestore = firebase.firestore
    const [confirmAction, setConfirmAction] = useState<ConfirmDialog | null>(null);
    const login = async () => {
        const provider = new GoogleAuthProvider();
        const {user} = await signInWithPopup(auth, provider)
        console.log(user)
        if (auth.currentUser) {
            navigate("tasks", {replace: true});
        }
    }
    const logout = async () => {
        await signOut(auth)
        console.log("Signed out")
        console.log(auth)
        if (!auth.currentUser) {
            navigate("login", {replace: true});
        }
    }
    if (loading) return <Loader/>
    return (
        <div className="flex flex-col">
            <FireContext.Provider value={
                {
                    firestore,
                    firebase,
                    auth,
                    user,
                    login,
                    logout,
                }
            }>
                <Navbar setConfirmDialog={setConfirmAction}/>
                <Routes>
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/tasks" element={<Tasks setConfirmDialog={setConfirmAction}/>}/>
                        <Route path="/*" element={<Navigate to="/tasks" replace/>}/>
                    </Route>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
                <Modal isOpen={confirmAction !== null} onClose={() => setConfirmAction(null)}>
                    {confirmAction && <ConfirmationDialog title={confirmAction.title} text={confirmAction.text}
                                                          btnVariant={confirmAction.btnVariant}
                                                          confirmText={confirmAction.confirmText}
                                                          onConfirm={confirmAction.onConfirm}
                                                          onCancel={() => setConfirmAction(null)}/>
                    }
                </Modal>
            </FireContext.Provider>
        </div>
    )
}

export default App
