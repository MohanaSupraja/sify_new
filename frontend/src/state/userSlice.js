import { Login } from "@mui/icons-material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { toast } from 'react-toastify';

const initialState = {
    users: [],
    addUserSuccess: false,
    addUserSuccess2: false,
    isAuthenticated: false, // Add an authentication state
    login:[]
};

export const addUsers = createAsyncThunk("add-users", async ({ firstname, lastname, email, password, role }, { rejectWithValue }) => {
    try {
        console.log(firstname,role)
        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3001/add-users", 
            { firstname, lastname, email, password, role }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const removeUsers = createAsyncThunk("remove-users", async ({ email },{ rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3001/remove-users", 
            { email }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const updateUsers = createAsyncThunk('update-users', async ({ email, role }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put("http://localhost:3001/update-users", 
            { email, role }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const getUsers = createAsyncThunk("get-users", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3001/get-users", 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        return response.data;
        } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
        }
});

export const loginUser = createAsyncThunk("login-users", async ({ email, password }) => {
    try {
        const response = await axios.post("http://localhost:3001/login-users", { email, password });
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        console.log("login user:",response.data)
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Error response data:", error.response.data.error);
            return error.response.data;
        }
        
    }
});


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            toast.info("Logged out successfully");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state,action) => {
                
                state.login = action.payload;
                console.log("login:::",state.login)
                localStorage.setItem('userData', JSON.stringify(state.login));
                console.log(localStorage.getItem('userData'));
                state.addUserSuccess = true;
                state.isAuthenticated = true; // Set authentication status
                // toast.success("Login Success");
                
            })
            .addCase(loginUser.rejected, (state) => {
                state.addUserSuccess = false;
                state.isAuthenticated = false; // Ensure authentication status is false on failure
                toast.error("Login failed");
            })
            .addCase(addUsers.fulfilled, (state) => {
                toast.success("Signup success");
            })
            .addCase(addUsers.rejected, (state) => {
                toast.error("Session Expired");
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                console.log(state.users)
            })
            .addCase(getUsers.rejected, (state) => {
                toast.error("Session Expired");
            })
            .addCase(removeUsers.fulfilled, (state) => {
                toast.success("User Removed");
            })
            .addCase(removeUsers.rejected, (state) => {
                toast.error("Session Expired");
            })
            .addCase(updateUsers.rejected, (state) => {
                toast.error("Session Expired");
            });
    },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;

export const selectusers = (state) => state.user.users;
export const selectAddUserSuccess = (state) => state.user.addUserSuccess;
export const selectAddUser = (state) => state.user.addUserSuccess2;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated; // Selector for authentication status
export const logedinuser = (state)=>state.user.login;