import {Navigate, Outlet} from "react-router";
import {useContext} from "react";
import {FireContext} from "../Context.tsx";

function ProtectedRoutes() {
    const {auth} = useContext(FireContext);
    console.log(auth.currentUser);
    return auth.currentUser ? <Outlet/> : <Navigate to="/login" replace={true}/>
}

export default ProtectedRoutes;