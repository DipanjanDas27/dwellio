import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Mail, Lock, User, Phone, ImagePlus, Home, Building2 } from "lucide-react"

import { registerUser } from "@/services/authThunks.js"
import { clearAuthState } from "@/store/slices/authSlice.js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [file, setFile] = useState(null)
  const [role, setRole] = useState("")

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" })

  useEffect(() => {
    dispatch(clearAuthState())
  }, [dispatch])
  
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))
    if (file) formData.append("profileImage", file)
    try {
      await dispatch(registerUser(formData)).unwrap()
      navigate("/")
    } catch { }
  }

  const fieldAnim = (delay) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration: 0.45 },
  })

  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center px-4 py-12 font-montserrat">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <div className="bg-white rounded-card shadow-card-md px-10 py-10">

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
            <h1 className="text-2xl font-extrabold text-brown-dark tracking-tight">Create Account</h1>
            <p className="text-sm font-semibold text-brown-muted mt-1">Join Dwellio and find your dream home</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <motion.div className="space-y-1.5" {...fieldAnim(0.2)}>
              <Label className="text-sm font-bold text-brown-dark">Full Name</Label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                <Input
                  placeholder="Arjun Mehta"
                  className="pl-10 h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                  {...register("full_name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                  })}
                />
              </div>
              {errors.full_name && <p className="text-xs font-semibold text-red-500">{errors.full_name.message}</p>}
            </motion.div>

            <motion.div className="space-y-1.5" {...fieldAnim(0.26)}>
              <Label className="text-sm font-bold text-brown-dark">Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>}
            </motion.div>

            <motion.div className="space-y-1.5" {...fieldAnim(0.32)}>
              <Label className="text-sm font-bold text-brown-dark">Phone</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                <Input
                  placeholder="+91 98765 43210"
                  className="pl-10 h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                  {...register("phone", { required: "Phone is required" })}
                />
              </div>
              {errors.phone && <p className="text-xs font-semibold text-red-500">{errors.phone.message}</p>}
            </motion.div>

            <motion.div className="space-y-1.5" {...fieldAnim(0.38)}>
              <Label className="text-sm font-bold text-brown-dark">Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                  {...register("password", {
                    required: "Password required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
                  })}
                />
              </div>
              {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password.message}</p>}
            </motion.div>

            {/* Role selector */}
            <motion.div className="space-y-1.5" {...fieldAnim(0.44)}>
              <Label className="text-sm font-bold text-brown-dark">I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "tenant", label: "Tenant", icon: <Home size={20} />, desc: "Looking to rent" },
                  { value: "owner", label: "Owner", icon: <Building2 size={20} />, desc: "Listing a property" },
                ].map((option) => {
                  const rhfProps = register("role", { required: "Please select a role" })
                  return (
                    <label
                      key={option.value}
                      className={`
        relative flex flex-col items-center gap-2 p-4 rounded-card border-2 cursor-pointer
        transition-all duration-150 select-none
        ${role === option.value
                          ? "border-brown-dark bg-beige-card"
                          : "border-beige-card bg-beige-input hover:border-brown-muted"
                        }
      `}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        className="hidden"
                        {...rhfProps}
                        onChange={(e) => {
                          rhfProps.onChange(e)
                          setRole(e.target.value)
                        }}
                      />
                      <span className={`${role === option.value ? "text-brown-dark" : "text-brown-muted"} transition-colors duration-150`}>
                        {option.icon}
                      </span>
                      <span className={`text-sm font-extrabold leading-none ${role === option.value ? "text-brown-dark" : "text-brown-mid"}`}>
                        {option.label}
                      </span>
                      <span className={`text-xs font-semibold leading-none ${role === option.value ? "text-brown-mid" : "text-brown-muted"}`}>
                        {option.desc}
                      </span>
                      {role === option.value && (
                        <motion.span
                          className="absolute top-2 right-2 size-4 rounded-full bg-brown-dark flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, ease: [0.22, 0.68, 0, 1.2] }}
                        >
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3.2 5.7L6.5 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.span>
                      )}
                    </label>
                  )
                })}
              </div>
              {errors.role && <p className="text-xs font-semibold text-red-500">{errors.role.message}</p>}
            </motion.div>

            <motion.div className="space-y-1.5" {...fieldAnim(0.5)}>
              <Label className="text-sm font-bold text-brown-dark">Profile Image</Label>
              <label className="flex items-center gap-3 h-12 px-3.5 bg-beige-input border border-beige-card rounded-btn cursor-pointer hover:border-brown-muted transition-colors duration-150">
                <ImagePlus size={16} className="text-brown-muted shrink-0" />
                <span className="text-sm font-semibold text-brown-muted truncate">
                  {file ? file.name : "Choose a photo..."}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </motion.div>

            {error && (
              <motion.p
                className="text-xs font-semibold text-red-500 text-center bg-red-50 border border-red-200 rounded-btn py-2.5 px-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.p>
            )}

            <motion.div
              className="space-y-3 pt-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.45 }}
            >
              <Button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-base rounded-btn transition-colors duration-150"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating account...
                  </span>
                ) : "Register"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-beige-card text-brown-dark font-semibold text-base rounded-btn hover:bg-beige-input transition-colors duration-150"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </motion.div>

            <motion.p
              className="text-sm text-center text-brown-muted font-semibold pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62, duration: 0.4 }}
            >
              Already have an account?{" "}
              <span
                className="text-brown-dark font-bold hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </motion.p>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Register