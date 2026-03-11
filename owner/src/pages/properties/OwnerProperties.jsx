import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { ownerGetProperties } from "@/services/ownerPropertyThunks"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const OwnerProperties = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { properties } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(ownerGetProperties())
  }, [dispatch])

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Your Properties</h1>

        <Button onClick={() => navigate("/owner/properties/create")}>
          Add Property
        </Button>
      </div>

      <div className="grid gap-4">

        {properties?.map((property) => (
          <Card key={property.id}>

            <CardHeader>
              <CardTitle>{property.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between">

              <div>
                <p>{property.city}</p>
                <p>₹{property.price}</p>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/owner/properties/${property.id}`)
                }
              >
                View
              </Button>

            </CardContent>

          </Card>
        ))}

      </div>

    </div>
  )
}

export default OwnerProperties