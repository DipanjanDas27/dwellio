import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./slices/authSlice"
import userReducer from "./slices/userSlice"
import propertyReducer from "./slices/propertySlice"
import rentalReducer from "./slices/rentalSlice"
import paymentReducer from "./slices/paymentSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    property: propertyReducer,
    rental: rentalReducer,
    payment: paymentReducer
  }
})