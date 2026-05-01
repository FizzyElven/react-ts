import {useContext} from "react";
import {AuthContext} from "../AuthContext.tsx";

function Login() {
const {login, error} = useContext(AuthContext)
    return (
        <div className="container mx-auto mt-10">
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-xl">
                    <h1 className="font-bold text-4xl mb-5">Login</h1>
                    <button onClick={login}
                        className="border border-gray-400 p-2 text-2xl rounded-md flex items-center justify-center bg-white hover:bg-gray-300 transition-colors duration-300 ease-in-out dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800">
                        via Google
                    </button>
                    {error && <div className="text-red-500">{error.message}</div>}
                </div>
            </div>
        </div>
    );
}

export default Login;
