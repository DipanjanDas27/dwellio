import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import PropertyCard from "./PropertyCard"

const demoProperties = [
  {
    id: 1,
    title: "Luxury Sea-View Apartment",
    city: "Mumbai",
    rent_amount: 95000,
    image_url:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  },
  {
    id: 2,
    title: "Modern Studio Flat",
    city: "Bangalore",
    rent_amount: 42000,
    image_url:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
  },
  {
    id: 3,
    title: "Spacious Family House",
    city: "Delhi",
    rent_amount: 68000,
    image_url:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
  },
  {
    id: 4,
    title: "Premium 3BHK Villa",
    city: "Pune",
    rent_amount: 55000,
    image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: 5,
    title: "Garden-View Bungalow",
    city: "Hyderabad",
    rent_amount: 78000,
    image_url:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  },
  {
    id: 6,
    title: "Smart City Apartment",
    city: "Gurugram",
    rent_amount: 62000,
    image_url:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
  },
]

const FeaturedProperties = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section
      ref={ref}
      className="
        bg-white
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
        Our Popular Residences
      </motion.h2>

      <motion.div
        className="relative px-10 sm:px-12"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4 sm:-ml-6 lg:-ml-7">
            {demoProperties.map((p, i) => (
              <CarouselItem
                key={p.id}
                // 1 card mobile, 2 on md, 3 on lg
                className="pl-4 sm:pl-6 lg:pl-7 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 48, scale: 0.94 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.55 }}
                >
                  <PropertyCard property={p} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="
              -left-2 w-10 h-10 sm:w-12 sm:h-12
              bg-beige-card border-2 border-brown-dark
              text-brown-dark rounded-full
              hover:bg-brown-dark hover:text-white
              transition-colors duration-150
            "
          />
          <CarouselNext
            className="
              -right-2 w-10 h-10 sm:w-12 sm:h-12
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

export default FeaturedProperties