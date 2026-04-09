import type {AuthProvider} from "../types/types.ts";
import type {User} from "firebase/auth";

export class AuthService {
    private readonly authProvider: AuthProvider;
    constructor(provider: AuthProvider) {
        this.authProvider = provider;
    }
    async login(): Promise<User | null> {
        return this.authProvider.login()
    }
    async logout(): Promise<boolean> {
        return this.authProvider.logout()
    }
    async checkUserLoggedIn() {
        return await this.authProvider.checkLoggedIn()
    }
}