import Payments from "../pages/payments/Payments.jsx"
import PaymentDetails from "../pages/payments/PaymentDetails.jsx"
import AuthLayout from "../components/custom/AuthLayout.jsx"

const paymentRoutes = [
  {
    path: "/payments",
    element: (
      <AuthLayout authentication={true}>
        <Payments />
      </AuthLayout>
    )
  },
  {
    path: "/payments/:paymentId",
    element: (
      <AuthLayout authentication={true}>
        <PaymentDetails />
      </AuthLayout>
    )
  }
]

export default paymentRoutes