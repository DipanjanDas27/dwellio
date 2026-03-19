import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { CreditCard } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getTenantPayments } from "@/services/tenantPaymentThunks.js"
import PaymentCard from "@/components/custom/PaymentCard"

const TABS = [
  { key: "all", label: "All Payments" },
  { key: "monthly", label: "Monthly Rent" },
  { key: "security", label: "Security Deposits" },
]

const Payments = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { payments, loading } = useSelector((state) => state.payment)

  const [filter, setFilter] = useState("all")

  useEffect(() => {
    dispatch(getTenantPayments())
  }, [dispatch])

  const paymentList = useMemo(() => payments || [], [payments])

  const filteredPayments = useMemo(() => {
    if (filter === "all") return paymentList
    if (filter === "monthly") return paymentList.filter(p => p.payment_type === "monthly")
    if (filter === "security") return paymentList.filter(p => p.payment_type === "security")
    return paymentList
  }, [paymentList, filter])

  const handleView = (paymentId) => navigate(`/payments/${paymentId}`)

  if (loading) return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-8 w-40 rounded-btn bg-beige-card mb-2" />
        <Skeleton className="h-4 w-52 rounded-btn bg-beige-card mb-8" />
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-9 w-32 rounded-btn bg-beige-card" />)}
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-card shadow-card overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-beige-card/60 flex items-center gap-3">
                <Skeleton className="size-10 rounded-btn bg-beige-card" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24 rounded-btn bg-beige-card" />
                  <Skeleton className="h-4 w-40 rounded-btn bg-beige-card" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-beige-card" />
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <Skeleton className="h-7 w-24 rounded-btn bg-beige-card" />
                <Skeleton className="h-10 w-20 rounded-btn bg-beige-card" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="size-11 rounded-btn bg-white flex items-center justify-center shadow-card">
            <CreditCard size={20} className="text-brown-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-brown-dark leading-none">Payments</h1>
            <p className="text-sm font-semibold text-brown-muted mt-1">
              {filteredPayments.length} {filter === "all" ? "total" : filter} payment{filteredPayments.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>


        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-btn text-sm font-bold transition-colors duration-150 ${filter === tab.key
                  ? "bg-brown-dark text-white"
                  : "bg-beige-card text-brown-muted hover:bg-beige-input"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredPayments.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="size-14 rounded-card bg-beige-card flex items-center justify-center mb-4">
              <CreditCard size={24} className="text-brown-muted" />
            </div>
            <p className="text-base font-bold text-brown-dark mb-1">No payments found</p>
            <p className="text-sm font-semibold text-brown-muted">
              {filter === "all"
                ? "You have no payment history yet"
                : `No ${filter === "monthly" ? "monthly rent" : "security deposit"} payments yet`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment, i) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <PaymentCard payment={payment} onView={handleView} />
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </div>
  )
}

export default Payments