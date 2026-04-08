import { Sparkles } from "lucide-react"
import { motion } from "motion/react"

const HERO_IMG = "/hero_image.png"
const FALLBACK =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"

const SUBTITLE =
  "Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision"

export default function HeroSection() {
  const words = SUBTITLE.split(" ")

  return (
    <section
      id="hero"
      className="
        relative bg-cream-bg overflow-hidden
        flex flex-col lg:flex-row items-center
        pt-8 sm:pt-10 pb-10 sm:pb-14 lg:pb-0
        min-h-0 lg:min-h-[calc(100vh-80px)]
        px-4 sm:px-6 lg:px-page
        font-montserrat
      "
    >
      {/* Text content */}
      <div className="relative z-10 w-full lg:flex-none lg:w-125 text-center lg:text-left lg:pb-24">
        <motion.div
          className="
            inline-flex items-center gap-2 mb-5 lg:mb-7
            bg-beige-card text-brown-mid
            text-xs sm:text-sm font-semibold
            px-3 sm:px-4 py-2 rounded-full
          "
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Sparkles size={13} />
          India's #1 Dream Home Finder
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.06] text-brown-dark"
            initial={{ clipPath: "inset(0 0 100% 0)", y: 40 }}
            animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 0.68, 0, 1.1] }}
          >
            Find Your
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-4 lg:mb-6">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.06] text-brown-dark"
            initial={{ clipPath: "inset(0 0 100% 0)", y: 40 }}
            animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 0.68, 0, 1.1] }}
          >
            Dream Home
          </motion.h1>
        </div>

        <p className="text-sm sm:text-base lg:text-lg font-bold leading-[1.6] text-brown-mid max-w-xs sm:max-w-md lg:max-w-103 mx-auto lg:mx-0 mb-6 lg:mb-10">
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

      {/* Hero image */}
      <motion.div
        className="
          relative w-full
          lg:absolute lg:-right-10 lg:top-0
          lg:w-[62%] lg:h-full
          pointer-events-none
          lg:rounded-none
          mt-2 lg:mt-0
        "
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 0.68, 0, 1.0] }}
      >
        <motion.img
          src={HERO_IMG}
          alt="Luxury home"
          style={{ mixBlendMode: "multiply" }}
          className="w-full h-auto lg:w-full lg:h-full lg:object-cover lg:object-top"
          onError={(e) => { e.currentTarget.src = FALLBACK }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}