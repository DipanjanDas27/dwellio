import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "./api"

export const createRental = createAsyncThunk(
  "tenantRental/createRental",
  async ({ propertyId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/rentals/${propertyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Rental creation failed")
    }
  }
)

export const getTenantRentals = createAsyncThunk(
  "tenantRental/getTenantRentals",
  async (_, { rejectWithValue }) => {

    try {

      const res = await api.get("/rentals/tenant/me")

      return res.data.data

    } catch (error) {

      if (error.response?.status === 404) {
        return []
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rentals"
      )
    }

  }
)

export const getRentalById = createAsyncThunk(
  "tenantRental/getRentalById",
  async (rentalId, { rejectWithValue }) => {

    try {

      const res = await api.get(`/rentals/${rentalId}`)

      return res.data.data

    } catch (error) {

      if (error.response?.status === 404) {
        return null
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rental"
      )
    }

  }
)

export const cancelRental = createAsyncThunk(
  "tenantRental/cancelRental",
  async (rentalId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${rentalId}/cancel`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to cancel rental")
    }
  }
)

export const renewRental = createAsyncThunk(
  "tenantRental/renewRental",
  async ({ rentalId, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${rentalId}/renew`, data)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Rental renewal failed")
    }
  }
)