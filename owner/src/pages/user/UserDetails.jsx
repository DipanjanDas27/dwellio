import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import { getUserDetails } from "@/services/userThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const UserDetails = () => {
  const { userId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userDetails, loading } = useSelector((state) => state.user)

  useEffect(() => {
    if (userId) dispatch(getUserDetails(userId))
  }, [dispatch, userId])

  if (loading) return <div className="p-6">Loading...</div>

  if (!userDetails) return <div className="p-6">User not found</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {userDetails.full_name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Phone:</strong> {userDetails.phone}</p>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDetails