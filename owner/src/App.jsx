import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Navbar from "./components/custom/Navbar"
import Footer from "./components/custom/Footer"
import { getCurrentUser } from "./services/userThunks"

const App = () => {
  const dispatch = useDispatch()
  const { isInitialized } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App