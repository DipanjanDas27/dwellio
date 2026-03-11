import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import { getRentalById } from "@/services/tenantRentalThunks.js"
import { createPayment } from "@/services/tenantPaymentThunks.js"

import { Button } from "@/components/ui/button"

const RentalDetails = () => {

  const { rentalId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { rental } = useSelector(
    (state) => state.rental
  )

  useEffect(() => {
    dispatch(getRentalById(rentalId))
  }, [dispatch, rentalId])

  const handlePayment = useCallback(() => {

    dispatch(
      createPayment({
        agreement_id: rental.id,
        owner_id: rental.owner_id,
        amount: rental.monthly_rent,
        idempotency_key: crypto.randomUUID()
      })
    )

  }, [dispatch, rental])

  const handleRenew = useCallback(() => {
    navigate(`/rentals/create/${rental.property_id}?renew=${rental.id}`)
  }, [navigate, rental])

  if (!rental) return <div>Loading...</div>

  return (

    <div className="space-y-4">

      <h1 className="text-2xl font-bold">
        Rental Details
      </h1>

      <p>Status: {rental.status}</p>

      <p>Monthly Rent: ₹{rental.monthly_rent}</p>

      <Button onClick={handlePayment}>
        Pay Monthly Rent
      </Button>

      {rental.status === "terminated" && (

        <Button
          variant="outline"
          onClick={handleRenew}
        >
          Renew Rental
        </Button>

      )}

    </div>

  )
}

export default RentalDetails