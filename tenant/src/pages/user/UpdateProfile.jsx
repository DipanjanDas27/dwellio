import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { User, Mail, Phone, ImagePlus, Save, Trash2, ArrowLeft } from "lucide-react"

import { getCurrentUser, updateProfile, updateProfileImage, deleteAccount } from "@/services/userThunks.js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ConfirmModal from "@/components/custom/ConfirmModal.jsx"

const FormField = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-bold text-brown-dark flex items-center gap-1.5">
      {icon}
      {label}
    </Label>
    {children}
    {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
  </div>
)

const UpdateProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading } = useSelector((state) => state.auth)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [modal, setModal] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: "onChange" })

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
        setImageLoading(true)
        const formData = new FormData()
        formData.append("profileImage", file)
        await dispatch(updateProfileImage(formData)).unwrap()
        setImageLoading(false)
      }
      navigate("/profile")
    } catch { }
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await dispatch(deleteAccount(user.id)).unwrap()
      navigate("/login")
    } catch { }
    setDeleting(false)
    setModal(false)
  }

  if (!user || loading) return (
    <div className="min-h-screen bg-cream-bg px-4 sm:px-6 py-8 sm:py-10 font-montserrat">
      <div className="max-w-lg mx-auto">
        <Skeleton className="h-4 w-32 rounded-btn bg-beige-card mb-6" />
        <div className="bg-white rounded-card shadow-card-md overflow-hidden">
          <div className="bg-beige-card px-6 py-5 flex items-center gap-3">
            <Skeleton className="size-11 rounded-btn bg-white/60" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded-btn bg-white/60" />
              <Skeleton className="h-5 w-32 rounded-btn bg-white/60" />
            </div>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="size-24 rounded-full bg-beige-card" />
              <Skeleton className="h-3 w-32 rounded-btn bg-beige-card" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-20 rounded-btn bg-beige-card" />
                  <Skeleton className="h-12 w-full rounded-btn bg-beige-card" />
                </div>
              ))}
              <Skeleton className="h-12 w-full rounded-btn bg-beige-card" />
            </div>
            <div className="pt-2 border-t border-beige-card space-y-3">
              <Skeleton className="h-3 w-24 rounded-btn bg-beige-card" />
              <Skeleton className="h-12 w-full rounded-btn bg-beige-card" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">

      <ConfirmModal
        isOpen={modal}
        onClose={() => setModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Account"
        description="This will permanently delete your account including all rentals, payments and profile data. This action cannot be undone."
        confirmLabel="Delete Account"
      />

      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-brown-muted hover:text-brown-dark transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </button>

        <div className="bg-white rounded-card shadow-card-md overflow-hidden">

          <div className="bg-beige-card px-6 py-5 flex items-center gap-3">
            <div className="size-11 rounded-btn bg-white flex items-center justify-center">
              <User size={20} className="text-brown-dark" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brown-muted leading-none mb-1">Account</p>
              <p className="text-base font-extrabold text-brown-dark leading-none">Update Profile</p>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">

            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {preview ? (
                  <img src={preview} alt="Preview" className="size-24 rounded-full object-cover border-4 border-beige-card shadow-card" />
                ) : (
                  <div className="size-24 rounded-full bg-beige-card flex items-center justify-center border-4 border-white shadow-card">
                    <User size={32} className="text-brown-muted" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 size-8 rounded-full bg-brown-dark flex items-center justify-center cursor-pointer hover:bg-[#1a0f09] transition-colors shadow-card"
                >
                  <ImagePlus size={14} className="text-white" />
                </label>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <p className="text-xs font-semibold text-brown-muted">
                {file ? file.name : "Click icon to change photo"}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <FormField label="Full Name" icon={<User size={14} className="text-brown-muted" />} error={errors.full_name?.message}>
                <Input
                  className="h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold focus-visible:ring-brown-dark/30"
                  {...register("full_name", { required: "Name is required" })}
                />
              </FormField>

              <FormField label="Email" icon={<Mail size={14} className="text-brown-muted" />} error={errors.email?.message}>
                <Input
                  type="email"
                  className="h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold focus-visible:ring-brown-dark/30"
                  {...register("email", { required: "Email is required" })}
                />
              </FormField>

              <FormField label="Phone" icon={<Phone size={14} className="text-brown-muted" />} error={errors.phone?.message}>
                <Input
                  className="h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold focus-visible:ring-brown-dark/30"
                  {...register("phone", { required: "Phone is required" })}
                />
              </FormField>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={!isValid || loading || imageLoading}
                  className="w-full h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-sm rounded-btn flex items-center justify-center gap-2"
                >
                  {loading || imageLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={15} />
                      Save Changes
                    </span>
                  )}
                </Button>
              </motion.div>

            </form>

            <div className="pt-2 border-t border-beige-card">
              <p className="text-xs font-bold text-brown-muted uppercase tracking-widest mb-3">Danger Zone</p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="button"
                  onClick={() => setModal(true)}
                  className="w-full h-12 border border-red-200 bg-white text-red-600 hover:bg-red-50 font-semibold text-sm rounded-btn flex items-center justify-center gap-2"
                >
                  <Trash2 size={15} />
                  Delete Account
                </Button>
              </motion.div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UpdateProfile