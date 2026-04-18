import {Navigate, Route, Routes} from "react-router";
import Navbar from "./components/Navbar.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import {firebaseAuthProvider, firestoreTaskStore} from "./services/firebase.ts";
import {AuthContext} from "./AuthContext.tsx";
import {useAuth} from "./hooks/UseAuth.tsx";
import Loader from "./components/Loader.tsx";
import {lazy} from "react";
import {TaskService} from "./services/TaskService.ts";
import {ConfirmProvider} from "./ConfirmContext.tsx";
import {AuthService} from "./services/AuthService.ts";

const Login = lazy(() => import("./pages/Login"));
const Tasks = lazy(() => import("./pages/Tasks.tsx"));
const taskService = new TaskService(firestoreTaskStore);
const authService = new AuthService(firebaseAuthProvider)
export const AppRoutes = () => {
    return (<Routes>
        <Route element={<ProtectedRoutes/>}>
            <Route path="/tasks" element={<Tasks/>}/>
            <Route path="/*" element={<Navigate to="/tasks" replace/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
    </Routes>)
}

function App() {
    const {loading, user, login, logout, error} = useAuth(authService)
    if (loading) return <Loader/>
    return (
        <div className="flex flex-col">
            <AuthContext.Provider value={{user, login, logout, error, taskService}}>
                <ConfirmProvider>
                    <Navbar/>
                    <AppRoutes/>
                </ConfirmProvider>
            </AuthContext.Provider>
        </div>
    )
}

export default App
