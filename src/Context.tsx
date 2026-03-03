import {createContext} from "react";
import {type Auth, type User} from "firebase/auth"

interface FirebaseProps {
    firestore: any,
    auth: Auth,
    user: User | null,
    firebase: any,
    login: () => void,
    logout: () => void,
}

type ContextParams = FirebaseProps
export const FireContext = createContext<ContextParams>({} as ContextParams);