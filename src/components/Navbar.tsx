import {useLocation} from "react-router";
import {useContext} from "react";
import {FireContext} from "../FireContext.tsx";
import {BTN_VARIANT, type ConfirmDialog} from "../types/types.ts";

function Navbar({setConfirmDialog}: { setConfirmDialog: (actions: ConfirmDialog | null) => void }) {
    const location = useLocation();
    const {logout, user} = useContext(FireContext)
    const handleLogout = () => {
        setConfirmDialog(
            {
                title: "Sign Out",
                text: "Are you sure you want to sign out?",
                confirmText: "Sign Out",
                btnVariant: BTN_VARIANT.DANGER,
                onConfirm: () => {
                    logout();
                    setConfirmDialog(null);
                },
                onCancel: () => {
                    setConfirmDialog(null)
                }
            }
        )
    }
    return (
        <div className="bg-blue-600 text-white text-3xl font-bold h-20 shadow-sm shadow-black text-shadow-lg">
            <div className="container mx-auto h-full flex items-center justify-between">
                <div>
                    TASK MANAGER
                </div>
                {
                    user && <div className="flex items-center justify-between w-md h-10">
                    <p className="text-shadow-lg">{user.displayName}</p>
                    <img alt="user profile picture" src={user.photoURL!}
                         className="w-15 h-15 text-sm rounded-full shadow-sm shadow-black"/>
                        {
                            location.pathname !== "login" &&
                          <button
                            className="shadow-sm shadow-blue-950 cursor-pointer border border-white p-2.5 rounded-md  hover:bg-blue-500 text-shadow-lg"
                            onClick={handleLogout}>
                            SIGN OUT
                          </button>
                        }
                  </div>
                }
            </div>
        </div>
    );
}

export default Navbar;