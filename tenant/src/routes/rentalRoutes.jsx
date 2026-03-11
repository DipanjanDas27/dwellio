import { lazy } from "react"
import AuthLayout from "@/components/custom/AuthLayout.jsx"

const Rentals = lazy(() => import("@/pages/rentals/Rentals"))
const RentalDetails = lazy(() => import("@/pages/rentals/RentalDetails"))
const CreateRental = lazy(() => import("@/pages/rentals/CreateRental"))

const rentalRoutes = [
  {
    path: "/rentals",
    element: (
      <AuthLayout authentication={true}>
        <Rentals />
      </AuthLayout>
    )
  },
  {
    path: "/rentals/:rentalId",
    element: (
      <AuthLayout authentication={true}>
        <RentalDetails />
      </AuthLayout>
    )
  },
  {
    path: "/rentals/create/:propertyId",
    element: (
      <AuthLayout authentication={true}>
        <CreateRental />
      </AuthLayout>
    )
  }
]

export default rentalRoutes