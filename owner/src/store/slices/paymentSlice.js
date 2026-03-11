import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  ownerGetPayments,
  ownerGetPaymentById,
  ownerGetPaymentByTransactionId
} from "@/services/ownerPaymentThunks.js"

const initialState = {
  payments: [],
  payment: null,
  loading: false,
  error: null,
  success: false
}

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(ownerGetPayments.fulfilled, (state, action) => {
        state.payments = action.payload
      })
      .addCase(ownerGetPaymentById.fulfilled, (state, action) => {
        state.payment = action.payload
      })
      .addCase(ownerGetPaymentByTransactionId.fulfilled, (state, action) => {
        state.payment = action.payload
      })

    builder
      .addMatcher(
        isAnyOf(
          ownerGetPayments.pending,
          ownerGetPaymentById.pending,
          ownerGetPaymentByTransactionId.pending
        ),
        (state) => {
          state.loading = true
          state.error = null
          state.success = false
        }
      )
      .addMatcher(
        isAnyOf(
          ownerGetPayments.fulfilled,
          ownerGetPaymentById.fulfilled,
          ownerGetPaymentByTransactionId.fulfilled
        ),
        (state) => {
          state.loading = false
          state.success = true
        }
      )
      .addMatcher(
        isAnyOf(
          ownerGetPayments.rejected,
          ownerGetPaymentById.rejected,
          ownerGetPaymentByTransactionId.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
})

export const { clearPaymentState } = paymentSlice.actions

export default paymentSlice.reducer