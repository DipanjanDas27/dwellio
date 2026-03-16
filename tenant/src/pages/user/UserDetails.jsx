import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { User, Mail, Phone, ArrowLeft, UserCircle2 } from "lucide-react"

import { getUserDetails } from "@/services/userThunks.js"

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-4 py-3.5 border-b border-beige-card/60 last:border-0">
    <div className="flex items-center gap-2 text-sm font-semibold text-brown-muted shrink-0">
      {icon}
      {label}
    </div>
    <span className="text-sm font-bold text-brown-dark text-right">{value}</span>
  </div>
)

const UserDetails = () => {
  const { userId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userDetails, loading } = useSelector((state) => state.user)

  useEffect(() => {
    if (userId) dispatch(getUserDetails(userId))
  }, [dispatch, userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center font-montserrat">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 rounded-full border-2 border-beige-card border-t-brown-dark animate-spin" />
          <p className="text-sm font-semibold text-brown-muted">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center font-montserrat">
        <div className="flex flex-col items-center gap-3">
          <div className="size-14 rounded-card bg-beige-card flex items-center justify-center">
            <UserCircle2 size={28} className="text-brown-muted" />
          </div>
          <p className="text-base font-bold text-brown-dark">User not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-brown-muted hover:text-brown-dark transition-colors duration-150"
          >
            Go back
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
          Go Back
        </button>

        <div className="bg-white rounded-card shadow-card-md overflow-hidden">

          <div className="bg-beige-card px-6 py-5 flex items-center gap-4">
            {userDetails.profile_image_url ? (
              <img
                src={userDetails.profile_image_url}
                alt={userDetails.full_name}
                className="size-14 rounded-full object-cover border-2 border-white shadow-card shrink-0"
              />
            ) : (
              <div className="size-14 rounded-full bg-white flex items-center justify-center border-2 border-beige-card shadow-card shrink-0">
                <User size={24} className="text-brown-muted" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-brown-muted leading-none mb-1">User Profile</p>
              <p className="text-lg font-extrabold text-brown-dark leading-tight">{userDetails.full_name}</p>
            </div>
          </div>

          <div className="px-6 py-2">
            <DetailRow
              icon={<Mail size={14} />}
              label="Email"
              value={userDetails.email}
            />
            <DetailRow
              icon={<Phone size={14} />}
              label="Phone"
              value={userDetails.phone || "Not provided"}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UserDetails