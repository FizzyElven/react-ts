import {vi, describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";
import Login from "../pages/Login.tsx";
import {userEvent} from "@testing-library/user-event/dist/cjs/setup/index.js";
import {AppRoutes} from "../App.tsx";
import {MemoryRouter, Route, Routes} from "react-router";
import type {ReactElement} from "react";
import {AuthContext} from "../AuthContext.tsx";
import type {AuthService} from "../services/AuthService.ts";
import {useAuth} from "../hooks/UseAuth.tsx";
import Navbar from "../components/Navbar.tsx";
import {ConfirmProvider} from "../ConfirmContext.tsx";

const mockLoginFn = vi.fn()

const renderWithContext = (ui: ReactElement) => {
    return render(
        <AuthContext.Provider value={{
            login: mockLoginFn(),
            logout: vi.fn(),
            user: {} as any,
            taskService: {} as any,
            error: null,
        }}>
            {ui}
        </AuthContext.Provider>
    );
};

describe("LoginFlow", () => {

    test("Login page renders correctly", () => {
        render(<Login/>)
        expect(screen.getByRole("button", {name: /via google/i}))
    })
    test("Click on login button calls login function", async () => {
        const user = userEvent.setup()
        renderWithContext(<MemoryRouter initialEntries={["/login"]}>
            <AppRoutes/>
        </MemoryRouter>)
        await screen.findByRole("button", {name: /via google/i})
        await user.click((screen.getByRole("button", {name: /via google/i})))
        expect(mockLoginFn).toHaveBeenCalled()
    })
    const TestAuthProvider = ({children, service}: { children: ReactElement, service: AuthService }) => {
        const auth = useAuth(service); // Now called inside a real component body!
        return (
            <AuthContext.Provider value={{...auth, taskService: {} as any}}>
                {children}
            </AuthContext.Provider>
        );
    };

    test('redirects to /tasks after successful login', async () => {
        const user = userEvent.setup()
        const mockAuthService = {
            login: vi.fn().mockResolvedValue({id: '1', name: 'Dev User'}),
            logout: vi.fn(),
            onAuthStateChanged: vi.fn().mockReturnValue(()=>{}),
        } as unknown as AuthService;

        render(
            <MemoryRouter initialEntries={['/login']}>
                <TestAuthProvider service={mockAuthService}>
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/tasks" element={<div>Task Dashboard</div>}/>
                        </Routes>
                </TestAuthProvider>
            </MemoryRouter>
        );

        const loginButton = screen.getByRole('button', {name: /via google/i});
        await user.click(loginButton);
        expect(await screen.findByText(/task dashboard/i)).toBeInTheDocument();
    });
    test("Navbar renders correctly when user is logged in", async () => {

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{user: {} as any,} as any}>
                    <ConfirmProvider>
                        <Navbar/>
                    </ConfirmProvider>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await screen.findByRole("button", {name: /sign out/i});
    })
    test("redirect to /login after sign out", async () => {
        const user = userEvent.setup()
        const mockAuthService = {
            login: vi.fn().mockResolvedValue({id: '1', name: 'Dev User'}),
            logout: vi.fn().mockResolvedValue(true),
            onAuthStateChanged: vi.fn().mockReturnValue(()=>{}),
        } as unknown as AuthService;
        render(
            <MemoryRouter initialEntries={['/login']}>
                <TestAuthProvider service={mockAuthService}>
                    <ConfirmProvider>
                        <Navbar/>
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/tasks" element={<div>Task Dashboard</div>}/>
                        </Routes>
                    </ConfirmProvider>
                </TestAuthProvider>
            </MemoryRouter>
        );
        const loginButton = screen.getByRole('button', {name: /via google/i});
        await user.click(loginButton);
        expect(await screen.findByText(/task dashboard/i)).toBeInTheDocument();

        await screen.findByRole("button", {name: /sign out/i})
        const signOutBtn = screen.getByRole('button', {name: /sign out/i})
        await user.click(signOutBtn);

        const confirmBtn = screen.getByRole('button', {name: "Sign Out"})
        await user.click(confirmBtn);
        await screen.findByRole("button", {name: /via google/i})
    })
})