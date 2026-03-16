import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  createPayment,
  getTenantPayments,
  getPaymentById,
  getPaymentByTransactionId,
  deletePayment
} from "@/services/tenantPaymentThunks.js"


const initialState = {
  payments: [],
  paymentDetails: null,
  loading: false,
  error: null
}

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(getTenantPayments.fulfilled, (state, action) => {
        state.payments = action.payload
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.paymentDetails = action.payload
      })
      .addCase(getPaymentByTransactionId.fulfilled, (state, action) => {
        state.paymentDetails = action.payload
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload)
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(p => p.id !== action.meta.arg)
      })

    builder
      .addMatcher(
        isAnyOf(
          createPayment.pending,
          getTenantPayments.pending,
          getPaymentById.pending,
          getPaymentByTransactionId.pending,
          deletePayment.pending
        ),
        (state) => {
          state.loading = true
          state.error = null
        }
      )
      .addMatcher(
        isAnyOf(
          createPayment.fulfilled,
          getTenantPayments.fulfilled,
          getPaymentById.fulfilled,
          getPaymentByTransactionId.fulfilled,
          deletePayment.fulfilled
        ),
        (state) => {
          state.loading = false
        }
      )
      .addMatcher(
        isAnyOf(
          createPayment.rejected,
          getTenantPayments.rejected,
          getPaymentById.rejected,
          getPaymentByTransactionId.rejected,
          deletePayment.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
})

export default paymentSlice.reducer