import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { MapPin } from "lucide-react"

const PropertyCard = ({ property }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      className="bg-beige-card rounded-card shadow-card overflow-hidden font-montserrat"
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 40px rgba(43,27,18,0.18)",
      }}
    >
      {/* Image */}
      <div className="overflow-hidden h-44 sm:h-52">
        <motion.img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-brown-dark mb-2">
          <MapPin size={16} className="shrink-0" />
          <span className="truncate">{property.city}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-brown-dark leading-snug mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Price */}
        <p className="text-lg sm:text-xl font-bold text-brown-mid mb-4">
          ₹{Number(property.rent_amount).toLocaleString("en-IN")}
          <span className="text-xs sm:text-sm ml-1">/mo</span>
        </p>

        {/* Button */}
        <motion.button
          onClick={() => navigate(`/properties/${property.id}`)}
          className="w-full h-10 sm:h-11 bg-brown-dark text-white text-sm sm:text-base rounded-btn"
        >
          View Details
        </motion.button>

      </div>
    </motion.div>
  )
}

export default memo(PropertyCard)