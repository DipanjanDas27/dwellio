import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword, resetPassword } from "@/services/authThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, isAuthenticated } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({ mode: "onChange" })

  const onSubmit = async (data) => {
    try {
      if (isAuthenticated) {
        await dispatch(changePassword(data)).unwrap()
        navigate("/profile")
      } else {
        await dispatch(resetPassword(data)).unwrap()
        navigate("/login")
      }
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {isAuthenticated ? "Change Password" : "Reset Password"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {isAuthenticated && (
              <div className="space-y-2">
                <Label>Old Password</Label>
                <Input
                  type="password"
                  {...register("oldPassword", {
                    required: "Old password required"
                  })}
                />
                {errors.oldPassword && (
                  <p className="text-sm text-red-500">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                {...register("newPassword", {
                  required: "New password required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters"
                  }
                })}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || loading}
            >
              {loading ? "Processing..." : "Update Password"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword