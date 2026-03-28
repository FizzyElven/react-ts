import {createContext} from "react";
import {type Auth, type User} from "firebase/auth"
import type {TaskService} from "./services/TaskService.ts";

interface FirebaseProps {
    auth: Auth,
    user: User | null,
    login: () => void,
    logout: () => void,
    taskService: TaskService,
}

type ContextParams = FirebaseProps
export const FireContext = createContext<ContextParams>({} as ContextParams);