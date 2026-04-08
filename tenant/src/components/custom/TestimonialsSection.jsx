import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const REVIEWS = [
  {
    bg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/74.jpg",
    avatarFb: "https://randomuser.me/api/portraits/women/74.jpg",
    name: "Priya Sharma",
    city: "Mumbai",
    rating: "5.0",
    text: "Dwello truly cares about their clients. They listened to my needs and helped me find the perfect flat in Bandra. Their professionalism and attention to detail are unmatched.",
  },
  {
    bg: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    avatarFb: "https://randomuser.me/api/portraits/men/77.jpg",
    name: "Arjun Mehta",
    city: "Bengaluru",
    rating: "4.5",
    text: "Fantastic experience working with Dwello. Their expertise and personalized service exceeded my expectations. Found my dream home in Koramangala swiftly!",
  },
  {
    bg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    avatarFb: "https://randomuser.me/api/portraits/women/56.jpg",
    name: "Ananya Iyer",
    city: "Hyderabad",
    rating: "5.0",
    text: "Dwello made my dream of owning a home a reality! Guided me through every step. I couldn't be happier with my new villa in Jubilee Hills!",
  },
  {
    bg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=60",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
    avatarFb: "https://randomuser.me/api/portraits/men/43.jpg",
    name: "Rohan Verma",
    city: "Pune",
    rating: "4.8",
    text: "The team at Dwello was incredibly patient and thorough. They helped me compare over 12 properties before I found my perfect 3BHK in Kothrud. Highly recommend!",
  },
  {
    bg: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=60",
    avatar: "https://randomuser.me/api/portraits/women/39.jpg",
    avatarFb: "https://randomuser.me/api/portraits/women/39.jpg",
    name: "Sneha Kapoor",
    city: "Delhi",
    rating: "5.0",
    text: "What impressed me most was how seamlessly the entire process went. From shortlisting to paperwork, Dwello handled everything. My family loves our new home!",
  },
]

function ReviewCard({ r }) {
  return (
    <div className="bg-beige-card rounded-card shadow-card overflow-hidden pb-6 h-full flex flex-col">
      <img
        className="w-full h-36 sm:h-38 object-cover block bg-beige-card shrink-0"
        src={r.bg}
        alt=""
        onError={(e) => { e.currentTarget.style.minHeight = "144px" }}
      />

      <div className="flex items-end gap-3 px-4 sm:px-6 -mt-7 mb-3 sm:mb-3.5 shrink-0">
        <img
          className="w-13 h-13 sm:w-14.5 sm:h-14.5 rounded-full object-cover border-[3px] border-white shrink-0"
          src={r.avatar}
          alt={r.name}
          onError={(e) => { e.currentTarget.src = r.avatarFb }}
        />

        <div className="flex-1 pt-7">
          <div className="text-base sm:text-lg font-bold text-brown-dark leading-tight">{r.name}</div>
          <div className="text-xs sm:text-sm font-semibold text-brown-dark">{r.city}</div>
        </div>

        <div className="flex items-center gap-1 bg-white rounded px-2 py-1 mt-7 shrink-0">
          <Star size={12} fill="#f59e0b" stroke="none" />
          <span className="text-xs sm:text-sm font-semibold text-brown-dark">{r.rating}</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm font-semibold leading-normal text-brown-mid px-4 sm:px-6 flex-1">
        {r.text}
      </p>
    </div>
  )
}

export default function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section
      id="testimonials"
      ref={ref}
      className="
        bg-cream-bg
        px-4 sm:px-6 lg:px-page
        py-16 sm:py-20 lg:py-25
        font-montserrat
      "
    >
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brown-dark leading-[1.4] mb-10 sm:mb-12 lg:mb-14 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        What People Say About Dwellio
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.6 }}
        // px-10 on mobile gives enough room for arrows, px-12 on larger screens
        className="relative px-10 sm:px-12"
      >
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4 sm:-ml-6">
            {REVIEWS.map((r, i) => (
              <CarouselItem
                key={i}
                // 1 card mobile, 2 on sm, 3 on lg
                className="pl-4 sm:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, y: 48, scale: 0.94 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.55 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <ReviewCard r={r} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="
              -left-2 sm:-left-2 w-10 h-10 sm:w-12 sm:h-12
              bg-beige-card border-2 border-brown-dark
              text-brown-dark rounded-full
              hover:bg-brown-dark hover:text-white
              transition-colors duration-150
            "
          />
          <CarouselNext
            className="
              -right-2 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12
              bg-beige-card border-2 border-brown-dark
              text-brown-dark rounded-full
              hover:bg-brown-dark hover:text-white
              transition-colors duration-150
            "
          />
        </Carousel>
      </motion.div>
    </section>
  )
}