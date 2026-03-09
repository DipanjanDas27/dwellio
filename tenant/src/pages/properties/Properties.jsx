import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import PropertySearch from "@/components/custom/PropertySearch.jsx"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Properties = () => {
  const navigate = useNavigate()

  const { properties, loading } = useSelector((state) => state.property)

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">

      <Card>

        <CardHeader>
          <CardTitle>Search Properties</CardTitle>
        </CardHeader>

        <CardContent>
          <PropertySearch />
        </CardContent>

      </Card>

      {loading && (
        <div>Loading...</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">

        {properties?.map((property) => (
          <Card
            key={property.id}
            className="cursor-pointer"
            onClick={() =>
              navigate(`/properties/${property.id}`)
            }
          >

            <CardContent className="p-4 space-y-2">

              {property.image_url && (
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}

              <h3 className="font-semibold">
                {property.title}
              </h3>

              <p className="text-sm text-gray-600">
                {property.city}
              </p>

              <p className="font-medium">
                ₹{property.rent_amount}/month
              </p>

            </CardContent>

          </Card>
        ))}

      </div>

    </div>
  )
}

export default Properties