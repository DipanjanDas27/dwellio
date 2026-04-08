import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../services/authThunks"

const LogoutButton = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/")
  }

  return (
    <button
      onClick={handleLogout}
      className="
        w-full text-left
        font-semibold text-sm text-red-600
        hover:text-red-800
        transition-colors duration-150
        bg-transparent border-none
        px-2 py-2 sm:px-0 sm:py-0   /* better touch area on mobile */
      "
    >
      Logout
    </button>
  )
}

export default LogoutButton