import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"

export const ownerGetPayments = createAsyncThunk(
  "ownerPayment/getOwnerPayments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/payments/owner/me")
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payments")
    }
  }
)

export const ownerGetPaymentById = createAsyncThunk(
  "ownerPayment/getPaymentById",
  async (paymentId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payments/${paymentId}`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment")
    }
  }
)

export const ownerGetPaymentByTransactionId = createAsyncThunk(
  "ownerPayment/getPaymentByTransactionId",
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payments/transaction/${transactionId}`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Transaction not found")
    }
  }
)