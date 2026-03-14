import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { MapPin, BedDouble, Maximize2 } from "lucide-react"

const PropertyCard = ({ property }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      className="bg-beige-card rounded-card shadow-card overflow-hidden cursor-default font-montserrat"
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.68, 0, 1.1] }}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 56px rgba(43,27,18,0.22)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="overflow-hidden h-55">
        <motion.img
          src={property.image_url}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        />
      </div>

      <div className="p-5 pb-6">

        
        <div className="flex items-center gap-1.5 text-[17px] font-bold text-brown-dark mb-2.5">
          <MapPin size={18} className="shrink-0 text-brown-dark" />
          {property.city}
        </div>

        <h3 className="text-[18px] font-bold text-brown-dark leading-snug mb-2.5">
          {property.title}
        </h3>

       
        <p className="text-[20px] font-bold text-brown-mid mb-5">
          ₹{Number(property.rent_amount).toLocaleString("en-IN")}
          <span className="text-[13px] font-semibold ml-1">/mo</span>
        </p>

      
        <motion.button
          onClick={() => navigate(`/properties/${property.id}`)}
          className="
            w-full h-10.5
            bg-brown-dark text-white
            font-semibold text-[15px] rounded-btn
            hover:bg-[#1a0f09] transition-colors duration-150
          "
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          View Details
        </motion.button>

      </div>
    </motion.div>
  )
}

export default memo(PropertyCard)