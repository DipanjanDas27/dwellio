import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import {
  getPaymentById,
  deletePayment
} from "@/services/tenantPaymentThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PaymentDetails = () => {
  const { paymentId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { paymentDetails, loading } = useSelector(
    (state) => state.payment
  )

  useEffect(() => {
    dispatch(getPaymentById(paymentId))
  }, [dispatch, paymentId])

  const handleDelete = async () => {
    await dispatch(deletePayment(paymentId))
    navigate("/payments")
  }

  if (!paymentDetails || loading)
    return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-4">

      <Card>

        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <p>
            <strong>Amount:</strong> ₹{paymentDetails.amount}
          </p>

          <p>
            <strong>Status:</strong> {paymentDetails.payment_status}
          </p>

          <p>
            <strong>Transaction ID:</strong>{" "}
            {paymentDetails.transaction_id || "Not generated"}
          </p>

          <div className="flex gap-2 pt-4">

            {paymentDetails.payment_status === "failed" && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete Failed Payment
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

export default PaymentDetails