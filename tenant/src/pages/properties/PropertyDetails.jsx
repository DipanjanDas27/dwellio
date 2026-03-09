import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import { getProperty } from "@/services/tenantPropertyThunks"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PropertyDetails = () => {
  const { propertyId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { propertyDetails, loading } = useSelector(
    (state) => state.property
  )

  useEffect(() => {
    dispatch(getProperty(propertyId))
  }, [dispatch, propertyId])

  if (loading || !propertyDetails)
    return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-4">

      <Card>

        <CardHeader>
          <CardTitle>{propertyDetails.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {propertyDetails.image_url && (
            <img
              src={propertyDetails.image_url}
              alt={propertyDetails.title}
              className="w-full h-64 object-cover rounded"
            />
          )}

          <p>{propertyDetails.description}</p>

          <p><strong>City:</strong> {propertyDetails.city}</p>

          <p><strong>BHK:</strong> {propertyDetails.bhk}</p>

          <p><strong>Rent:</strong> ₹{propertyDetails.rent_amount}</p>

          <p><strong>Available Rooms:</strong> {propertyDetails.available_rooms}</p>

          <div className="flex gap-2 pt-4">

            <Button
              onClick={() =>
                navigate(`/rentals/create/${propertyDetails.id}`)
              }
            >
              Book Rental
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}

export default PropertyDetails