import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  ownerGetRentals,
  ownerGetRentalById,
  ownerTerminateRental,
  ownerDeleteRental
} from "@/services/ownerRentalThunks.js"

const initialState = {
  rentals: [],
  rental: null,
  loading: false,
  error: null,
  success: false
}

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(ownerGetRentals.fulfilled, (state, action) => {
        state.rentals = action.payload
      })
      .addCase(ownerGetRentalById.fulfilled, (state, action) => {
        state.rental = action.payload
      })
      .addCase(ownerTerminateRental.fulfilled, (state, action) => {
        state.rentals = state.rentals.map((r) =>
          r.id === action.payload.id
            ? { ...r, status: action.payload.status }
            : r
        )
      })
      .addCase(ownerDeleteRental.fulfilled, (state, action) => {
        state.rentals = state.rentals.filter(
          (r) => r.id !== action.payload
        )
      })

    builder
      .addMatcher(
        isAnyOf(
          ownerGetRentals.pending,
          ownerGetRentalById.pending,
          ownerTerminateRental.pending,
          ownerDeleteRental.pending
        ),
        (state) => {
          state.loading = true
          state.error = null
          state.success = false
        }
      )
      .addMatcher(
        isAnyOf(
          ownerGetRentals.fulfilled,
          ownerGetRentalById.fulfilled,
          ownerTerminateRental.fulfilled,
          ownerDeleteRental.fulfilled
        ),
        (state) => {
          state.loading = false
          state.success = true
        }
      )
      .addMatcher(
        isAnyOf(
          ownerGetRentals.rejected,
          ownerGetRentalById.rejected,
          ownerTerminateRental.rejected,
          ownerDeleteRental.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
})

export const { clearRentalState } = rentalSlice.actions

export default rentalSlice.reducer