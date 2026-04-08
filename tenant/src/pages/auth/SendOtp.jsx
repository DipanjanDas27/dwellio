import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Mail, Send } from "lucide-react"

import { sendOtp, sendForgotPasswordOtp } from "@/services/authThunks.js"
import { getCurrentUser } from "@/services/userThunks"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const SendOtp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, user])

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" })

  const onSubmit = async (data) => {
    try {
      if (isAuthenticated) {
        await dispatch(sendOtp()).unwrap()
      } else {
        await dispatch(sendForgotPasswordOtp(data.email)).unwrap()
      }
      navigate("/verify-otp")
    } catch {}
  }

  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center px-4 font-montserrat">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <div className="bg-white rounded-card shadow-card-md px-6 sm:px-10 py-8 sm:py-10">

          {/* Header */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <img
              src={logo}
              alt="Dwellio"
              className="h-9 w-auto mb-5 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <div className="size-14 rounded-card bg-beige-card flex items-center justify-center mb-4">
              <Send size={24} className="text-brown-dark" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brown-dark tracking-tight">
              Send OTP
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-brown-muted mt-1 text-center">
              {isAuthenticated
                ? "We'll send a verification code to your registered email"
                : "Enter your email to receive a verification code"}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">

            {/* Email input (only if not logged in) */}
            {!isAuthenticated && (
              <motion.div
                className="space-y-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
              >
                <Label className="text-sm font-bold text-brown-dark">Email</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-11 sm:h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark min-w-0"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>
                )}
              </motion.div>
            )}

            {/* Logged-in email display */}
            {isAuthenticated && (
              <motion.div
                className="flex items-center gap-2.5 p-3 sm:p-4 bg-beige-input border border-beige-card rounded-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Mail size={16} className="text-brown-dark shrink-0" />
                <span className="text-sm font-semibold text-brown-dark truncate w-full">
                  {user?.email}
                </span>
              </motion.div>
            )}

            {/* Buttons */}
            <motion.div
              className="space-y-3 pt-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                type="submit"
                disabled={(!isAuthenticated && !isValid) || loading}
                className="w-full h-11 sm:h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-base rounded-btn"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 sm:h-12 border-beige-card text-brown-dark font-semibold text-base rounded-btn"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </motion.div>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default SendOtp