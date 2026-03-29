import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  registerUser,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  changePassword
} from "@/services/authThunks.js"
import { getCurrentUser } from "@/services/userThunks.js"
const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  success: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.error = null
      state.success = false
      state.isAuthenticated = false
      state.isInitialized = true
      state.user = null
    }
  },
  extraReducers: (builder) => {

    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.role !== "tenant") {
          state.user = null
          state.isAuthenticated = false
        } else {
          state.user = action.payload
          state.isAuthenticated = true
        }
        state.isInitialized = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload.role !== "tenant") {
          state.user = null
          state.isAuthenticated = false
        } else {
          state.user = action.payload
          state.isAuthenticated = true
        }
        state.isInitialized = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null,
          state.isAuthenticated = false,
          state.isInitialized = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload.role !== "tenant") {
          state.user = null
          state.isAuthenticated = false
        } else {
          state.user = action.payload
          state.isAuthenticated = true
        }
        state.isInitialized = true
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.user = null,
          state.isAuthenticated = false,
          state.isInitialized = true,
          state.error = null
      })

    builder
      .addMatcher(
        isAnyOf(
          registerUser.pending,
          loginUser.pending,
          logoutUser.pending,
          sendOtp.pending,
          verifyOtp.pending,
          sendForgotPasswordOtp.pending,
          verifyForgotPasswordOtp.pending,
          resetPassword.pending,
          changePassword.pending
        ),
        (state) => {
          state.loading = true
          state.error = null
          state.success = false
        }
      )
      .addMatcher(
        isAnyOf(
          registerUser.fulfilled,
          loginUser.fulfilled,
          logoutUser.fulfilled,
          sendOtp.fulfilled,
          verifyOtp.fulfilled,
          sendForgotPasswordOtp.fulfilled,
          verifyForgotPasswordOtp.fulfilled,
          resetPassword.fulfilled,
          changePassword.fulfilled
        ),
        (state) => {
          state.loading = false
          state.success = true
          state.isInitialized = true
        }
      )
      .addMatcher(
        isAnyOf(
          registerUser.rejected,
          loginUser.rejected,
          logoutUser.rejected,
          sendOtp.rejected,
          verifyOtp.rejected,
          sendForgotPasswordOtp.rejected,
          verifyForgotPasswordOtp.rejected,
          resetPassword.rejected,
          changePassword.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
          state.isInitialized = true
        }
      )
  }
})

export const { clearAuthState } = authSlice.actions

export default authSlice.reducer