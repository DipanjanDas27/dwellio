import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "motion/react"

const ABOUT_IMG = "/Mask group.png"
const FALLBACK =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80"

function useCounter(target, duration = 1.8, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const pct = Math.min((ts - startTime) / (duration * 1000), 1)
      const ease = 1 - Math.pow(1 - pct, 3)
      setValue(Math.round(ease * target))
      if (pct < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return value
}

const STATS = [
  { end: 8000, suffix: "+", label: "Houses Available" },
  { end: 6000, suffix: "+", label: "Houses Sold" },
  { end: 2000, suffix: "+", label: "Trusted Agents" },
]

function StatItem({ stat, started }) {
  const val = useCounter(stat.end, 1.8, started)
  const display =
    val >= 1000
      ? `${(val / 1000).toFixed(0)}K${stat.suffix}`
      : `${val}${stat.suffix}`

  return (
    <div>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-light leading-none mb-1.5 sm:mb-2">
        {display}
      </div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-brown-light">
        {stat.label}
      </div>
    </div>
  )
}

export default function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="about"
      ref={ref}
      className="
        bg-white
        px-4 sm:px-6 lg:px-page
        py-16 sm:py-20 lg:py-30
        flex flex-col lg:flex-row
        items-center
        gap-10 sm:gap-14 lg:gap-20
        font-montserrat
      "
    >
      {/* Image */}
      <motion.div
        className="
          w-full max-w-sm sm:max-w-md lg:flex-none lg:w-140
          h-64 sm:h-80 lg:h-125
          rounded-card overflow-hidden shadow-card-md relative
          shrink-0
        "
        initial={{ opacity: 0, x: -70, rotate: -2 }}
        animate={inView ? { opacity: 1, x: 0, rotate: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <img
          src={ABOUT_IMG}
          alt="Luxury home"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = FALLBACK }}
        />

        <motion.div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-brown-dark text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-card shadow-card"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 0.68, 0, 1.2] }}
        >
          <div className="text-2xl sm:text-3xl font-extrabold leading-none">15+</div>
          <div className="text-xs font-semibold opacity-85 mt-1">
            Years in Real Estate
          </div>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, x: 70 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.4] text-brown-dark mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          We Help You To Find Your Dream Home
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg font-bold leading-[1.6] text-brown-mid mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          From cozy apartments to luxurious villas, our dedicated team guides
          you through every step of the journey, ensuring your dream home
          becomes a reality
        </motion.p>

        {/* Stats — 3 cols on all sizes, just scale text */}
        <div className="flex justify-center lg:justify-start gap-8 sm:gap-12 lg:gap-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 + i * 0.12, duration: 0.5 }}
            >
              <StatItem stat={s} started={inView} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}