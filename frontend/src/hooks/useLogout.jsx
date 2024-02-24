import { useDispatch } from 'react-redux';
import axios from '../api/axios';
import { userLogout } from '../features/userDetailSlice';
 
export default function useLogout() {
   const dispatch =useDispatch()

    const logout = async ()=>{
        try{
            await axios.get('/auth/logout');
           dispatch(userLogout());
        }catch(error){
            console.error(error);
        }
    }
    return logout ;
}