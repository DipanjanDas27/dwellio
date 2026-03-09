import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

const Home = () => {

  const navigate = useNavigate()

  return (
    <div className="text-center space-y-6 py-20">

      <h1 className="text-4xl font-bold">
        Find Your Next Rental Home
      </h1>

      <p className="text-gray-600">
        Browse verified rental properties and manage agreements easily.
      </p>

      <div className="flex justify-center gap-4">

        <Button
          onClick={() => navigate("/properties")}
        >
          Browse Properties
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/rentals")}
        >
          My Rentals
        </Button>

      </div>

    </div>
  )
}

export default Home