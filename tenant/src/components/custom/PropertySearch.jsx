import { useState, useEffect, useCallback, useRef } from "react"
import { useDispatch } from "react-redux"
import { motion, AnimatePresence } from "motion/react"
import { MapPin, IndianRupee, Home } from "lucide-react"
import { getFilteredProperties } from "@/services/tenantPropertyThunks.js"

const PropertySearch = () => {
  const dispatch = useDispatch()

  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const searchRef = useRef(null)

  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSuggestions(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const searchProperties = useCallback(() => {
    if (!search && !minPrice && !maxPrice) return
    dispatch(getFilteredProperties({ search, minPrice, maxPrice }))
  }, [dispatch, search, minPrice, maxPrice])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProperties()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchProperties])

  useEffect(() => {
    if (!search) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await dispatch(getFilteredProperties({ search })).unwrap()
        const cities = [...new Set(res.map((p) => p.city).filter(Boolean))]
        setSuggestions(cities.slice(0, 5))
        setShowSuggestions(true)
      } catch {}
    }, 400)
    return () => clearTimeout(timer)
  }, [search, dispatch])

  const selectSuggestion = (value) => {
    setSearch(value)
    setShowSuggestions(false)
  }

  return (
    <motion.div
      className="flex justify-center px-page relative z-10 -mt-10"
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 0.68, 0, 1.1] }}
    >
      <div
        className="
        bg-beige-card rounded-card shadow-card-md
        flex items-center
        px-8 h-25 gap-3
        w-full max-w-267.5
        font-montserrat
      "
      >
        <div ref={searchRef} className="flex-1 relative">
          <div
            className="
            flex items-center gap-2.5
            bg-beige-input rounded-btn h-14.5 px-4
            text-brown-muted
            hover:shadow-md transition-shadow duration-150
          "
          >
            <MapPin size={20} className="shrink-0 text-brown-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Location"
              className="
                bg-transparent border-none outline-none
                font-bold text-base text-brown-muted
                placeholder:text-brown-muted w-full
              "
            />
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                className="
                  absolute top-[calc(100%+8px)] left-0 w-full z-50
                  bg-cream-bg border border-beige-card
                  rounded-card shadow-card-md overflow-hidden
                "
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(item)}
                    className="
                      px-4 py-3
                      font-semibold text-sm text-brown-dark
                      hover:bg-beige-card cursor-pointer
                      transition-colors duration-100
                    "
                  >
                    {item}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-10 bg-brown-dark/15 shrink-0" />

        <div
          className="
          flex-1 flex items-center gap-2.5
          bg-beige-input rounded-btn h-14.5 px-4
          text-brown-muted
        "
        >
          <IndianRupee size={20} className="shrink-0 text-brown-muted" />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
            className="
              bg-transparent border-none outline-none
              font-bold text-base text-brown-muted
              placeholder:text-brown-muted w-full
            "
          />
        </div>

        <div className="w-px h-10 bg-brown-dark/15 shrink-0" />

        <div
          className="
          flex-1 flex items-center gap-2.5
          bg-beige-input rounded-btn h-14.5 px-4
          text-brown-muted
        "
        >
          <Home size={20} className="shrink-0 text-brown-muted" />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="
              bg-transparent border-none outline-none
              font-bold text-base text-brown-muted
              placeholder:text-brown-muted w-full
            "
          />
        </div>

        <motion.button
          onClick={searchProperties}
          className="
            shrink-0 h-14.5 px-9
            bg-brown-dark text-white
            font-semibold text-lg rounded-btn
            whitespace-nowrap
            hover:bg-[#1a0f09] transition-colors duration-150
          "
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Find Home
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PropertySearch