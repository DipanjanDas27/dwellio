import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getFilteredProperties } from "@/services/tenantPropertyThunks.js"

import PropertySearch from "@/components/custom/PropertySearch"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Properties = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { properties } = useSelector(
    (state) => state.property
  )

  useEffect(() => {
  dispatch(
    getFilteredProperties({
      minPrice: 0,
      maxPrice: 100000
    })
  )
}, [dispatch])

  const propertyList = useMemo(() => properties || [], [properties])

  return (

    <div>

      <PropertySearch />

      <div className="grid md:grid-cols-3 gap-4">

        {propertyList.map((property) => (

          <Card key={property.id}>

            <CardContent className="p-4 space-y-3">

              <img
                src={property.image_url}
                alt="property"
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

        ))}

      </div>

    </div>
  )
}

export default Properties