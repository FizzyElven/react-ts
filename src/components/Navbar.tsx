import {useLocation} from "react-router";
import {useContext} from "react";
import {AuthContext} from "../AuthContext.tsx";
import {BTN_VARIANT} from "../types/types.ts";
import {useConfirm} from "../ConfirmContext.tsx";
import {useTheme} from "../stores/themeStore.ts";

function Navbar() {
    const location = useLocation();
    const confirm = useConfirm();
    const {logout, user} = useContext(AuthContext)
    const {isDark, toggle} = useTheme();
    const handleLogout = () => {
        confirm(
            {
                title: "Sign Out",
                text: "Are you sure you want to sign out?",
                confirmText: "Sign Out",
                btnVariant: BTN_VARIANT.DANGER,
                confirmAction: () => logout(),
            }
        )
    }
    return (
        <div
            className="bg-blue-600 text-white text-3xl font-bold min-h-20 shadow-sm shadow-black text-shadow-lg dark:bg-blue-950">
            <div className="container mx-auto min-h-20 flex items-center justify-between gap-5 py-2">
                <div>
                    TASK MANAGER
                </div>
                <div className="flex items-center gap-5 h-10">
                    {user && <>
                        <p className="text-shadow-lg">{user.displayName}</p>
                        <img alt="user profile picture" src={user.photoURL!} referrerPolicy="no-referrer"
                             className="w-15 h-15 text-sm rounded-full shadow-sm shadow-black"/>
                        {
                            location.pathname !== "login" &&
                                <button
                                        className="shadow-sm shadow-blue-950 cursor-pointer border border-white p-2.5 rounded-md  hover:bg-blue-500 text-shadow-lg"
                                        onClick={handleLogout}>
                                    SIGN OUT
                                </button>
                        }
                    </>}
                    <button onClick={toggle}
                            className="rounded-full dark:hover:bg-blue-700 hover:bg-blue-400 w-15 h-15 flex justify-center items-center cursor-pointer">
                        {isDark ? "🌙" : "☀️"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
