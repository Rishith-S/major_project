import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useSelector } from "react-redux";

const PersistLogin=()=>{
    const [loading,setLoading] = useState(true);
    const refresh = useRefreshToken();
    const accessToken = useSelector((state)=>state.accesstoken);

    useEffect(()=>{
        let isMounted=true;
        const verifyRefreshToken = async ()=>{
            try{
                await refresh();
            }
            catch(err){
                console.log(err);
            }
            finally{
                isMounted && setLoading(false);
            }
        }
        !accessToken? verifyRefreshToken(): setLoading(false);
        return ()=>isMounted=false;
    },[accessToken,refresh]);
    return (
        <>
        {loading?<p>Loading...</p>:<Outlet/>}
        </>
    )
}

export default PersistLogin;