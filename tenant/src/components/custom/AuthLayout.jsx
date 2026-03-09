import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate()
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isInitialized) return

    if (authentication && !isAuthenticated) {
      navigate("/login", { replace: true })
    }

    if (!authentication && isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [authentication, isAuthenticated, isInitialized, navigate])

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  return children
}

export default AuthLayout