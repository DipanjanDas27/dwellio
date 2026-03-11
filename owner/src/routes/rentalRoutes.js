import { lazy } from "react"
import AuthLayout from "@/components/custom/AuthLayout"

const OwnerRentals = lazy(() => import("@/pages/rentals/OwnerRentals"))
const RentalDetails = lazy(() => import("@/pages/rentals/RentalDetails"))

const rentalRoutes = [
  {
    path: "/owner/rentals",
    element: (
      <AuthLayout authentication={true}>
        <OwnerRentals />
      </AuthLayout>
    )
  },
  {
    path: "/owner/rentals/:rentalId",
    element: (
      <AuthLayout authentication={true}>
        <RentalDetails />
      </AuthLayout>
    )
  }
]

export default rentalRoutes