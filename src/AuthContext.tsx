import {createContext} from "react";
import {type User} from "firebase/auth"
import type {TaskService} from "./services/TaskService.ts";

interface AuthProps {
    user: User | null,
    login: () => void,
    error: any,
    logout: () => Promise<void>,
    taskService: TaskService,
}

type ContextParams = AuthProps
export const AuthContext = createContext<ContextParams>({} as ContextParams);