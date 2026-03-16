import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { MapPin, IndianRupee, ArrowLeft, Home, FileText, Clock, BedDouble, Sofa, Building2, Phone, Mail, User, CheckCircle2, XCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getProperty } from "@/services/tenantPropertyThunks.js"
import { Button } from "@/components/ui/button"

const FURNISHING_LABEL = {
  unfurnished: "Unfurnished",
  semi:        "Semi Furnished",
  fully:       "Fully Furnished",
}

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-card shadow-card p-4 flex items-center gap-3">
    <div className="size-10 rounded-btn bg-beige-card flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-brown-muted leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-brown-dark truncate">{value}</p>
    </div>
  </div>
)

const PropertyDetails = () => {
  const { propertyId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { property } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(getProperty(propertyId))
  }, [dispatch, propertyId])

  const handleCreateRental = useCallback(() => {
    navigate(`/rentals/create/${propertyId}`, {
      state: {
        security_deposit: property.security_deposit,
        notice_period: property.notice_period_days,
      }
    })
  }, [navigate, propertyId, property])

  if (!property) return (
    <div className="min-h-screen bg-cream-bg font-montserrat">
      <Skeleton className="w-full h-105 bg-beige-card" />
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        <Skeleton className="h-9 w-2/3 rounded-btn bg-beige-card" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32 rounded-btn bg-beige-card" />
          <Skeleton className="h-4 w-28 rounded-btn bg-beige-card" />
        </div>
        <Skeleton className="h-32 w-full rounded-card bg-beige-card" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 rounded-card bg-beige-card" />)}
        </div>
        <Skeleton className="h-24 w-full rounded-card bg-beige-card" />
        <Skeleton className="h-14 w-full rounded-btn bg-beige-card" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-bg font-montserrat">

      <motion.div
        className="relative w-full h-105 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src={property.image_url}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-brown-dark/70 via-transparent to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-brown-dark text-sm font-bold px-4 py-2 rounded-btn hover:bg-white transition-colors duration-150 shadow-card"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${property.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {property.is_available ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {property.is_available ? "Available" : "Not Available"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-beige-card/90 text-brown-dark">
                {property.bhk} BHK
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-beige-card/90 text-brown-dark">
                {FURNISHING_LABEL[property.furnishing] ?? property.furnishing}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight drop-shadow">
              {property.title}
            </h1>
            <p className="text-sm font-semibold text-white/80 mt-1 flex items-center gap-1.5">
              <MapPin size={14} />
              {property.address}, {property.city}, {property.state} {property.pincode && `- ${property.pincode}`}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-1.5 bg-white rounded-card shadow-card px-4 py-2.5">
            <IndianRupee size={16} className="text-brown-muted" />
            <span className="text-lg font-extrabold text-brown-dark">₹{Number(property.rent_amount).toLocaleString("en-IN")}</span>
            <span className="text-xs font-semibold text-brown-muted">/mo</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white rounded-card shadow-card px-4 py-2.5">
            <BedDouble size={16} className="text-brown-muted" />
            <span className="text-sm font-bold text-brown-dark">{property.bhk} BHK</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white rounded-card shadow-card px-4 py-2.5">
            <Sofa size={16} className="text-brown-muted" />
            <span className="text-sm font-bold text-brown-dark">{FURNISHING_LABEL[property.furnishing] ?? property.furnishing}</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-card shadow-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-brown-muted" />
            <p className="text-sm font-bold text-brown-dark">Description</p>
          </div>
          <p className="text-sm font-semibold text-brown-mid leading-relaxed">{property.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.5 }}
        >
          <p className="text-xs font-bold text-brown-muted uppercase tracking-widest mb-3">Property Details</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard icon={<IndianRupee size={18} className="text-brown-dark" />} label="Monthly Rent"       value={`₹${Number(property.rent_amount).toLocaleString("en-IN")}`} />
            <InfoCard icon={<IndianRupee size={18} className="text-brown-dark" />} label="Security Deposit"   value={`₹${Number(property.security_deposit).toLocaleString("en-IN")}`} />
            <InfoCard icon={<Clock       size={18} className="text-brown-dark" />} label="Notice Period"      value={`${property.notice_period_days} days`} />
            <InfoCard icon={<BedDouble   size={18} className="text-brown-dark" />} label="Total Rooms"        value={property.total_rooms} />
            <InfoCard icon={<Building2   size={18} className="text-brown-dark" />} label="Available Rooms"    value={property.available_rooms} />
            <InfoCard icon={<Sofa        size={18} className="text-brown-dark" />} label="Furnishing"         value={FURNISHING_LABEL[property.furnishing] ?? property.furnishing} />
            <InfoCard icon={<MapPin      size={18} className="text-brown-dark" />} label="City"               value={property.city} />
            <InfoCard icon={<MapPin      size={18} className="text-brown-dark" />} label="State"              value={property.state} />
          </div>
        </motion.div>

        {(property.owner_name || property.owner_email) && (
          <motion.div
            className="bg-white rounded-card shadow-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
          >
            <p className="text-xs font-bold text-brown-muted uppercase tracking-widest mb-4">Listed By</p>
            <div className="flex items-center gap-4">
              {property.owner_avatar ? (
                <img
                  src={property.owner_avatar}
                  alt={property.owner_name}
                  className="size-14 rounded-full object-cover border-2 border-beige-card shrink-0"
                />
              ) : (
                <div className="size-14 rounded-full bg-beige-card flex items-center justify-center shrink-0">
                  <User size={24} className="text-brown-muted" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-base font-extrabold text-brown-dark leading-none mb-2">{property.owner_name}</p>
                <div className="flex flex-col gap-1.5">
                  {property.owner_email && (
                    <a href={`mailto:${property.owner_email}`} className="flex items-center gap-2 text-sm font-semibold text-brown-mid hover:text-brown-dark transition-colors duration-150">
                      <Mail size={14} className="text-brown-muted shrink-0" />
                      {property.owner_email}
                    </a>
                  )}
                  {property.owner_phone && (
                    <a href={`tel:${property.owner_phone}`} className="flex items-center gap-2 text-sm font-semibold text-brown-mid hover:text-brown-dark transition-colors duration-150">
                      <Phone size={14} className="text-brown-muted shrink-0" />
                      {property.owner_phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleCreateRental}
              disabled={!property.is_available}
              className="w-full h-14 bg-brown-dark hover:bg-[#1a0f09] text-white font-bold text-base rounded-btn transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Home size={18} />
              {property.is_available ? "Rent This Property" : "Not Available"}
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}

export default PropertyDetails