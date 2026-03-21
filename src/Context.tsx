import {createContext} from "react";
import {type Auth, type User} from "firebase/auth"

interface FirebaseProps {
    auth: Auth,
    user: User | null,
    login: () => void,
    logout: () => void,
}

type ContextParams = FirebaseProps
export const FireContext = createContext<ContextParams>({} as ContextParams);