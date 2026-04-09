import {Navigate, Outlet} from "react-router";
import {useContext} from "react";
import {FireContext} from "../FireContext.tsx";

function ProtectedRoutes() {
    const {user} = useContext(FireContext);
    return user ? <Outlet/> : <Navigate to="/login" replace={true}/>
}

export default ProtectedRoutes;