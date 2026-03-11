import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import { getProperty } from "@/services/propertyThunks"
import { ownerDeleteProperty } from "@/services/ownerPropertyThunks"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PropertyDetails = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { propertyId } = useParams()

  const { property } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(getProperty(propertyId))
  }, [dispatch, propertyId])

  const handleDelete = async () => {
    await dispatch(ownerDeleteProperty(propertyId))
    navigate("/owner/properties")
  }

  if (!property) return null

  return (
    <div className="p-6 space-y-6">

      <Card>

        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <p>{property.address}</p>
          <p>{property.city}</p>
          <p>₹{property.rent_amount}</p>

          <div className="flex gap-3">

            <Button
              onClick={() =>
                navigate(`/owner/properties/${property.id}/update`)
              }
            >
              Update
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}

export default PropertyDetails