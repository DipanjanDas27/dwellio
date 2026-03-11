import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "./api"

export const getFilteredProperties = createAsyncThunk(
  "tenantProperty/getFilteredProperties",
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const res = await api.get(`/properties?${params}`)
      return res.data.data

    } catch (error) {

      if (error.response?.status === 404) {
        return []
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch properties"
      )
    }
  }
)

export const getProperty = createAsyncThunk(
  "tenantProperty/getProperty",
  async (propertyId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/properties/${propertyId}`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch property")
    }
  }
)