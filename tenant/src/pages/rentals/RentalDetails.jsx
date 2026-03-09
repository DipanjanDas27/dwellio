import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import {
  getRentalById,
  cancelRental
} from "@/services/tenantRentalThunks.js"

import { createPayment } from "@/services/tenantPaymentThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const RentalDetails = () => {

  const { rentalId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { rentalDetails, loading } = useSelector(
    (state) => state.rental
  )

  useEffect(() => {
    dispatch(getRentalById(rentalId))
  }, [dispatch, rentalId])

  const handleCancel = async () => {
    await dispatch(cancelRental(rentalId))
    dispatch(getRentalById(rentalId))
  }

  const handleRenew = () => {

    navigate(
      `/rentals/create/${rentalDetails.property_id}`,
      {
        state: {
          isRenew: true,
          rentalId: rentalDetails.id
        }
      }
    )
  }

  const handleMonthlyPayment = async () => {

    const paymentData = {
      agreement_id: rentalDetails.id,
      owner_id: rentalDetails.owner_id,
      amount: rentalDetails.monthly_rent,
      idempotency_key: crypto.randomUUID(),
      gatewayResponse: {
        status: "success",
        transaction_id: crypto.randomUUID()
      }
    }

    await dispatch(createPayment(paymentData))
  }

  if (!rentalDetails || loading)
    return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-4">

      <Card>

        <CardHeader>
          <CardTitle>Rental Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <p><strong>Status:</strong> {rentalDetails.status}</p>

          <p>
            <strong>Monthly Rent:</strong> ₹{rentalDetails.monthly_rent}
          </p>

          <p>
            <strong>Start Date:</strong> {rentalDetails.start_date}
          </p>

          <p>
            <strong>End Date:</strong> {rentalDetails.end_date}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">

            {rentalDetails.status === "active" && (
              <Button onClick={handleMonthlyPayment}>
                Pay Monthly Rent
              </Button>
            )}

            {rentalDetails.status === "pending" && (
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel Rental
              </Button>
            )}

            {rentalDetails.status === "terminated" && (
              <Button onClick={handleRenew}>
                Renew Rental
              </Button>
            )}

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

export default RentalDetails