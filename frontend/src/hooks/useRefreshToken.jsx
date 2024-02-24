import { useDispatch} from "react-redux";
import axios from "../api/axios";
import { setUserDetails } from "../features/userDetailSlice";

const useRefreshToken= ()=>{

    const dispatch = useDispatch();

    const refresh = async () => {
        try {
            const res = await axios.get('/auth/refresh');
    
            if (res.data) {
                dispatch(setUserDetails({
                    username: res.data.username,
                    accesstoken: res.data.accessToken
                }));
                // console.log(res.data,'je')
                return res.data.accessToken;
            } else {
                console.error("Invalid response format");
                return null;
            }
        } catch (error) {
            //need to handle multiple logins for persistant login 
            console.log(error.response.status)
            console.error("Error during token refresh:", error);
            return null;
        }
    };
    
    return refresh;
}

export default  useRefreshToken;