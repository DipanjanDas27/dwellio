import { lazy } from "react"
import AuthLayout from "@/components/custom/AuthLayout"

const Profile = lazy(() => import("@/pages/user/Profile"))
const UpdateProfile = lazy(() => import("@/pages/user/UpdateProfile"))
const UserDetails = lazy(() => import("@/pages/user/UserDetails"))

const userRoutes = [
  {
    path: "/profile",
    element: (
      <AuthLayout authentication={true}>
        <Profile />
      </AuthLayout>
    )
  },
  {
    path: "/profile/update",
    element: (
      <AuthLayout authentication={true}>
        <UpdateProfile />
      </AuthLayout>
    )
  },
  {
    path: "/users/:userId",
    element: (
      <AuthLayout authentication={true}>
        <UserDetails />
      </AuthLayout>
    )
  }
]

export default userRoutes