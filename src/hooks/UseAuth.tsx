import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {type User} from "firebase/auth";
import {AuthService} from "../services/AuthService.ts";

export const useAuth = (authService: AuthService) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const login = async () => {
        try {
            const user = await authService.login()
            if (user) {
                setUser(user);
                navigate("tasks", {replace: true});
            }
        } catch (e) {
            console.error(e);
        }
    }
    const logout = async () => {
        const success = await authService.logout()
        if (success) {
            setUser(null);
            navigate("login", {replace: true});
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = await authService.checkUserLoggedIn()
            if (loggedIn) {
                setUser(loggedIn)
                setLoading(false);
            } else {
                setLoading(false);
                navigate("login", {replace: true});
            }
        }
        checkAuth()
    }, []);
    return {user, loading, login, logout};
};