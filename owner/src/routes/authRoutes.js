import Login from "../pages/auth/Login.jsx"
import Register from "../pages/auth/Register.jsx"
import VerifyOtp from "../pages/auth/VerifyOtp.jsx"
import ResetPassword from "../pages/auth/ResetPassword.jsx"
import SendOtp from "../pages/auth/SendOtp.jsx"

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-otp", element: <VerifyOtp /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/forgot-password", element: <SendOtp /> }
]

export default authRoutes