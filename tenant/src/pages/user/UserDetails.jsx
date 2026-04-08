import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { User, Mail, Phone, ArrowLeft, UserCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getUserDetails } from "@/services/userThunks.js"

const DetailRow = ({ icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-3.5 border-b border-beige-card/60 last:border-0">
    <div className="flex items-center gap-2 text-sm font-semibold text-brown-muted shrink-0">
      {icon}
      {label}
    </div>
    <span className="text-sm font-bold text-brown-dark break-all">{value}</span>
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

  if (loading || (!userDetails && userId)) {
    return (
      <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
        <div className="max-w-lg mx-auto">

          <Skeleton className="h-4 w-24 rounded-btn bg-beige-card mb-6" />

          <div className="bg-white rounded-card shadow-card-md overflow-hidden">

            <div className="bg-beige-card px-6 py-5 flex items-center gap-4">
              <Skeleton className="size-14 rounded-full bg-white/60" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 bg-white/60 rounded-btn" />
                <Skeleton className="h-5 w-40 bg-white/60 rounded-btn" />
              </div>
            </div>

            <div className="px-6 py-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between py-3.5 border-b">
                  <Skeleton className="h-4 w-28 bg-beige-card rounded-btn" />
                  <Skeleton className="h-4 w-40 bg-beige-card rounded-btn" />
                </div>
              ))}
            </div>

          </div>
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
            className="text-sm font-bold text-brown-muted hover:text-brown-dark"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <motion.div className="max-w-lg mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-brown-muted mb-6"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <div className="bg-white rounded-card shadow-card-md overflow-hidden">

          <div className="bg-beige-card px-6 py-5 flex items-center gap-4">
            {userDetails.profile_image_url ? (
              <img
                src={userDetails.profile_image_url}
                className="size-14 rounded-full object-cover border-2 border-white shadow-card"
              />
            ) : (
              <div className="size-14 rounded-full bg-white flex items-center justify-center border-2">
                <User size={24} />
              </div>
            )}
            <div>
              <p className="text-xs text-brown-muted mb-1">User Profile</p>
              <p className="text-lg font-extrabold">{userDetails.full_name}</p>
            </div>
          </div>

          <div className="px-6 py-2">
            <DetailRow icon={<Mail size={14} />} label="Email" value={userDetails.email} />
            <DetailRow icon={<Phone size={14} />} label="Phone" value={userDetails.phone || "Not provided"} />
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default UserDetails