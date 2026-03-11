import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "./api"

export const getCurrentUser = createAsyncThunk(
  "owner/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/me")
      return res.data.data
    } catch (error) {
      return rejectWithValue(null)
    }
  }
)

export const getUserDetails = createAsyncThunk(
  "owner/getUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}/details`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user details")
    }
  }
)

export const updateProfile = createAsyncThunk(
  "owner/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.patch("/users/me/updateprofile", data)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Profile update failed")
    }
  }
)

export const updateProfileImage = createAsyncThunk(
  "owner/updateProfileImage",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch("/users/me/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Image update failed")
    }
  }
)

export const deleteAccount = createAsyncThunk(
  "owner/deleteAccount",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/users/${userId}`)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Account deletion failed")
    }
  }
)