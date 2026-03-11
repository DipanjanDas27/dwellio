import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  ownerCreateProperty,
  ownerGetProperties,
  ownerUpdateProperty,
  ownerUpdatePropertyImage,
  ownerDeleteProperty
} from "@/services/ownerPropertyThunks.js"

const initialState = {
  properties: [],
  property: null,
  loading: false,
  error: null,
  success: false
}

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(ownerGetProperties.fulfilled, (state, action) => {
        state.properties = action.payload
      })
      .addCase(getProperty.fulfilled, (state, action) => {
        state.property = action.payload
      })
      .addCase(ownerCreateProperty.fulfilled, (state, action) => {
        state.properties = [action.payload, ...state.properties]
      })
      .addCase(ownerUpdateProperty.fulfilled, (state, action) => {
        state.properties = state.properties.map((p) =>
          p.id === action.payload.id
            ? { ...p, ...action.payload }
            : p
        )
      })
      .addCase(ownerUpdatePropertyImage.fulfilled, (state, action) => {
        state.properties = state.properties.map((p) =>
          p.id === action.payload.id
            ? { ...p, image: action.payload.image }
            : p
        )
      })
      .addCase(ownerDeleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (p) => p.id !== action.payload
        )
      })

    builder
      .addMatcher(
        isAnyOf(
          ownerCreateProperty.pending,
          ownerGetProperties.pending,
          ownerUpdateProperty.pending,
          ownerUpdatePropertyImage.pending,
          ownerDeleteProperty.pending
        ),
        (state) => {
          state.loading = true
          state.error = null
          state.success = false
        }
      )
      .addMatcher(
        isAnyOf(
          ownerCreateProperty.fulfilled,
          ownerGetProperties.fulfilled,
          ownerUpdateProperty.fulfilled,
          ownerUpdatePropertyImage.fulfilled,
          ownerDeleteProperty.fulfilled
        ),
        (state) => {
          state.loading = false
          state.success = true
        }
      )
      .addMatcher(
        isAnyOf(
          ownerCreateProperty.rejected,
          ownerGetProperties.rejected,
          ownerUpdateProperty.rejected,
          ownerUpdatePropertyImage.rejected,
          ownerDeleteProperty.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
})

export const { clearPropertyState } = propertySlice.actions

export default propertySlice.reducer