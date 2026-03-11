import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { ownerGetPayments } from "@/services/ownerPaymentThunks"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Payments = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { payments, loading } = useSelector((state) => state.payment)

  useEffect(() => {
    dispatch(ownerGetPayments())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        Loading payments...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold">Payments</h1>

      {payments?.length === 0 && (
        <p className="text-muted-foreground">No payments found</p>
      )}

      <div className="grid gap-4">

        {payments?.map((payment) => (
          <Card key={payment.id}>

            <CardHeader>
              <CardTitle className="text-base">
                Transaction {payment.transaction_id}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center justify-between">

              <div className="space-y-1 text-sm">
                <p>Amount: ₹{payment.amount}</p>
                <p>Status: {payment.status}</p>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(`/payments/${payment.id}`)}
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

export default Payments