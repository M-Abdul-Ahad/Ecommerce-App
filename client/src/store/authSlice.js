import {createSlice} from '@reduxjs/toolkit'

const initialState={
    isAuthenticated:false,
    isLoading:false,
    user:null
}

const AuthSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser:(state,actions)=>{

        }
    }
})

export const {setUser}=AuthSlice.actions;
export default AuthSlice.reducer