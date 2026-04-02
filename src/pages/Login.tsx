import {useContext} from "react";
import {FireContext} from "../FireContext.tsx";

function Login() {
const {login} = useContext(FireContext)

    return (
        <div className="container mx-auto mt-10">
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-xl">
                    <h1 className="font-bold text-4xl mb-5">Login</h1>
                    <button onClick={login}
                        className="border p-2 text-2xl rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors duration-300 ease-in-out">
                        via Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;