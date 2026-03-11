import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PropertyCard = ({ property }) => {

  const navigate = useNavigate()

  return (
    <Card>

      <CardContent className="p-4 space-y-3">

        <img
          src={property.image_url}
          alt={property.title}
          loading="lazy"
          className="w-full h-40 object-cover rounded"
        />

        <h3 className="font-semibold">
          {property.title}
        </h3>

        <p>{property.city}</p>

        <p>₹ {property.rent_amount}</p>

        <Button
          onClick={() =>
            navigate(`/properties/${property.id}`)
          }
        >
          View Details
        </Button>

      </CardContent>

    </Card>
  )
}

export default memo(PropertyCard)