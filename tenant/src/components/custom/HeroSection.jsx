import { MapPin, IndianRupee, Home, Sparkles } from "lucide-react"
import { motion } from "motion/react"


const HERO_IMG =
  "/hero_image.png"
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

      
    </>
  )
}