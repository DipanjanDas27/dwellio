import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { logoutUser } from "../../services/authThunks"

import { Button } from "@/components/ui/button"

const LogoutButton = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/login")
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
    >
      Logout
    </Button>
  )
}

export default LogoutButton