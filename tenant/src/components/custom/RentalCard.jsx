import { memo } from "react"
import { motion } from "motion/react"
import { Home, IndianRupee, CheckCircle2, Clock, XCircle, ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const STATUS_CONFIG = {
  active: { icon: <CheckCircle2 size={13} />, classes: "bg-green-50 text-green-700 border border-green-200" },
  pending: { icon: <Clock size={13} />, classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  cancelled: { icon: <XCircle size={13} />, classes: "bg-red-50 text-red-700 border border-red-200" },
  terminated: { icon: <XCircle size={13} />, classes: "bg-red-50 text-red-700 border border-red-200" },
}

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? {
    icon: <Clock size={13} />,
    classes: "bg-beige-card text-brown-muted border border-beige-card",
  }

const RentalCard = ({ rental, onView }) => {
  const { icon, classes } = getStatus(rental.status)

  return (
    <motion.div
      className="bg-white rounded-card border border-beige-card shadow-card font-montserrat overflow-hidden"
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(43,27,18,0.14)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-4 border-b border-beige-card/60 flex-wrap">
        
        <div className="size-10 rounded-btn bg-beige-card flex items-center justify-center shrink-0">
          <Home size={18} className="text-brown-dark" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-brown-muted mb-1">Rental</p>
          <p className="text-sm font-bold text-brown-dark truncate">
            #{(rental.id ?? "").slice(0, 8)}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] sm:text-xs font-bold capitalize shrink-0 ${classes}`}
        >
          {icon}
          {rental.status}
        </div>

      </div>

      {/* Body */}
      <div className="px-4 sm:px-5 py-4 flex items-center justify-between gap-3">

        <div className="space-y-2.5 flex-1 min-w-0">

          {/* Property */}
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-brown-muted mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brown-muted mb-1">Property</p>
              <p className="text-sm font-bold text-brown-dark leading-snug truncate">
                {rental.property_title}
              </p>
            </div>
          </div>

          {/* Rent */}
          <div className="flex items-center gap-1.5">
            <IndianRupee size={14} className="text-brown-muted shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brown-muted mb-1">Monthly Rent</p>
              <p className="text-base sm:text-lg font-extrabold text-brown-dark leading-none truncate">
                ₹{Number(rental.monthly_rent).toLocaleString("en-IN")}
                <span className="text-xs font-semibold text-brown-muted ml-1">/mo</span>
              </p>
            </div>
          </div>

        </div>

        {/* Button */}
        <Button
          variant="outline"
          onClick={() => onView(rental.id)}
          className="shrink-0 h-9 sm:h-10 px-3 sm:px-4 rounded-btn text-sm flex items-center gap-1.5"
        >
          View
          <ArrowRight size={14} />
        </Button>

      </div>
    </motion.div>
  )
}

export default memo(RentalCard)