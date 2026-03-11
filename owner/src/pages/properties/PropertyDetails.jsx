import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import { getProperty } from "@/services/tenantPropertyThunks.js"

import { Button } from "@/components/ui/button"

const PropertyDetails = () => {

  const { propertyId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { property } = useSelector(
    (state) => state.property
  )

  useEffect(() => {
    dispatch(getProperty(propertyId))
  }, [dispatch, propertyId])

  const handleCreateRental = useCallback(() => {
    navigate(`/rentals/create/${propertyId}`)
  }, [navigate, propertyId])

  if (!property) return <div>Loading...</div>

  return (

    <div className="space-y-4">

      <img
        src={property.image_url}
        alt="property"
        loading="lazy"
        className="w-full max-h-96 object-cover rounded"
      />

      <h1 className="text-2xl font-bold">
        {property.title}
      </h1>

      <p>{property.description}</p>

      <p>City: {property.city}</p>

      <p>Rent: ₹{property.rent_amount}</p>

      <Button onClick={handleCreateRental}>
        Rent This Property
      </Button>

    </div>
  )
}

export default PropertyDetails