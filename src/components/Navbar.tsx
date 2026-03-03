import {useLocation} from "react-router";
import {useContext} from "react";
import {FireContext} from "../Context.tsx";


function Navbar() {
    const location = useLocation();
    const {logout, user} = useContext(FireContext)
    return (
        <div className="bg-blue-500 text-white text-3xl font-bold h-20">
            <div className="container mx-auto h-full flex items-center justify-between">
                <div>
                    TASK MANAGER
                </div>
                {
                    user && <div className="flex items-center justify-between w-md h-10">
                    <p>{user.displayName}</p>
                    <img alt="user profile picture" src={user.photoURL} className="w-15 h-15 text-sm rounded-full"/>
                        {
                            location.pathname !== "login" &&
                          <button className="cursor-pointer border border-white p-2.5 rounded-md  hover:bg-blue-400"
                                  onClick={logout}>
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