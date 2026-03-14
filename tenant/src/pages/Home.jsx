import HeroSection         from "../components/custom/HeroSection"
import AboutSection        from "../components/custom/AboutSection"
import WhySection          from "../components/custom/WhySection"
import TestimonialsSection from "../components/custom/TestimonialsSection"
import FAQSection          from "../components/custom/FAQSection"
import FeaturedProperties from "@/components/custom/FeaturedProperties"

export default function Home() {
  return (
    <>

      <main>
        <HeroSection />
        <AboutSection />
        <WhySection />
        <FeaturedProperties />
        <TestimonialsSection />
        <FAQSection />
      </main>
    </>
  )
}