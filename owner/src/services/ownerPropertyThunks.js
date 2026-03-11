import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"

export const ownerCreateProperty = createAsyncThunk(
  "ownerProperty/createProperty",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/properties", formData)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Property creation failed")
    }
  }
)

export const ownerGetProperties = createAsyncThunk(
  "ownerProperty/getOwnerProperties",
  async (ownerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/properties/owner/${ownerId}`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch properties")
    }
  }
)

export const ownerUpdateProperty = createAsyncThunk(
  "ownerProperty/updateProperty",
  async ({ propertyId, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/properties/${propertyId}`, data)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed")
    }
  }
)

export const ownerUpdatePropertyImage = createAsyncThunk(
  "ownerProperty/updatePropertyImage",
  async ({ propertyId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/properties/${propertyId}/image`, formData)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Image update failed")
    }
  }
)

export const ownerDeleteProperty = createAsyncThunk(
  "ownerProperty/deleteProperty",
  async (propertyId, { rejectWithValue }) => {
    try {
      await api.delete(`/properties/${propertyId}`)
      return propertyId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed")
    }
  }
)