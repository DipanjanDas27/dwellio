import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import LogoutButton from "./LogoutButton"

import { Button } from "@/components/ui/button"

const Navbar = () => {

  const navigate = useNavigate()

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  )

  return (
    <nav className="w-full border-b bg-white">

      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        <h1
          className="text-xl font-semibold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Dwellio
        </h1>

        <div className="flex gap-3">

          <Button
            variant="ghost"
            onClick={() => navigate("/properties")}
          >
            Properties
          </Button>

          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/rentals")}
              >
                My Rentals
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/payments")}
              >
                Payments
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>

              <Button
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}

          {isAuthenticated && <LogoutButton />}

        </div>

      </div>

    </nav>
  )
}

export default Navbar