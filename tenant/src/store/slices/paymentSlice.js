import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  createPayment,
  getTenantPayments,
  getPaymentById,
  getPaymentByTransactionId,
  deletePayment,
  getPaymentsByAgreement,
} from "@/services/tenantPaymentThunks.js"

const initialState = {
  payments: [],
  agreementPayments: [],
  paymentDetails: null,
  loading: false,
  error: null,
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
      .addCase(createPayment.fulfilled, (state, action) => {
        if (action.payload) {
          // update payments list
          const index = state.payments.findIndex(p => p.id === action.payload.id)
          if (index !== -1) {
            state.payments[index] = action.payload  
          } else {
            state.payments.push(action.payload)     
          }
          const agreementIndex = state.agreementPayments.findIndex(
            p => p.id === action.payload.id
          )
          if (agreementIndex !== -1) {
            state.agreementPayments[agreementIndex] = action.payload  
          } else {
            state.agreementPayments.push(action.payload)  
          }
        }
      })
      .addCase(getPaymentByTransactionId.fulfilled, (state, action) => {
        state.paymentDetails = action.payload
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(p => p.id !== action.meta.arg)
      })
      .addCase(getPaymentsByAgreement.fulfilled, (state, action) => {
        state.agreementPayments = action.payload
      })

    builder
      .addMatcher(
        isAnyOf(
          createPayment.pending,
          getTenantPayments.pending,
          getPaymentById.pending,
          getPaymentByTransactionId.pending,
          deletePayment.pending,
          getPaymentsByAgreement.pending,
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
          deletePayment.fulfilled,
          getPaymentsByAgreement.fulfilled,
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
          deletePayment.rejected,
          getPaymentsByAgreement.rejected,
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
})

export default paymentSlice.reducer