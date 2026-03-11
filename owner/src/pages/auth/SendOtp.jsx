import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp, sendForgotPasswordOtp } from "@/services/authThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const SendOtp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, loading, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, user])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({ mode: "onChange" })

  const onSubmit = async (data) => {
    try {
      if (isAuthenticated) {
        await dispatch(sendOtp()).unwrap()
      } else {
        await dispatch(sendForgotPasswordOtp(data.email)).unwrap()
      }

      navigate("/verify-otp")
    } catch { }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Send OTP
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {!isAuthenticated && (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {isAuthenticated && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-600">OTP will be sent to:</p>
                </div>
                <p className="font-semibold text-blue-900">{user?.email}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isAuthenticated && !isValid || loading}
            >
              {loading ? "Sending..." : "Send OTP"}
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

export default SendOtp