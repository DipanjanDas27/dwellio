import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { MapPin, Users, FileText, Handshake } from "lucide-react"

const CARDS = [
  {
    icon: <MapPin size={38} />,
    title: "Expert Guidance",
    text: "Benefit from our team's seasoned expertise for a smooth home buying experience",
  },
  {
    icon: <Users size={38} />,
    title: "Personalized Service",
    text: "Our services adapt to your unique needs, making your journey completely stress-free",
  },
  {
    icon: <FileText size={38} />,
    title: "Transparent Process",
    text: "Stay informed with our clear and honest approach to buying your dream home",
  },
  {
    icon: <Handshake size={38} />,
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
      className="bg-cream-bg px-page py-25 text-center font-montserrat"
    >
      <motion.h2
        className="text-4xl font-extrabold text-brown-dark leading-[1.4] mb-4"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Why Choose Us
      </motion.h2>

      <motion.p
        className="text-lg font-bold text-brown-mid leading-[1.6] max-w-157 mx-auto mb-16"
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.12, duration: 0.6 }}
      >
        Elevating Your Home Buying Experience with Expertise, Integrity, and
        Unmatched Personalized Service
      </motion.p>

      <div className="grid grid-cols-4 gap-6" style={{ perspective: "1000px" }}>
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            className="
              bg-beige-card rounded-card shadow-card
              p-[30px_24px_32px] text-left
              cursor-default
            "
            initial={{ opacity: 0, rotateY: -90, scale: 0.85 }}
            animate={inView ? { opacity: 1, rotateY: 0, scale: 1 } : {}}
            transition={{
              delay: 0.18 + i * 0.13,
              duration: 0.65,
              ease: [0.22, 0.68, 0, 1.1],
            }}
            whileHover={{
              y: -8,
              boxShadow: "0 16px 48px rgba(43,27,18,0.20)",
              transition: { duration: 0.2 },
            }}
          >
            <div
              className="
              w-20.5 h-20.5 bg-beige-input rounded-btn
              flex items-center justify-center
              text-brown-dark mb-6
            "
            >
              {card.icon}
            </div>

            <p className="text-lg font-bold text-brown-dark mb-2.5">
              {card.title}
            </p>

            <p className="text-base font-semibold leading-[1.3] text-brown-mid">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}