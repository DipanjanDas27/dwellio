import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  createRental,
  getTenantRentals,
  getRentalById,
  cancelRental,
  renewRental
} from "@/services/tenantRentalThunks.js"

const initialState = {
  rentals: [],
  rental: null,
  loading: false,
  error: null
}

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {
    clearRental: (state) => {
      state.rental = null
    }
  },
  extraReducers: (builder) => {

    builder
      .addCase(getTenantRentals.fulfilled, (state, action) => {
        state.rentals = action.payload
      })
      .addCase(getRentalById.fulfilled, (state, action) => {
        state.rental = action.payload
      })
      .addCase(createRental.fulfilled, (state, action) => {
        if (action.payload?.rental) {
          state.rentals.push(action.payload.rental)
        }
        state.loading = false
      })

    builder
      .addMatcher(
        isAnyOf(
          createRental.pending,
          getTenantRentals.pending,
          getRentalById.pending,
          cancelRental.pending,
          renewRental.pending
        ),
        (state) => {
          state.loading = true
          state.error = null
        }
      )
      .addMatcher(
        isAnyOf(
          createRental.fulfilled,
          getTenantRentals.fulfilled,
          getRentalById.fulfilled,
          cancelRental.fulfilled,
          renewRental.fulfilled
        ),
        (state) => {
          state.loading = false
        }
      )
      .addMatcher(
        isAnyOf(
          createRental.rejected,
          getTenantRentals.rejected,
          getRentalById.rejected,
          cancelRental.rejected,
          renewRental.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
})
export const { clearRental } = rentalSlice.actions
export default rentalSlice.reducer