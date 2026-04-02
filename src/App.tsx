import {Navigate, Route, Routes} from "react-router";
import Navbar from "./components/Navbar.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import {firestoreTaskStore} from "./services/firebase.ts";
import {FireContext} from "./FireContext.tsx";
import {useAuth} from "./hooks/Hooks.tsx";
import Loader from "./components/Loader.tsx";
import {lazy} from "react";
import {TaskService} from "./services/TaskService.ts";
import {ConfirmProvider} from "./ConfirmContext.tsx";

const Login = lazy(() => import("./pages/Login"));
const Tasks = lazy(() => import("./pages/Tasks.tsx"));
const taskService = new TaskService(firestoreTaskStore);

function App() {
    const {loading, user, login, logout, auth} = useAuth()
    if (loading) return <Loader/>
    return (
        <div className="flex flex-col">
            <FireContext.Provider value={{auth, user, login, logout, taskService}}>
                <ConfirmProvider>
                    <Navbar/>
                    <Routes>
                        <Route element={<ProtectedRoutes/>}>
                            <Route path="/tasks" element={<Tasks/>}/>
                            <Route path="/*" element={<Navigate to="/tasks" replace/>}/>
                        </Route>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </ConfirmProvider>
            </FireContext.Provider>
        </div>
    )
}

export default App
