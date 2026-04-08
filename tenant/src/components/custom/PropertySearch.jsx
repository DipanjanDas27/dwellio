import { motion } from "motion/react"
import { MapPin, IndianRupee, Home } from "lucide-react"
import { memo } from "react"

const PropertySearch = ({
  search,
  minPrice,
  maxPrice,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSearch,
  onReset
}) => {

  const hasValue = search || minPrice || maxPrice

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div className="
        bg-beige-card rounded-card shadow-card-md
        flex flex-col lg:flex-row
        gap-3 lg:gap-3
        p-4 lg:px-8 lg:py-4
        w-full
      ">

        {/* Location */}
        <div className="flex-1 flex items-center gap-2.5 bg-beige-input rounded-btn h-11 sm:h-12 px-4">
          <MapPin size={18} className="shrink-0" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Location"
            className="bg-transparent outline-none w-full text-sm sm:text-base font-bold min-w-0"
          />
        </div>

        {/* Min Price */}
        <div className="flex-1 flex items-center gap-2.5 bg-beige-input rounded-btn h-11 sm:h-12 px-4">
          <IndianRupee size={18} className="shrink-0" />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Min Price"
            className="bg-transparent outline-none w-full text-sm sm:text-base font-bold min-w-0"
          />
        </div>

        {/* Max Price */}
        <div className="flex-1 flex items-center gap-2.5 bg-beige-input rounded-btn h-11 sm:h-12 px-4">
          <Home size={18} className="shrink-0" />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Max Price"
            className="bg-transparent outline-none w-full text-sm sm:text-base font-bold min-w-0"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full lg:w-auto">
          {hasValue && (
            <motion.button
              onClick={onReset}
              className="flex-1 lg:flex-none h-11 sm:h-12 px-4 bg-beige-input border rounded-btn text-sm font-semibold"
            >
              Clear
            </motion.button>
          )}

          <motion.button
            onClick={onSearch}
            className="flex-1 lg:flex-none h-11 sm:h-12 px-6 bg-brown-dark text-white text-sm sm:text-base rounded-btn"
          >
            Find Home
          </motion.button>
        </div>

      </div>
    </motion.div>
  )
}

export default memo(PropertySearch)