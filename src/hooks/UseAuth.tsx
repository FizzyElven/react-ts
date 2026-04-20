import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {type User} from "firebase/auth";
import {AuthService} from "../services/AuthService.ts";
import type {Result} from "../types/types.ts";

export const useAuth = (authService: AuthService) => {
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const navigate = useNavigate();
        const login = async () => {
            try {
                const user = await authService.login()
                if (user) {
                    setUser(user);
                    navigate("tasks", {replace: true});
                }
            } catch (e) {
                if (e instanceof Error)setError(e.message);
                console.error(e);
            }
        }
        const logout = async () : Promise<Result<any>> => {
            try {
                const data = await authService.logout()
                setUser(null);
                navigate("login", {replace: true});
                return {error: null, data, success: true};
            } catch (e) {
                console.error(e);
                return {error: e instanceof Error ? e : new Error("something went wrong"), data: null, success: false};
            }
        }

        useEffect(() => {
            const unsubscribe = authService.onAuthStateChanged((user) => {
                if (user) {
                    setUser(user);
                    setLoading(false);
                } else {
                    setLoading(false);
                    navigate("login", {replace: true});
                }
            });

            return () => unsubscribe(); // cleanup on unmount
        }, []);
        return {user, loading, login, logout, error};
    }
;