import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  getCurrentUser,
  getUserDetails,
  updateProfile,
  updateProfileImage,
  deleteAccount
} from "@/services/userThunks.js"

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {

    builder
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null
      })

    builder
      .addMatcher(
        isAnyOf(
          getCurrentUser.pending,
          getUserDetails.pending,
          updateProfile.pending,
          updateProfileImage.pending,
          deleteAccount.pending
        ),
        (state) => {
          state.loading = true
          state.error = null
          state.success = false
        }
      )
      .addMatcher(
        isAnyOf(
          getCurrentUser.fulfilled,
          getUserDetails.fulfilled,
          updateProfile.fulfilled,
          updateProfileImage.fulfilled,
          deleteAccount.fulfilled
        ),
        (state) => {
          state.loading = false
          state.success = true
        }
      )
      .addMatcher(
        isAnyOf(
          getCurrentUser.rejected,
          getUserDetails.rejected,
          updateProfile.rejected,
          updateProfileImage.rejected,
          deleteAccount.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
})

export const { clearUserState } = userSlice.actions

export default userSlice.reducer