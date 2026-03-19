import { useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import {
  Home, IndianRupee, User, CheckCircle2, Clock, XCircle,
  ArrowLeft, CreditCard, RefreshCw, CalendarDays, FileText,
  AlertCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getRentalById } from "@/services/tenantRentalThunks.js"
import { createPayment, getPaymentsByAgreement } from "@/services/tenantPaymentThunks.js"
import { Button } from "@/components/ui/button"

const STATUS_CONFIG = {
  active: { icon: <CheckCircle2 size={14} />, classes: "bg-green-50 text-green-700 border border-green-200" },
  pending: { icon: <Clock size={14} />, classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  expired: { icon: <XCircle size={14} />, classes: "bg-red-50 text-red-700 border border-red-200" },
  terminated: { icon: <XCircle size={14} />, classes: "bg-red-50 text-red-700 border border-red-200" },
}

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? {
    icon: <Clock size={14} />,
    classes: "bg-beige-card text-brown-muted border border-beige-card",
  }

const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between gap-4 py-3.5 border-b border-beige-card/60 last:border-0">
    <div className="flex items-center gap-2 text-sm font-semibold text-brown-muted shrink-0">
      {icon}
      {label}
    </div>
    <span className="text-sm font-bold text-brown-dark text-right">{value}</span>
  </div>
)

const formatDate = (ts) =>
  ts ? new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }) : "—"

const RentalDetails = () => {
  const { rentalId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { rental } = useSelector((state) => state.rental)
  const { loading: paymentLoading, agreementPayments } = useSelector((state) => state.payment)

  useEffect(() => {
    if (!rental)
      dispatch(getRentalById(rentalId))
  }, [dispatch, rentalId])


  useEffect(() => {
    if (rental?.id) dispatch(getPaymentsByAgreement(rental.id))
  }, [dispatch, rental?.id])

  const paymentIdempotencyKey = useMemo(() => crypto.randomUUID(), [rental?.id])

  const handlePayment = useCallback(async () => {
    await dispatch(createPayment({
      agreement_id: rental.id,
      owner_id: rental.owner_id,
      tenant_id: rental.tenant_id,  
      amount: rental.monthly_rent,
      idempotency_key: paymentIdempotencyKey,
    }))
    navigate("/payments")
  }, [dispatch, rental, paymentIdempotencyKey, navigate])

  const handleRenew = useCallback(() => {
    navigate(`/rentals/create/${rental.property_id}?renew=${rental.id}`)
  }, [navigate, rental])

  const currentMonthPayment = useMemo(() => {
    if (!agreementPayments?.length) return null
    const now = new Date()
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    return agreementPayments.find(
      p => p.payment_type === "monthly" && p.month_year === monthYear
    ) || null
  }, [agreementPayments])

  if (!rental) return (
    <div className="min-h-screen bg-cream-bg px-4 py-10 font-montserrat">
      <div className="max-w-lg mx-auto">
        <Skeleton className="h-4 w-32 rounded-btn bg-beige-card mb-6" />
        <div className="bg-white rounded-card shadow-card-md overflow-hidden">
          <div className="bg-beige-card px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-btn bg-white/60" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-btn bg-white/60" />
                <Skeleton className="h-5 w-32 rounded-btn bg-white/60" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full bg-white/60" />
          </div>
          <div className="px-6 py-2 space-y-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex justify-between py-3.5 border-b border-beige-card/60">
                <Skeleton className="h-4 w-28 rounded-btn bg-beige-card" />
                <Skeleton className="h-4 w-32 rounded-btn bg-beige-card" />
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 pt-3 space-y-3">
            <Skeleton className="h-12 w-full rounded-btn bg-beige-card" />
            <Skeleton className="h-12 w-full rounded-btn bg-beige-card" />
          </div>
        </div>
      </div>
    </div>
  )

  const { icon, classes } = getStatus(rental.status)

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
          Back to Rentals
        </button>

        <div className="bg-white rounded-card shadow-card-md overflow-hidden">


          <div className="bg-beige-card px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-btn bg-white flex items-center justify-center">
                <Home size={20} className="text-brown-dark" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brown-muted leading-none mb-1">Agreement</p>
                <p className="text-base font-extrabold text-brown-dark leading-none">Rental Details</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ${classes}`}>
              {icon}
              {rental.status}
            </div>
          </div>


          {currentMonthPayment && (
            <div className="px-6 pt-5">
              <div className={`rounded-card p-4 border ${currentMonthPayment.payment_status === "success"
                ? "bg-green-50 border-green-200"
                : currentMonthPayment.payment_status === "pending"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200"
                }`}>
                <p className="text-xs font-bold text-brown-muted uppercase tracking-widest mb-2">
                  Current Month — {currentMonthPayment.month_year}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-extrabold text-brown-dark">
                      ₹{Number(currentMonthPayment.amount).toLocaleString("en-IN")}
                    </p>
                    {currentMonthPayment.due_date && (
                      <p className="text-xs font-semibold text-brown-muted mt-0.5">
                        Due: {formatDate(currentMonthPayment.due_date)}
                      </p>
                    )}
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ${getStatus(currentMonthPayment.payment_status).classes
                    }`}>
                    {getStatus(currentMonthPayment.payment_status).icon}
                    {currentMonthPayment.payment_status}
                  </div>
                </div>
              </div>
            </div>
          )}


          <div className="px-6 py-2">
            <DetailRow
              label="Monthly Rent"
              value={`₹${Number(rental.monthly_rent).toLocaleString("en-IN")}/mo`}
              icon={<IndianRupee size={14} />}
            />
            <DetailRow
              label="Status"
              value={rental.status}
              icon={<CheckCircle2 size={14} />}
            />
            <DetailRow
              label="Start Date"
              value={formatDate(rental.start_date)}
              icon={<CalendarDays size={14} />}
            />
            <DetailRow
              label="End Date"
              value={formatDate(rental.end_date)}
              icon={<CalendarDays size={14} />}
            />
            <DetailRow
              label="Notice Period"
              value={rental.notice_period ? `${rental.notice_period} days` : "—"}
              icon={<AlertCircle size={14} />}
            />
            <DetailRow
              label="Security Paid"
              value={rental.security_paid ? "Yes" : "No"}
              icon={<CheckCircle2 size={14} />}
            />
            {rental.agreement_document_url && (
              <div className="flex items-center justify-between gap-4 py-3.5 border-b border-beige-card/60">
                <div className="flex items-center gap-2 text-sm font-semibold text-brown-muted shrink-0">
                  <FileText size={14} />
                  Agreement
                </div>
                <a
                  href={rental.agreement_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-brown-dark hover:underline"
                >
                  View Document
                </a>
              </div>
            )}
            <DetailRow
              label="Created At"
              value={formatDate(rental.created_at)}
              icon={<CalendarDays size={14} />}
            />
          </div>

          {/* ── Action buttons ───────────────────────────────── */}
          <div className="px-6 pb-6 pt-3 flex flex-col gap-3">

            {rental.status === "active" && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handlePayment}
                  disabled={
                    paymentLoading ||
                    currentMonthPayment?.payment_status === "success"
                  }
                  className="w-full h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-sm rounded-btn transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard size={16} />
                      {currentMonthPayment?.payment_status === "success"
                        ? "This Month Paid ✓"
                        : currentMonthPayment?.payment_status === "pending"
                          ? "Pay Monthly Rent"
                          : "Pay Monthly Rent"}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}

            {rental.status === "pending" && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-sm rounded-btn transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard size={16} />
                      Retry Payment
                    </span>
                  )}
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => navigate(`/users/${rental.owner_id}`)}
                className="w-full h-12 border-beige-card text-brown-dark font-semibold text-sm rounded-btn hover:bg-beige-input transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <User size={16} />
                View Owner
              </Button>
            </motion.div>

            {rental.status === "terminated" && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  onClick={handleRenew}
                  className="w-full h-12 border-beige-card text-brown-dark font-semibold text-sm rounded-btn hover:bg-beige-input transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Renew Rental
                </Button>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RentalDetails