import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import { ownerGetPaymentById } from "@/services/ownerPaymentThunks"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PaymentDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { paymentId } = useParams()

  const { payment, loading } = useSelector((state) => state.payment)

  useEffect(() => {
    dispatch(ownerGetPaymentById(paymentId))
  }, [dispatch, paymentId])

  if (loading || !payment) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        Loading payment details...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      <Button variant="outline" onClick={() => navigate(-1)}>
        Back
      </Button>

      <Card>

        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">

          <p>
            <span className="font-medium">Transaction ID:</span>{" "}
            {payment.transaction_id}
          </p>

          <p>
            <span className="font-medium">Amount:</span>{" "}
            ₹{payment.amount}
          </p>

          <p>
            <span className="font-medium">Status:</span>{" "}
            {payment.status}
          </p>

          <p>
            <span className="font-medium">Rental ID:</span>{" "}
            {payment.rental_id}
          </p>

          <p>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(payment.created_at).toLocaleString()}
          </p>

        </CardContent>

      </Card>

    </div>
  )
}

export default PaymentDetails