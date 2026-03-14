import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { User, ChevronDown, Mail, Phone } from "lucide-react"
import LogoutButton from "./LogoutButton"
import logo from "/logo.svg"

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [open, setOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const dropRef = useRef(null)
  const contactRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
      if (contactRef.current && !contactRef.current.contains(e.target))
        setContactOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 right-0 z-50
        h-20 bg-cream-bg/90 backdrop-blur-md
        border-b border-beige-card/40
        flex items-center justify-between
        px-page font-montserrat
        transition-shadow duration-300
        ${scrolled ? "shadow-card" : ""}
      `}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
    >
      <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
        <img src={logo} alt="Dwellio" className="h-8 w-auto" />
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 rounded-btn font-bold text-base text-brown-dark bg-transparent border-none hover:bg-beige-card/50 transition-colors duration-150"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Home
        </motion.button>

        <motion.button
          onClick={() => navigate("/properties")}
          className="px-3 py-1.5 rounded-btn font-bold text-base text-brown-dark bg-transparent border-none hover:bg-beige-card/50 transition-colors duration-150"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          Properties
        </motion.button>

        <motion.div
          ref={contactRef}
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          <button
            onClick={() => setContactOpen((v) => !v)}
            className="
              flex items-center gap-1.5
              px-3 py-1.5 rounded-btn
              font-bold text-base text-brown-dark
              bg-transparent border-none
              hover:bg-beige-card/50
              transition-colors duration-150
            "
          >
            Contact
            <motion.span
              animate={{ rotate: contactOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <AnimatePresence>
            {contactOpen && (
              <motion.div
                className="
                  absolute left-0 top-[calc(100%+10px)] z-50
                  bg-cream-bg border border-beige-card
                  rounded-card shadow-card-md
                  min-w-56 p-3
                "
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <a
                  href="mailto:support@dwellio.in"
                  className="
                    flex items-center gap-3
                    px-3 py-2.5 rounded-btn
                    hover:bg-beige-card
                    transition-colors duration-150
                    group
                  "
                >
                  <div className="w-8 h-8 rounded-btn bg-beige-input flex items-center justify-center shrink-0">
                    <Mail size={15} className="text-brown-dark" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brown-muted leading-none mb-0.5">
                      Support Email
                    </p>
                    <p className="text-sm font-bold text-brown-dark leading-none">
                      support@dwellio.in
                    </p>
                  </div>
                </a>

                <div className="h-px bg-beige-card my-1" />

                <a
                  href="tel:+918800001234"
                  className="
                    flex items-center gap-3
                    px-3 py-2.5 rounded-btn
                    hover:bg-beige-card
                    transition-colors duration-150
                  "
                >
                  <div className="w-8 h-8 rounded-btn bg-beige-input flex items-center justify-center shrink-0">
                    <Phone size={15} className="text-brown-dark" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brown-muted leading-none mb-0.5">
                      Call Us
                    </p>
                    <p className="text-sm font-bold text-brown-dark leading-none">
                      +91 88000 01234
                    </p>
                  </div>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {!isAuthenticated && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="h-11 px-5 rounded-btn bg-transparent border border-beige-card font-semibold text-sm text-brown-dark hover:bg-beige-input transition-colors duration-150"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="h-12 px-7 rounded-btn bg-brown-dark text-white font-semibold text-sm hover:bg-[#1a0f09] hover:-translate-y-px transition-all duration-150"
            >
              Sign up
            </button>
          </>
        )}

        {isAuthenticated && (
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="h-11 px-4 rounded-btn bg-transparent border border-beige-card font-semibold text-sm text-brown-dark flex items-center gap-2 hover:bg-beige-input transition-colors duration-150"
            >
              <User size={17} />
              Account
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  className="absolute right-0 top-[calc(100%+10px)] z-50 bg-cream-bg border border-beige-card rounded-card shadow-card-md min-w-44 p-2"
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {[
                    { label: "Profile", path: "/profile" },
                    { label: "Rentals", path: "/rentals" },
                    { label: "Payments", path: "/payments" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path)
                        setOpen(false)
                      }}
                      className="flex items-center w-full px-3.5 py-2.5 text-left font-semibold text-sm text-brown-dark rounded-btn bg-transparent hover:bg-beige-card transition-colors duration-150"
                    >
                      {item.label}
                    </button>
                  ))}

                  <div className="h-px bg-beige-card my-1.5" />

                  <div className="px-3.5 py-1">
                    <LogoutButton />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar