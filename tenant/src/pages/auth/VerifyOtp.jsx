import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { KeyRound, ShieldCheck } from "lucide-react"

import { verifyOtp, verifyForgotPasswordOtp } from "@/services/authThunks.js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const VerifyOtp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { isValid } } = useForm({ mode: "onChange" })

  const onSubmit = async (data) => {
    try {
      if (isAuthenticated) await dispatch(verifyOtp(data.otp)).unwrap()
      else await dispatch(verifyForgotPasswordOtp(data.otp)).unwrap()
      navigate("/reset-password")
    } catch {}
  }

  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center px-4 font-montserrat">
      <motion.div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card-md px-6 sm:px-10 py-8 sm:py-10">

          <div className="flex flex-col items-center mb-8">
            <img src={logo} className="h-9 mb-5 cursor-pointer" onClick={() => navigate("/")} />
            <KeyRound size={26} className="mb-4" />
            <h1 className="text-xl sm:text-2xl font-extrabold">Verify OTP</h1>
            <p className="text-xs sm:text-sm text-center">
              Enter the 6-digit code
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">

            <div>
              <Label>OTP Code</Label>
              <Input
                maxLength={6}
                className="h-11 sm:h-12 text-base sm:text-lg tracking-[0.3em] sm:tracking-[0.4em] text-center min-w-0"
                {...register("otp")}
              />
            </div>

            <div className="text-center text-xs sm:text-sm">
              Didn't receive?{" "}
              <span className="cursor-pointer font-bold" onClick={() => navigate("/send-otp")}>
                Resend
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <Button className="w-full h-11 sm:h-12">
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button type="button" variant="outline" className="w-full h-11 sm:h-12" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyOtp