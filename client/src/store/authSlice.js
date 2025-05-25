
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
    isAuthenticated:false,
    isLoading:true,
    user:null,
    token:null
}

export const registerUser=createAsyncThunk('auth/register',async (formData)=>{
    const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,formData,{withCredentials:true})
    return response.data
   
})

export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, { withCredentials: true });
      return response.data;
    } catch (error) {
      // catch HTTP errors
      return rejectWithValue(error.response.data); 
    }
  });
  

// export const checkAuth=createAsyncThunk('/auth/checkauth',async ()=>{
//     const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/checkauth`,{
//         withCredentials:true,
//         headers:{
//             'Cache-Control':'no-store,no-cache,must-revalidate,proxy-revalidate,'
//         }
//     })
//     return response.data
// })

export const checkAuth=createAsyncThunk('/auth/checkauth',async (token)=>{
    const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/checkauth`,{
        headers:{
            Authorization:`Bearer ${token}`,
            'Cache-Control':'no-store,no-cache,must-revalidate,proxy-revalidate,'
        }
    })
    return response.data
})

export const logoutUser=createAsyncThunk('auth/logout',async ()=>{
    const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{},{withCredentials:true})
    return response.data
   
})


const AuthSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser:(state,actions)=>{},
        resetTokenAndCredentials:(state)=>{
            state.isAuthenticated=false,
            state.user=null,
            state.token=null
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
            state.token=actions.payload.token
            sessionStorage.setItem('token',JSON.stringify(actions.payload.token))
        })
        .addCase(loginUser.rejected,(state)=>{
            state.isLoading=false,
            state.user=null
            state.isAuthenticated=false
            state.token=null
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

export const {setUser,resetTokenAndCredentials}=AuthSlice.actions;
export default AuthSlice.reducer