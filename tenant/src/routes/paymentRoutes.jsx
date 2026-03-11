import { lazy } from "react"
import AuthLayout from "@/components/custom/AuthLayout"

const Payments = lazy(() => import("@/pages/payments/Payments"))
const PaymentDetails = lazy(() => import("@/pages/payments/PaymentDetails"))

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