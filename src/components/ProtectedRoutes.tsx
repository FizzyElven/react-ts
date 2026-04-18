import {Navigate, Outlet} from "react-router";
import {useContext} from "react";
import {AuthContext} from "../AuthContext.tsx";

function ProtectedRoutes() {
    const {user} = useContext(AuthContext);
    return user ? <Outlet/> : <Navigate to="/login" replace={true}/>
}

export default ProtectedRoutes;