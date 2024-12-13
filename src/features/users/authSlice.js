// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleLogin } from "../../Hooks/authApi"; // Import handleLogin function for login API
import { verifyOtp } from "../../Hooks/authApi"; // Import verifyOtp function for OTP verification API

// Initial state for authentication, including both login and OTP verification
const initialState = {
  user: null,
  isLogin: false,
  otpVerified: false,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (input, { rejectWithValue }) => {
    try {
      const userData = await handleLogin(input);
      if (!userData) {
        throw new Error("Login failed");
      }
      return userData; // Return user data if login is successful
    } catch (error) {
      return rejectWithValue(error.message); // Return error message if login fails
    }
  }
);

// Async thunk for OTP verification
export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtp",
  async (otpValue, { rejectWithValue }) => {
    try {
      const response = await verifyOtp(otpValue);
      if (!response) {
        throw new Error("OTP verification failed");
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.otpVerified = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

 
      .addCase(verifyOtpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAction.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = action.payload;
        state.isLogin = true; 
   
      })
      .addCase(verifyOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
