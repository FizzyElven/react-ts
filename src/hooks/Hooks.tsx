import {getAuth, onAuthStateChanged, type User} from "firebase/auth";
import {useEffect, useState} from "react";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    return {user, loading};
};