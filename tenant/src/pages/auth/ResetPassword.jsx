import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Lock, ShieldCheck } from "lucide-react"

import { changePassword, resetPassword } from "@/services/authThunks.js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" })

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
    <div className="min-h-screen bg-cream-bg flex items-center justify-center px-4 font-montserrat">
      <motion.div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card-md px-6 sm:px-10 py-8 sm:py-10">

          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Dwellio" className="h-9 mb-5 cursor-pointer" onClick={() => navigate("/")} />
            <div className="size-14 rounded-card bg-beige-card flex items-center justify-center mb-4">
              <ShieldCheck size={26} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brown-dark">
              {isAuthenticated ? "Change Password" : "Reset Password"}
            </h1>
            <p className="text-xs sm:text-sm text-brown-muted mt-1 text-center">
              {isAuthenticated
                ? "Update your current account password"
                : "Set a new password for your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">

            {isAuthenticated && (
              <div>
                <Label>Old Password</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input type="password" className="pl-10 h-11 sm:h-12 min-w-0" {...register("oldPassword")} />
                </div>
              </div>
            )}

            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input type="password" className="pl-10 h-11 sm:h-12 min-w-0" {...register("newPassword")} />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button className="w-full h-11 sm:h-12">
                {loading ? "Processing..." : "Update Password"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 sm:h-12"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword