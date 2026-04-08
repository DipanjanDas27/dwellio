import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Mail, Lock, User, Phone, ImagePlus } from "lucide-react"

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
    formData.append("role", "tenant")
    if (file) formData.append("profileImage", file)

    try {
      await dispatch(registerUser(formData)).unwrap()
      navigate("/")
    } catch {}
  }

  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center px-4 py-12 font-montserrat">
      <motion.div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card-md px-6 sm:px-10 py-8 sm:py-10">

          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Dwellio" className="h-9 mb-5 cursor-pointer" onClick={() => navigate("/")} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-brown-dark">Create Account</h1>
            <p className="text-xs sm:text-sm text-brown-muted mt-1 text-center">
              Join Dwellio and find your dream home
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">

            {/* Name */}
            <div>
              <Label>Full Name</Label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input className="pl-10 h-11 sm:h-12 min-w-0" {...register("full_name")} />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input className="pl-10 h-11 sm:h-12 min-w-0" {...register("email")} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input className="pl-10 h-11 sm:h-12 min-w-0" {...register("phone")} />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input type="password" className="pl-10 h-11 sm:h-12 min-w-0" {...register("password")} />
              </div>
            </div>

            {/* File */}
            <label className="flex items-center gap-2.5 h-11 sm:h-12 px-3 bg-beige-input border rounded-btn overflow-hidden">
              <ImagePlus size={16} />
              <span className="truncate w-full text-sm">
                {file ? file.name : "Choose a photo..."}
              </span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button className="w-full h-11 sm:h-12">
              {loading ? "Creating..." : "Register"}
            </Button>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Register