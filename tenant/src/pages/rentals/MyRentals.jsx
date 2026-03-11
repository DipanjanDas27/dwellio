import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getTenantRentals } from "@/services/tenantRentalThunks.js"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const MyRentals = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { rentals } = useSelector(
    (state) => state.rental
  )

  useEffect(() => {
    dispatch(getTenantRentals())
  }, [dispatch])

  const rentalList = useMemo(() => rentals || [], [rentals])

  return (

    <div className="grid md:grid-cols-2 gap-4">

      {rentalList.map((rental) => (

        <Card key={rental.id}>

          <CardContent className="p-4 space-y-3">

            <h3 className="font-semibold">
              Rental ID: {rental.id}
            </h3>

            <p>Status: {rental.status}</p>

            <p>Monthly Rent: ₹{rental.monthly_rent}</p>

            <Button
              onClick={() =>
                navigate(`/rentals/${rental.id}`)
              }
            >
              View Details
            </Button>

          </CardContent>

        </Card>

      ))}

    </div>
  )
}

export default MyRentals