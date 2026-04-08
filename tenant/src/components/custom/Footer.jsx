import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Instagram, Facebook, Twitter } from "lucide-react"

const COLS = [
  { title: "About",   links: ["Our Story", "Careers", "Our Team", "Resources"] },
  { title: "Support", links: ["FAQ", "Contact Us", "Help Center", "Terms of Service"] },
  { title: "Find Us", links: ["Events", "Locations", "Newsletter"] },
]
const SOCIALS = [
  { icon: <Instagram size={22} />, label: "Instagram" },
  { icon: <Facebook  size={22} />, label: "Facebook"  },
  { icon: <Twitter   size={22} />, label: "Twitter (x)" },
]

export default function Footer() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <footer className="bg-beige-card px-4 sm:px-6 lg:px-page pt-12 sm:pt-16 lg:pt-18 pb-8 sm:pb-10 lg:pb-12 font-montserrat">

      {/*
        Mobile:  2-col grid (brand full-width top, then link cols 2-up, socials last)
        sm:      2-col
        lg:      5-col original layout
      */}
      <div
        ref={ref}
        className="
          grid gap-8 sm:gap-10 mb-10 sm:mb-12
          grid-cols-2 sm:grid-cols-2 lg:grid-cols-[220px_1fr_1fr_1fr_1fr]
        "
      >
        {/* Brand — full width on mobile */}
        <motion.div
          className="col-span-2 lg:col-span-1"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <line x1="1"  y1="15" x2="14" y2="4"  stroke="#2b1b12" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="14" y1="4"  x2="27" y2="15" stroke="#2b1b12" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="1"  y1="8"  x2="10" y2="8"  stroke="#2b1b12" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M4 15L14 6.5L24 15V26C24 26.552 23.552 27 23 27H17.5V20H10.5V27H5C4.448 27 4 26.552 4 26V15Z" fill="#2b1b12"/>
              <rect x="11" y="20.5" width="6" height="6.5" rx="1" fill="#fef7f2"/>
            </svg>
            <span className="text-xl sm:text-[22px] font-extrabold text-brown-dark tracking-tight">Dwellio</span>
          </div>
          <p className="text-sm sm:text-base font-bold leading-normal text-brown-mid max-w-xs">
            Bringing you closer to your dream home, one click at a time.
          </p>
        </motion.div>

        {/* Link columns — each takes 1 col on mobile grid */}
        {COLS.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
          >
            <p className="text-base sm:text-lg font-bold text-brown-dark mb-3 sm:mb-5">{col.title}</p>
            <ul className="flex flex-col gap-2.5 sm:gap-3.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm sm:text-base font-bold text-brown-mid hover:text-brown-dark transition-colors duration-150"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-base sm:text-lg font-bold text-brown-dark mb-3 sm:mb-5">Our Social</p>
          <ul className="flex flex-col gap-2.5 sm:gap-3.5">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold text-brown-mid hover:text-brown-dark transition-colors duration-150"
                >
                  {s.icon}
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="border-t border-brown-dark/15 pt-5 text-center text-xs sm:text-sm font-semibold text-brown-muted">
        © {new Date().getFullYear()} Dwellio. All rights reserved.
      </div>
    </footer>
  )
}