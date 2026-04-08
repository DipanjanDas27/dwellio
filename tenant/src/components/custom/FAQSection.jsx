import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Phone, HelpCircle, Mail } from "lucide-react"

export default function FAQSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const focusIn = (delay = 0) => ({
    initial: { opacity: 0, scale: 1.08, filter: "blur(8px)" },
    animate: inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {},
    transition: { delay, duration: 0.65, ease: "easeOut" },
  })

  return (
    <section
      id="contact"
      ref={ref}
      className="
        bg-white
        px-4 sm:px-6 lg:px-page
        py-16 sm:py-20 lg:py-25
        text-center font-montserrat
      "
    >
      {/* Heading */}
      <motion.div
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.4] text-brown-dark mb-8 sm:mb-10 lg:mb-12"
        {...focusIn(0)}
      >
        <p>Do You Have Any Questions?</p>
        <p>Get Help From Us</p>
      </motion.div>

      {/* Options — stack on mobile, row on sm+ */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-10 lg:gap-20 mb-8 sm:mb-10 lg:mb-12"
        {...focusIn(0.15)}
      >
        {[
          { icon: <Phone size={20} />, label: "Chat live with our support team" },
          { icon: <HelpCircle size={20} />, label: "Browse our FAQ" },
        ].map((opt) => (
          <div
            key={opt.label}
            className="
              flex items-center gap-2.5
              text-base sm:text-lg font-bold text-brown-light
              hover:text-brown-dark cursor-pointer
              transition-colors duration-150
            "
          >
            {opt.icon}
            {opt.label}
          </div>
        ))}
      </motion.div>

      {/* Email input — stack on mobile, row on sm+ */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-0 px-0 sm:px-4 lg:px-0"
        {...focusIn(0.28)}
      >
        <div
          className="
            flex items-center gap-3 px-4 sm:px-5
            bg-beige-card
            sm:rounded-l-btn rounded-btn sm:rounded-r-none
            shadow-card h-13 sm:h-14
            text-brown-light
            w-full sm:w-96 lg:w-125
          "
        >
          <Mail size={20} className="shrink-0" />
          <input
            type="email"
            placeholder="Enter your email address..."
            className="
              bg-transparent border-none outline-none
              font-semibold text-sm sm:text-base text-brown-light
              placeholder:text-brown-light w-full
            "
          />
        </div>

        <motion.button
          className="
            h-13 sm:h-14 px-8 sm:px-10
            bg-brown-dark text-white
            font-semibold text-sm sm:text-base
            rounded-btn sm:rounded-l-none sm:rounded-r-btn
            hover:bg-[#1a0f09] transition-colors duration-150
            w-full sm:w-auto
          "
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Submit
        </motion.button>
      </motion.div>
    </section>
  )
}