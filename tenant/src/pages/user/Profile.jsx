import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { User, Mail, Phone, Pencil, Lock, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getCurrentUser } from "@/services/userThunks"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-4 py-3.5 border-b border-beige-card/60 last:border-0">
    <div className="flex items-center gap-2 text-sm font-semibold text-brown-muted shrink-0">
      {icon}
      {label}
    </div>
    <span className="text-sm font-bold text-brown-dark text-right">{value}</span>
  </div>
)

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
     dispatch(getCurrentUser())
  }, [dispatch, user])

  if (loading) return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-card shadow-card-md overflow-hidden">
          <div className="bg-beige-card px-6 py-6 flex items-center gap-5">
            <Skeleton className="size-20 rounded-full bg-white/60" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded-btn bg-white/60" />
              <Skeleton className="h-6 w-36 rounded-btn bg-white/60" />
              <Skeleton className="h-3 w-44 rounded-btn bg-white/60" />
            </div>
          </div>
          <div className="px-6 py-2 space-y-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between py-3.5 border-b border-beige-card/60">
                <Skeleton className="h-4 w-20 rounded-btn bg-beige-card" />
                <Skeleton className="h-4 w-40 rounded-btn bg-beige-card" />
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 pt-4 space-y-3">
            <Skeleton className="h-12 w-full rounded-btn bg-beige-card" />
            <Skeleton className="h-12 w-full rounded-btn bg-beige-card" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center font-montserrat">
        <div className="flex flex-col items-center gap-3">
          <div className="size-14 rounded-card bg-beige-card flex items-center justify-center">
            <User size={28} className="text-brown-muted" />
          </div>
          <p className="text-base font-bold text-brown-dark">No user found</p>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-brown-muted hover:text-brown-dark transition-colors duration-150"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
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
          Back
        </button>

        <div className="bg-white rounded-card shadow-card-md overflow-hidden">

          <div className="bg-beige-card px-6 py-6 flex items-center gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
            >
              {user.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user.full_name}
                  className="size-20 rounded-full object-cover border-4 border-white shadow-card"
                />
              ) : (
                <div className="size-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-card">
                  <User size={32} className="text-brown-muted" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
            >
              <img
                src={logo}
                alt="Dwellio"
                className="h-5 w-auto mb-1.5 cursor-pointer"
                onClick={() => navigate("/")}
              />
              <h1 className="text-xl font-extrabold text-brown-dark leading-tight">{user.full_name}</h1>
              <p className="text-xs font-semibold text-brown-muted mt-0.5">{user.email}</p>
            </motion.div>
          </div>

          <motion.div
            className="px-6 py-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.45 }}
          >
            <DetailRow
              icon={<User size={14} />}
              label="Full Name"
              value={user.full_name}
            />
            <DetailRow
              icon={<Mail size={14} />}
              label="Email"
              value={user.email}
            />
            <DetailRow
              icon={<Phone size={14} />}
              label="Phone"
              value={user.phone || "Not provided"}
            />
          </motion.div>

          <motion.div
            className="px-6 pb-6 pt-4 flex flex-col gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.45 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => navigate("/profile/update")}
                className="w-full h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-sm rounded-btn transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <Pencil size={15} />
                Update Profile
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => navigate("/forgot-password")}
                className="w-full h-12 border-beige-card text-brown-dark font-semibold text-sm rounded-btn hover:bg-beige-input transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <Lock size={15} />
                Change Password
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

export default Profile