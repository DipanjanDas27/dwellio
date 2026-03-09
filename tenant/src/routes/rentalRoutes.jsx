import MyRentals from "../pages/rentals/MyRentals.jsx"
import RentalDetails from "../pages/rentals/RentalDetails.jsx"
import AuthLayout from "../components/custom/AuthLayout.jsx"

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
    path: "/rentals/:rentalId",
    element: (
      <AuthLayout authentication={true}>
        <RentalDetails />
      </AuthLayout>
    )
  }
]

export default rentalRoutes