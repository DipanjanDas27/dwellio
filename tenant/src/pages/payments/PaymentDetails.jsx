import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { CreditCard, CheckCircle2, Clock, XCircle, Trash2, ArrowLeft, Hash, IndianRupee, CalendarDays, Link } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getPaymentById, deletePayment } from "@/services/tenantPaymentThunks.js"
import { Button } from "@/components/ui/button"

const STATUS_CONFIG = {
  success: { icon: <CheckCircle2 size={14} />, classes: "bg-green-50 text-green-700 border border-green-200" },
  refunded: { icon: <CheckCircle2 size={14} />, classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  pending: { icon: <Clock size={14} />, classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  failed: { icon: <XCircle size={14} />, classes: "bg-red-50 text-red-700 border border-red-200" },
}

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? {
    icon: <Clock size={14} />,
    classes: "bg-beige-card text-brown-muted border border-beige-card",
  }

const DetailRow = ({ icon, label, value, mono }) => (
  <div className="flex items-start justify-between gap-4 py-3.5 border-b border-beige-card/60 last:border-0">
    <div className="flex items-center gap-2 text-sm font-semibold text-brown-muted shrink-0">
      {icon}
      {label}
    </div>
    <span className={`text-sm font-bold text-brown-dark text-right break-all ${mono ? "font-mono tracking-wide" : ""}`}>
      {value}
    </span>
  </div>
)

const PaymentDetails = () => {
  const { paymentId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { paymentDetails, loading } = useSelector((state) => state.payment)
  
  useEffect(() => {
    dispatch(getPaymentById(paymentId))
  }, [dispatch, paymentId])

  const handleDelete = async () => {
    await dispatch(deletePayment(paymentId))
    navigate("/payments")
  }

  if (!paymentDetails || loading) return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <div className="max-w-lg mx-auto">
        <Skeleton className="h-4 w-36 rounded-btn bg-beige-card mb-6" />
        <div className="bg-white rounded-card shadow-card-md overflow-hidden">
          <div className="bg-beige-card px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-btn bg-white/60" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded-btn bg-white/60" />
                <Skeleton className="h-5 w-36 rounded-btn bg-white/60" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full bg-white/60" />
          </div>
          <div className="px-6 py-2 space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between py-3.5 border-b border-beige-card/60">
                <Skeleton className="h-4 w-28 rounded-btn bg-beige-card" />
                <Skeleton className="h-4 w-36 rounded-btn bg-beige-card" />
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 pt-2">
            <Skeleton className="h-11 w-32 rounded-btn bg-beige-card" />
          </div>
        </div>
      </div>
    </div>
  )

  const { icon, classes } = getStatus(paymentDetails.payment_status)

  const formatDate = (ts) =>
    ts ? new Date(ts).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }) : "—"

  return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-brown-muted hover:text-brown-dark transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Payments
        </button>

        <div className="bg-white rounded-card shadow-card-md overflow-hidden">

          <div className="bg-beige-card px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-btn bg-white flex items-center justify-center">
                <CreditCard size={20} className="text-brown-dark" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brown-muted leading-none mb-1">Payment Details</p>
                <p className="text-base font-extrabold text-brown-dark leading-none">Transaction Receipt</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ${classes}`}>
              {icon}
              {paymentDetails.payment_status}
            </div>
          </div>

          <div className="px-6 py-2">
            <DetailRow
              icon={<IndianRupee size={14} />}
              label="Amount"
              value={`₹${Number(paymentDetails.amount).toLocaleString("en-IN")}`}
            />
            <DetailRow
              icon={<CheckCircle2 size={14} />}
              label="Status"
              value={paymentDetails.payment_status}
            />
            <DetailRow
              icon={<Hash size={14} />}
              label="Transaction ID"
              value={paymentDetails.transaction_id || "Not generated"}
              mono
            />
            <DetailRow
              icon={<Link size={14} />}
              label="Agreement ID"
              value={paymentDetails.agreement_id || "—"}
              mono
            />
            <DetailRow
              icon={<CalendarDays size={14} />}
              label="Payment Date"
              value={formatDate(paymentDetails.created_at)}
            />
          </div>

          <div className="px-6 pb-6 pt-2 flex gap-3">
            {paymentDetails.payment_status === "failed" && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="h-11 px-5 rounded-btn font-semibold text-sm flex items-center gap-2"
                >
                  <Trash2 size={15} />
                  Delete Failed Payment
                </Button>
              </motion.div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default PaymentDetails