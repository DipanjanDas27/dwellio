import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getTenantPayments } from "@/services/tenantPaymentThunks.js"

import { Card, CardContent } from "@/components/ui/card"

const Payments = () => {

  const dispatch = useDispatch()

  const { payments } = useSelector(
    (state) => state.payment
  )

  useEffect(() => {
    dispatch(getTenantPayments())
  }, [dispatch])

  const paymentList = useMemo(() => payments || [], [payments])

  return (

    <div className="grid gap-4">

      {paymentList.map((payment) => (

        <Card key={payment.id}>

          <CardContent className="p-4">

            <p>Amount: ₹{payment.amount}</p>

            <p>Status: {payment.payment_status}</p>

            <p>Transaction: {payment.transaction_id}</p>

          </CardContent>

        </Card>

      ))}

    </div>
  )
}

export default Payments