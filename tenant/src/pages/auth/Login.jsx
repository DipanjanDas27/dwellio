import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Mail, Lock, LogIn } from "lucide-react"

import { loginUser } from "@/services/authThunks.js"
import { clearAuthState } from "@/store/slices/authSlice.js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(clearAuthState())
  }, [dispatch])

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" })

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap()
      navigate("/")
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-brown-dark tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-brown-muted mt-1 text-center">
              Login to your Dwellio account
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">

            <motion.div className="space-y-1.5">
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
              {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>}
            </motion.div>

            <motion.div className="space-y-1.5">
              <Label className="text-sm font-bold text-brown-dark">Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 sm:h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark min-w-0"
                  {...register("password", { required: "Password is required" })}
                />
              </div>
              {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password.message}</p>}
            </motion.div>

            <div className="flex justify-end -mt-1">
              <span
                className="text-xs font-bold text-brown-mid hover:text-brown-dark cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-500 text-center bg-red-50 border border-red-200 rounded-btn py-2.5 px-4">
                {error}
              </p>
            )}

            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-11 sm:h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-base rounded-btn flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  <>
                    <LogIn size={17} />
                    Login
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 sm:h-12 border-beige-card text-brown-dark font-semibold text-base rounded-btn hover:bg-beige-input"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-center text-brown-muted font-semibold pt-1">
              Don't have an account?{" "}
              <span
                className="text-brown-dark font-bold hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Login