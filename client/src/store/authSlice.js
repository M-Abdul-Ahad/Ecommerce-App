import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
    isAuthenticated:false,
    isLoading:true,
    user:null
}

export const registerUser=createAsyncThunk('auth/register',async (formData)=>{
    const response=await axios.post('http://localhost:5000/api/auth/register',formData,{withCredentials:true})
    return response.data
   
})

export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData, { withCredentials: true });
      return response.data;
    } catch (error) {
      // catch HTTP errors
      return rejectWithValue(error.response.data); 
    }
  });
  

export const checkAuth=createAsyncThunk('/auth/checkauth',async ()=>{
    const response=await axios.get('http://localhost:5000/api/auth/checkauth',{
        withCredentials:true,
        headers:{
            'Cache-Control':'no-store,no-cache,must-revalidate,proxy-revalidate,'
        }
    })
    return response.data
})

export const logoutUser=createAsyncThunk('auth/logout',async ()=>{
    const response=await axios.post('http://localhost:5000/api/auth/logout',{},{withCredentials:true})
    return response.data
   
})


const AuthSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser:(state,actions)=>{

        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(registerUser.fulfilled,(state,actions)=>{
            state.isLoading=false,
            state.user=actions.payload
            state.isAuthenticated=false
        })
        .addCase(registerUser.rejected,(state)=>{
            state.isLoading=false,
            state.user=null
            state.isAuthenticated=false
        })
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(loginUser.fulfilled,(state,actions)=>{
            state.isLoading=false,
            state.user=actions.payload.success ? actions.payload.user : null
            state.isAuthenticated=actions.payload.success ? true: false
        })
        .addCase(loginUser.rejected,(state)=>{
            state.isLoading=false,
            state.user=null
            state.isAuthenticated=false
        })
        .addCase(checkAuth.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(checkAuth.fulfilled,(state,actions)=>{
            state.isLoading=false
            state.user=actions.payload.success ? actions.payload.user : null
            state.isAuthenticated=actions.payload.success ? true: false
        })
        .addCase(checkAuth.rejected,(state)=>{
            state.isLoading=false,
            state.user=null
            state.isAuthenticated=false
        })
        .addCase(logoutUser.fulfilled,(state)=>{
            state.isLoading=false,
            state.user= null
            state.isAuthenticated=false
        })
    }
})

export const {setUser}=AuthSlice.actions;
export default AuthSlice.reducer