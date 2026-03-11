import { createBrowserRouter } from "react-router-dom"

import App from "@/App"
import Home from "@/pages/Home"

import authRoutes from "./authRoutes"
import propertyRoutes from "./propertyRoutes"
import rentalRoutes from "./rentalRoutes"
import paymentRoutes from "./paymentRoutes"
import userRoutes from "./userRoutes"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },

      ...authRoutes,
      ...propertyRoutes,
      ...rentalRoutes,
      ...paymentRoutes,
      ...userRoutes
    ]
  }
])

export { router }