import { MapPin, IndianRupee, Home, Sparkles } from "lucide-react"
import { motion } from "motion/react"

const HERO_IMG =
  "https://www.figma.com/api/mcp/asset/c1924fc4-c377-4d13-a992-6673c7babd1d"
const FALLBACK =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"

const SUBTITLE =
  "Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision"

export default function HeroSection() {
  const words = SUBTITLE.split(" ")

  return (
    <>
      <section
        id="hero"
        className="
          relative min-h-screen bg-cream-bg overflow-hidden
          flex items-center
          pt-20 px-page
          font-montserrat
        "
      >
        <div className="relative z-10 flex-none w-125 pb-24">
          <motion.div
            className="
              inline-flex items-center gap-2 mb-7
              bg-beige-card text-brown-mid
              text-sm font-semibold
              px-4 py-2 rounded-full
            "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles size={14} />
            India's #1 Dream Home Finder
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="text-7xl font-extrabold leading-[1.06] text-brown-dark"
              initial={{ clipPath: "inset(0 0 100% 0)", y: 40 }}
              animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 0.68, 0, 1.1] }}
            >
              Find Your
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-6xl font-extrabold leading-[1.06] text-brown-dark"
              initial={{ clipPath: "inset(0 0 100% 0)", y: 40 }}
              animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 0.68, 0, 1.1] }}
            >
              Dream Home
            </motion.h1>
          </div>

          <p className="text-lg font-bold leading-[1.6] text-brown-mid max-w-103 mb-10">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.025, duration: 0.3 }}
              >
                {word}
              </motion.span>
            ))}
          </p>

          <motion.button
            className="
              h-14.5 px-10
              bg-brown-dark text-white
              font-semibold text-lg rounded-btn
              hover:bg-[#1a0f09]
              transition-colors duration-150
            "
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Sign up
          </motion.button>
        </div>

        <motion.div
          className="absolute -right-10 top-0 w-[62%] h-full overflow-hidden pointer-events-none"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 0.68, 0, 1.0] }}
        >
          <motion.img
            src={HERO_IMG}
            alt="Luxury home"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.src = FALLBACK
            }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

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
        "
        >
          <div
            className="
            flex-1 flex items-center gap-2.5
            bg-beige-input rounded-btn h-14.5 px-4
            text-brown-muted
            hover:shadow-md transition-shadow duration-150
          "
          >
            <MapPin size={20} className="shrink-0" />
            <span className="font-bold text-lg text-brown-muted">Location</span>
          </div>

          <div className="w-px h-10 bg-brown-dark/15 shrink-0" />

          <div
            className="
            flex-1 flex items-center gap-2.5
            bg-beige-input rounded-btn h-14.5 px-4
            text-brown-muted
            hover:shadow-md transition-shadow duration-150
          "
          >
            <Home size={20} className="shrink-0" />
            <span className="font-bold text-lg text-brown-muted">Type</span>
          </div>

          <div className="w-px h-10 bg-brown-dark/15 shrink-0" />

          <div
            className="
            flex-1 flex items-center gap-2.5
            bg-beige-input rounded-btn h-14.5 px-4
            text-brown-muted
            hover:shadow-md transition-shadow duration-150
          "
          >
            <IndianRupee size={20} className="shrink-0" />
            <span className="font-bold text-lg text-brown-muted">
              Price Range
            </span>
          </div>

          <motion.button
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
    </>
  )
}