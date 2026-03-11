import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { verifyOtp, verifyForgotPasswordOtp } from "@/services/authThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const VerifyOtp = () => {
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
        await dispatch(verifyOtp(data.otp)).unwrap()
        navigate("/profile/update")
      } else {
        await dispatch(verifyForgotPasswordOtp(data.otp)).unwrap()
        navigate("/reset-password")
      }
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Verify OTP
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">
              <Label>OTP</Label>
              <Input
                {...register("otp", { required: "OTP required" })}
              />
              {errors.otp && (
                <p className="text-sm text-red-500">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
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

export default VerifyOtp