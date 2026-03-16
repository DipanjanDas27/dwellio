import { lazy } from "react"
import AuthLayout from "@/components/custom/AuthLayout.jsx"

const MyRentals = lazy(() => import("@/pages/rentals/MyRentals"))
const RentalDetails = lazy(() => import("@/pages/rentals/RentalDetails"))
const CreateRental = lazy(() => import("@/pages/rentals/CreateRental"))

const rentalRoutes = [
  {
    path: "/rentals",
    element: (
      <AuthLayout authentication={true}>
        <MyRentals />
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
  },
  {
    path: "/rentals/:rentalId",
    element: (
      <AuthLayout authentication={true}>
        <RentalDetails />
      </AuthLayout>
    )
  },
]

export default rentalRoutes