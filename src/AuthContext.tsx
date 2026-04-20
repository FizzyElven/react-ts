import {createContext} from "react";
import {type User} from "firebase/auth"
import type {TaskService} from "./services/TaskService.ts";
import type {Result} from "./types/types.ts";

interface AuthProps<T> {
    user: User | null,
    login: () => void,
    error: any,
    logout: () => Promise<Result<T>>,
    taskService: TaskService,
}

type ContextParams = AuthProps<any>
export const AuthContext = createContext<ContextParams>({} as ContextParams);