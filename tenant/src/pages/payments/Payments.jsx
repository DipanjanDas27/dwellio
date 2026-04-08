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
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-52 mb-8" />

        <div className="flex gap-2 mb-6 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 sm:w-32" />
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-card shadow-card overflow-hidden">
              <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-4 border-b flex items-center gap-3">
                <Skeleton className="size-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="px-4 sm:px-5 py-4 flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-20" />
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
      >

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 sm:size-11 bg-white flex items-center justify-center shadow-card">
            <CreditCard size={18} className="text-brown-dark" />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold truncate">Payments</h1>
            <p className="text-xs sm:text-sm text-brown-muted">
              {filteredPayments.length} {filter === "all" ? "total" : filter} payment{filteredPayments.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-btn font-bold ${
                filter === tab.key
                  ? "bg-brown-dark text-white"
                  : "bg-beige-card text-brown-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="size-14 bg-beige-card flex items-center justify-center mb-4">
              <CreditCard size={24} />
            </div>
            <p className="text-base font-bold mb-1">No payments found</p>
            <p className="text-sm text-brown-muted">
              {filter === "all"
                ? "You have no payment history yet"
                : `No ${filter === "monthly" ? "monthly rent" : "security deposit"} payments`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment, i) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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