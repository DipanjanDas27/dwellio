import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getCurrentUser } from "@/services/userThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  if (loading) return <div className="p-6">Loading...</div>

  if (!user) return <div className="p-6">No user found</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => navigate("/profile/update")}
            >
              Update Profile
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/reset-password")}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile