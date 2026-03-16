import { memo } from "react"
import { motion } from "motion/react"
import { CreditCard, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const STATUS_CONFIG = {
  refunded:  { icon: <CheckCircle2 size={13} />, classes: "bg-blue-50 text-blue-700 border border-blue-200"   },
  success:   { icon: <CheckCircle2 size={13} />, classes: "bg-green-50 text-green-700 border border-green-200" },
  pending:   { icon: <Clock size={13} />,         classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  failed:    { icon: <XCircle size={13} />,        classes: "bg-red-50 text-red-700 border border-red-200"      },
}

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? {
    icon: <Clock size={13} />,
    classes: "bg-beige-card text-brown-muted border border-beige-card",
  }

const PaymentCard = ({ payment, onView }) => {
  const { icon, classes } = getStatus(payment.payment_status)

  return (
    <motion.div
      className="bg-white rounded-card border border-beige-card shadow-card font-montserrat overflow-hidden"
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(43,27,18,0.14)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-beige-card/60">
        <div className="size-10 rounded-btn bg-beige-card flex items-center justify-center shrink-0">
          <CreditCard size={18} className="text-brown-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-brown-muted leading-none mb-1">Transaction ID</p>
          <p className="text-sm font-bold text-brown-dark truncate">
            {payment.transaction_id || "Not generated"}
          </p>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize shrink-0 ${classes}`}>
          {icon}
          {payment.payment_status}
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-brown-muted leading-none mb-1">Amount</p>
          <p className="text-xl font-extrabold text-brown-dark leading-none">
            ₹{Number(payment.amount).toLocaleString("en-IN")}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => onView(payment.id)}
          className="shrink-0 h-10 px-4 rounded-btn border-beige-card text-brown-dark font-semibold text-sm hover:bg-beige-input hover:border-brown-muted transition-colors duration-150 flex items-center gap-1.5"
        >
          View
          <ArrowRight size={14} />
        </Button>
      </div>
    </motion.div>
  )
}

export default memo(PaymentCard)