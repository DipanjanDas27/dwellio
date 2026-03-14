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
      className="bg-white px-page py-25 text-center font-montserrat"
    >
      <motion.div
        className="text-4xl font-extrabold leading-[1.4] text-brown-dark mb-12"
        {...focusIn(0)}
      >
        <p>Do You Have Any Questions?</p>
        <p>Get Help From Us</p>
      </motion.div>

      <motion.div
        className="flex justify-center gap-20 mb-12"
        {...focusIn(0.15)}
      >
        {[
          { icon: <Phone size={22} />, label: "Chat live with our support team" },
          { icon: <HelpCircle size={22} />, label: "Browse our FAQ" },
        ].map((opt) => (
          <div
            key={opt.label}
            className="
              flex items-center gap-2.5
              text-lg font-bold text-brown-light
              hover:text-brown-dark cursor-pointer
              transition-colors duration-150
            "
          >
            {opt.icon}
            {opt.label}
          </div>
        ))}
      </motion.div>

      <motion.div className="flex justify-center" {...focusIn(0.28)}>
        <div
          className="
          flex items-center gap-3 px-5
          bg-beige-card rounded-l-btn
          shadow-card h-14.5 w-126.25
          text-brown-light
        "
        >
          <Mail size={22} className="shrink-0" />
          <input
            type="email"
            placeholder="Enter your email address..."
            className="
              bg-transparent border-none outline-none
              font-semibold text-lg text-brown-light
              placeholder:text-brown-light w-full
            "
          />
        </div>

        <motion.button
          className="
            h-14.5 px-10
            bg-brown-dark text-white
            font-semibold text-lg
            rounded-r-btn
            hover:bg-[#1a0f09] transition-colors duration-150
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