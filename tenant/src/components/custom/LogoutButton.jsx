import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../services/authThunks"

const LogoutButton = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="
        w-full text-left
        font-semibold text-sm text-red-600
        hover:text-red-800
        transition-colors duration-150
        bg-transparent border-none p-0
      "
    >
      Logout
    </button>
  )
}

export default LogoutButton