import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getTenantRentals } from "@/services/tenantRentalThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MyRentals = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { rentals, loading } = useSelector((state) => state.rental)

  useEffect(() => {
    dispatch(getTenantRentals())
  }, [dispatch])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">

      <Card>
        <CardHeader>
          <CardTitle>My Rentals</CardTitle>
        </CardHeader>
      </Card>

      {rentals?.map((rental) => (
        <Card
          key={rental.id}
          className="cursor-pointer"
          onClick={() => navigate(`/rentals/${rental.id}`)}
        >

          <CardContent className="p-4 space-y-2">

            <p className="font-semibold">
              Property: {rental.property_title}
            </p>

            <p>Status: {rental.status}</p>

            <p>
              Rent: ₹{rental.monthly_rent}
            </p>

            <p>
              Start: {rental.start_date}
            </p>

          </CardContent>

        </Card>
      ))}

    </div>
  )
}

export default MyRentals