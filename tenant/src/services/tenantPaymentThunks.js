import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "./api"

export const createPayment = createAsyncThunk(
  "tenantPayment/createPayment",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/payments", data)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Payment failed")
    }
  }
)

export const getTenantPayments = createAsyncThunk(
  "tenantPayment/getTenantPayments",
  async (_, { rejectWithValue }) => {

    try {
      const res = await api.get("/payments/tenant/me")
      return res.data.data
    } catch (error) {
      if (error.response?.status === 404) {
        return []
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payments"
      )
    }

  }
)

export const getPaymentById = createAsyncThunk(
  "tenantPayment/getPaymentById",
  async (paymentId, { rejectWithValue }) => {

    try {
      const res = await api.get(`/payments/${paymentId}`)
      return res.data.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment"
      )
    }

  }
)

export const getPaymentsByAgreement = createAsyncThunk(
  "tenantPayment/getPaymentsByAgreement",
  async (agreementId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payments/agreement/${agreementId}`)
      return res.data.data
    } catch (error) {
      if (error.response?.status === 404) return []
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payments")
    }
  }
)

export const getPaymentByTransactionId = createAsyncThunk(
  "tenantPayment/getPaymentByTransactionId",
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payments/transaction/${transactionId}`)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment")
    }
  }
)

export const deletePayment = createAsyncThunk(
  "tenantPayment/deletePayment",
  async (paymentId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/payments/${paymentId}`)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete payment")
    }
  }
)