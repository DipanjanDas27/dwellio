import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Navbar from "./components/custom/Navbar"
import Footer from "./components/custom/Footer"
import { getCurrentUser } from "./services/userThunks"
import AppSkeleton from "./components/custom/AppSkeleton"
import ScrollToTop from "./components/custom/ScrollToTop"

const App = () => {
  const dispatch = useDispatch()
  const { isInitialized } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(getCurrentUser())
    }
  }, [dispatch])


  if (!isInitialized) {
    return (
      <AppSkeleton />
    )
  }

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen bg-cream-bg pt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App