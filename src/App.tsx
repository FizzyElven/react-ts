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

function App() {
    const navigate = useNavigate();
    const {loading, user} = useAuth()
    const auth = getAuth(firebaseApp);
    console.log(auth)
    const firestore = firebase.firestore
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
        <>
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
                <Navbar/>
                <Routes>
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/tasks" element={<Tasks/>}/>
                        <Route path="/*" element={<Navigate to="/tasks" replace />}/>
                    </Route>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </FireContext.Provider>
        </>
    )
}

export default App
