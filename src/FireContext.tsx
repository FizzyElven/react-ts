import {createContext} from "react";
import {type User} from "firebase/auth"
import type {TaskService} from "./services/TaskService.ts";

interface FirebaseProps {
    user: User | null,
    login: () => void,
    logout: () => Promise<void>,
    taskService: TaskService,
}

type ContextParams = FirebaseProps
export const FireContext = createContext<ContextParams>({} as ContextParams);