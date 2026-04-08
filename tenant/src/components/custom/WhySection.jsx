import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { MapPin, Users, FileText, Handshake } from "lucide-react"

const CARDS = [
  {
    icon: <MapPin size={32} />,
    title: "Expert Guidance",
    text: "Benefit from our team's seasoned expertise for a smooth home buying experience",
  },
  {
    icon: <Users size={32} />,
    title: "Personalized Service",
    text: "Our services adapt to your unique needs, making your journey completely stress-free",
  },
  {
    icon: <FileText size={32} />,
    title: "Transparent Process",
    text: "Stay informed with our clear and honest approach to buying your dream home",
  },
  {
    icon: <Handshake size={32} />,
    title: "Exceptional Support",
    text: "Peace of mind with our responsive and attentive customer service, always",
  },
]

export default function WhySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section
      id="why"
      ref={ref}
      className="
        bg-cream-bg
        px-4 sm:px-6 lg:px-page
        py-16 sm:py-20 lg:py-25
        text-center font-montserrat
      "
    >
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brown-dark leading-[1.4] mb-3 sm:mb-4"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Why Choose Us
      </motion.h2>

      <motion.p
        className="text-base sm:text-lg font-bold text-brown-mid leading-[1.6] max-w-2xl mx-auto mb-10 sm:mb-14 lg:mb-16"
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.12, duration: 0.6 }}
      >
        Elevating Your Home Buying Experience with Expertise, Integrity, and
        Unmatched Personalized Service
      </motion.p>

      {/* 1 col mobile → 2 col sm → 4 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            className="
              bg-beige-card rounded-card shadow-card
              p-6 sm:p-7 text-left
              cursor-default
            "
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              delay: 0.18 + i * 0.1,
              duration: 0.55,
              ease: [0.22, 0.68, 0, 1.1],
            }}
            whileHover={{
              y: -6,
              boxShadow: "0 16px 48px rgba(43,27,18,0.18)",
              transition: { duration: 0.2 },
            }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-beige-input rounded-btn flex items-center justify-center text-brown-dark mb-5 sm:mb-6">
              {card.icon}
            </div>

            <p className="text-base sm:text-lg font-bold text-brown-dark mb-2">
              {card.title}
            </p>

            <p className="text-sm sm:text-base font-semibold leading-[1.4] text-brown-mid">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}