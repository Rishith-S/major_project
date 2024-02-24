import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    name:"",
    username:"",
    accesstoken:""
}

export const userDetailSlice = createSlice({
 name:'Rishi',
 initialState,
 reducers:{
    setUserDetails: (state,action)=>{
        // console.log(action);
        state.username = action.payload.username;
        state.accesstoken = action.payload.accesstoken;
    },
    userLogout:(state)=>{
        state.username ="";
        state.accesstoken = "";
    }
 }
})

export const {setUserDetails,userLogout} = userDetailSlice.actions;
export default userDetailSlice.reducer;