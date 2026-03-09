import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getTenantPayments } from "@/services/tenantPaymentThunks"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Payments = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { payments, loading } = useSelector((state) => state.payment)

  useEffect(() => {
    dispatch(getTenantPayments())
  }, [dispatch])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
      </Card>

      {payments?.map((payment) => (
        <Card
          key={payment.id}
          className="cursor-pointer"
          onClick={() => navigate(`/payments/${payment.id}`)}
        >
          <CardContent className="p-4 space-y-2">

            <p><strong>Amount:</strong> ₹{payment.amount}</p>

            <p>Status: {payment.payment_status}</p>

            <p>Transaction: {payment.transaction_id || "Pending"}</p>

          </CardContent>
        </Card>
      ))}

    </div>
  )
}

export default Payments