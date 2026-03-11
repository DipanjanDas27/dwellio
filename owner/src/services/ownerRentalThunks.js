import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"

export const ownerGetRentals = createAsyncThunk(
  "ownerRental/getOwnerRentals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/rentals/owner/me")
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch rentals")
    }
  }
)

export const ownerGetRentalById = createAsyncThunk(
  "ownerRental/getRentalById",
  async (rentalId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/rentals/${rentalId}`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Rental not found")
    }
  }
)

export const ownerTerminateRental = createAsyncThunk(
  "ownerRental/terminateRental",
  async (rentalId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${rentalId}/terminate`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Termination failed")
    }
  }
)

export const ownerBulkTerminateExpiredRentals = createAsyncThunk(
  "ownerRental/bulkTerminateExpiredRentals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/rentals/bulk/terminate-expired")
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Bulk termination failed")
    }
  }
)

export const ownerDeleteRental = createAsyncThunk(
  "ownerRental/deleteRental",
  async (rentalId, { rejectWithValue }) => {
    try {
      await api.delete(`/rentals/${rentalId}`)
      return rentalId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed")
    }
  }
)