import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import useRefreshToken from './useRefreshToken';
import { useSelector } from 'react-redux';

export default function useAxiosPrivate() {
    const refresh=useRefreshToken();
    const accesstoken = useSelector(state=>state.accesstoken)
    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use((config)=>{
            if(!config.headers['Authorization']){
                config.headers['Authorization']=`Bearer ${accesstoken}`;
            }
            return config;
        },(error)=>{return Promise.reject(error)});

        const responseIntercept = axiosPrivate.interceptors.response.use((response)=>{
            return response;
        },async (error)=>{
            // console.log(error);
            const prevReq=error?.config;
            if(error?.response?.status===403 && !prevReq.sent){
                prevReq.sent=true;
                const accessToken=await refresh();
                prevReq.headers['Authorization']=`Bearer ${accessToken}`;
                return axiosPrivate(prevReq);
            }
            return Promise.reject(error);
        })

        return ()=>{
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    },[accesstoken,refresh])    
  return axiosPrivate;
}