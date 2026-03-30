import {Navigate, Route, Routes} from "react-router";
import Navbar from "./components/Navbar.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import {firestoreTaskStore} from "./services/firebase.ts";
import {FireContext} from "./FireContext.tsx";
import {useAuth} from "./hooks/Hooks.tsx";
import Loader from "./components/Loader.tsx";
import {lazy, useState} from "react";
import Modal from "./components/Modal.tsx";
import {ConfirmationDialog} from "./components/ConfirmationDialog.tsx";
import type {ConfirmDialog} from "./types/types.ts";
import {TaskService} from "./services/TaskService.ts";

const Login = lazy(() => import("./components/Login"));
const Tasks = lazy(() => import("./components/Tasks.tsx"));
const taskService = new TaskService(firestoreTaskStore);

function App() {
    const {loading, user, login, logout, auth} = useAuth()
    const [confirmAction, setConfirmAction] = useState<ConfirmDialog | null>(null);
    if (loading) return <Loader/>
    return (
        <div className="flex flex-col">
            <FireContext.Provider value={
                {
                    auth,
                    user,
                    login,
                    logout,
                    taskService,
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
