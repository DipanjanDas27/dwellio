import Profile from "../pages/user/Profile.jsx"
import UpdateProfile from "../pages/user/UpdateProfile.jsx"
import UserDetails from "../pages/user/UserDetails.jsx"
import AuthLayout from "../components/custom/AuthLayout.jsx"

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