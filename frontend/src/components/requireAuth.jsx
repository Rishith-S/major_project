import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
// import { useEffect } from "react";

const RequireAuth = ({ allowedRole }) => {
    const accesstoken = useSelector(state => state.accesstoken);
    const location = useLocation();
    const role = useSelector((state)=>state.role);
    
    // useEffect(()=>{
    //     console.log(role,allowedRole);
    // },[role,allowedRole])

    return (
       (role.toLowerCase() === allowedRole ) ? <Outlet/> : accesstoken? <Navigate to= {'/home'} state={{ from: location }} replace />
                : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireAuth;