import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { User, Mail, Phone, ImagePlus, ArrowLeft, Trash2, Save } from "lucide-react"

import { getCurrentUser, updateProfile, updateProfileImage, deleteAccount } from "@/services/userThunks.js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const UpdateProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.user)

  const [file,    setFile]    = useState(null)
  const [preview, setPreview] = useState(null)

  const { register, handleSubmit, reset, formState: { isValid, errors } } = useForm({ mode: "onChange" })

  useEffect(() => {
    if (!user) dispatch(getCurrentUser())
  }, [dispatch, user])

  useEffect(() => {
    if (user) {
      reset({ full_name: user.full_name, email: user.email, phone: user.phone })
      setPreview(user.profile_image_url)
    }
  }, [user, reset])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(selected)
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap()
      if (file) {
        const formData = new FormData()
        formData.append("profileImage", file)
        await dispatch(updateProfileImage(formData)).unwrap()
      }
      navigate("/profile")
    } catch {}
  }

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount(user.id)).unwrap()
      navigate("/login")
    } catch {}
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center font-montserrat">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 rounded-full border-2 border-beige-card border-t-brown-dark animate-spin" />
          <p className="text-sm font-semibold text-brown-muted">Loading profile...</p>
        </div>
      </div>
    )
  }

  const fieldAnim = (delay) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration: 0.45 },
  })

  return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <div className="bg-white rounded-card shadow-card-md overflow-hidden">

          <div className="bg-beige-card px-8 py-6 flex items-center gap-4">
            <div className="size-12 rounded-btn bg-white flex items-center justify-center shadow-card shrink-0">
              <User size={20} className="text-brown-dark" />
            </div>
            <div>
              <img
                src={logo}
                alt="Dwellio"
                className="h-5 w-auto mb-1 cursor-pointer"
                onClick={() => navigate("/")}
              />
              <h1 className="text-xl font-extrabold text-brown-dark leading-none">Update Profile</h1>
              <p className="text-xs font-semibold text-brown-muted mt-1">Edit your personal information</p>
            </div>
          </div>

          <div className="px-8 py-7 space-y-6">

            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              <div className="relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="size-24 rounded-full object-cover border-4 border-beige-card shadow-card"
                  />
                ) : (
                  <div className="size-24 rounded-full bg-beige-card flex items-center justify-center border-4 border-white shadow-card">
                    <User size={32} className="text-brown-muted" />
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute -bottom-1 -right-1 size-8 rounded-full bg-brown-dark flex items-center justify-center cursor-pointer shadow-card hover:bg-[#1a0f09] transition-colors duration-150"
                >
                  <ImagePlus size={14} className="text-white" />
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs font-semibold text-brown-muted">
                {file ? file.name : "Click the icon to change photo"}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <motion.div className="space-y-1.5" {...fieldAnim(0.22)}>
                <Label className="text-sm font-bold text-brown-dark">Full Name</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                  <Input
                    placeholder="Your full name"
                    className="pl-10 h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                    {...register("full_name", { required: "Name is required" })}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-xs font-semibold text-red-500">{errors.full_name.message}</p>
                )}
              </motion.div>

              <motion.div className="space-y-1.5" {...fieldAnim(0.29)}>
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
                {errors.email && (
                  <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div className="space-y-1.5" {...fieldAnim(0.36)}>
                <Label className="text-sm font-bold text-brown-dark">Phone</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-muted" />
                  <Input
                    placeholder="+91 98765 43210"
                    className="pl-10 h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold placeholder:text-brown-muted/60 focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                    {...register("phone", { required: "Phone is required" })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-semibold text-red-500">{errors.phone.message}</p>
                )}
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
                className="pt-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.45 }}
              >
                <Button
                  type="submit"
                  disabled={!isValid || loading}
                  className="w-full h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-base rounded-btn transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={16} />
                      Save Changes
                    </span>
                  )}
                </Button>
              </motion.div>

            </form>

            <motion.div
              className="space-y-3 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52, duration: 0.4 }}
            >
              <div className="h-px bg-beige-card" />

              <Button
                variant="outline"
                className="w-full h-12 border-beige-card text-brown-dark font-semibold text-base rounded-btn hover:bg-beige-input transition-colors duration-150 flex items-center justify-center gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={15} />
                Go Back
              </Button>

              <Button
                variant="destructive"
                className="w-full h-12 font-semibold text-base rounded-btn flex items-center justify-center gap-2"
                onClick={handleDeleteAccount}
              >
                <Trash2 size={15} />
                Delete Account
              </Button>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UpdateProfile