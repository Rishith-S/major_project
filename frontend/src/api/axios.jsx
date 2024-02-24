import axios from "axios";
const URL='http://localhost:5000';

export default axios.create({
    baseURL:URL,
    withCredentials:true
})

export const axiosPrivate=axios.create({
    baseURL:URL,
    withCredentials:true
})