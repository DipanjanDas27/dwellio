import { useForm } from "react-hook-form"
import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { CalendarDays, IndianRupee, FileText, Clock, ArrowLeft, FilePlus, RefreshCw, Lock } from "lucide-react"

import { createRental, renewRental } from "@/services/tenantRentalThunks.js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "/logo.svg"

const CreateRental = () => {
  const { propertyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const params = new URLSearchParams(location.search)
  const rentalId = params.get("renew")
  const isRenew = Boolean(rentalId)

  const { loading, error } = useSelector((state) => state.rental)

  const idempotencyKey = useMemo(() => crypto.randomUUID(), [])

  const { security_deposit, notice_period, monthly_rent } = location.state || {}

  const { register, handleSubmit, formState: { isValid, errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      notice_period: notice_period ?? "",
      security_deposit: security_deposit ?? "",
      monthly_rent: monthly_rent ?? "",
    }
  })
  const onSubmit = async (data) => {
    if (isRenew) {
      const renewData = {
        start_date: data.start_date,
        end_date: data.end_date,
        idempotency_key: idempotencyKey,
        paymentMode: "auto",
      }
      await dispatch(renewRental({ rentalId, data: renewData }))
    } else {
      const formData = new FormData()
      formData.append("start_date", data.start_date)
      formData.append("end_date", data.end_date)
      formData.append("notice_period", data.notice_period)
      formData.append("monthly_rent", data.monthly_rent)
      formData.append("paymentMode", "auto")
      formData.append("idempotency_key", idempotencyKey)
      if (data.agreement) formData.append("agreement", data.agreement[0])
      await dispatch(createRental({ propertyId, formData }))
    }
    navigate("/rentals")
  }

  const fieldAnim = (delay) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration: 0.45 },
  })

  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center px-4 py-12 font-montserrat">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 0.68, 0, 1.1] }}
      >
        <div className="bg-white rounded-card shadow-card-md overflow-hidden">

          <div className="bg-beige-card px-8 py-6 flex items-center gap-4">
            <div className="size-12 rounded-btn bg-white flex items-center justify-center shadow-card shrink-0">
              {isRenew ? <RefreshCw size={20} className="text-brown-dark" /> : <FilePlus size={20} className="text-brown-dark" />}
            </div>
            <div>
              <img
                src={logo}
                alt="Dwellio"
                className="h-6 w-auto mb-1.5 cursor-pointer"
                onClick={() => navigate("/")}
              />
              <h1 className="text-xl font-extrabold text-brown-dark leading-none">
                {isRenew ? "Renew Rental" : "Create Rental"}
              </h1>
              <p className="text-xs font-semibold text-brown-muted mt-1">
                {isRenew ? "Extend your existing rental agreement" : "Set up a new rental agreement"}
              </p>
            </div>
          </div>

          <div className="px-8 py-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <motion.div className="space-y-1.5" {...fieldAnim(0.15)}>
                <Label className="text-sm font-bold text-brown-dark flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-brown-muted" />
                  Start Date
                </Label>
                <Input
                  type="date"
                  className="h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                  {...register("start_date", { required: "Start date is required" })}
                />
                {errors.start_date && (
                  <p className="text-xs font-semibold text-red-500">{errors.start_date.message}</p>
                )}
              </motion.div>

              <motion.div className="space-y-1.5" {...fieldAnim(0.22)}>
                <Label className="text-sm font-bold text-brown-dark flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-brown-muted" />
                  End Date
                </Label>
                <Input
                  type="date"
                  className="h-12 bg-beige-input border-beige-card rounded-btn text-brown-dark font-semibold focus-visible:ring-brown-dark/30 focus-visible:border-brown-dark"
                  {...register("end_date", { required: "End date is required" })}
                />
                {errors.end_date && (
                  <p className="text-xs font-semibold text-red-500">{errors.end_date.message}</p>
                )}
              </motion.div>

              {!isRenew && (
                <>
                  <motion.div className="space-y-1.5" {...fieldAnim(0.29)}>
                    <Label className="text-sm font-bold text-brown-dark flex items-center gap-1.5">
                      <Clock size={14} className="text-brown-muted" />
                      Notice Period (days)
                      <Lock size={12} className="text-brown-muted ml-auto" />
                    </Label>
                    <Input
                      type="number"
                      readOnly
                      className="h-12 bg-beige-card border-beige-card rounded-btn text-brown-dark font-semibold cursor-not-allowed opacity-75 focus-visible:ring-0"
                      {...register("notice_period")}
                    />
                  </motion.div>
                  
                  <motion.div className="space-y-1.5" {...fieldAnim(0.36)}>
                    <Label className="text-sm font-bold text-brown-dark flex items-center gap-1.5">
                      <IndianRupee size={14} className="text-brown-muted" />
                      Security Deposit
                      <Lock size={12} className="text-brown-muted ml-auto" />
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-brown-muted">₹</span>
                      <Input
                        type="number"
                        readOnly
                        className="pl-8 h-12 bg-beige-card border-beige-card rounded-btn text-brown-dark font-semibold cursor-not-allowed opacity-75 focus-visible:ring-0"
                        {...register("security_deposit")}
                      />
                    </div>
                    <input type="hidden" {...register("monthly_rent", { required: true })} />
                    {errors.monthly_rent && (
                      <p className="text-xs font-semibold text-red-500">{errors.monthly_rent.message}</p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-1.5" {...fieldAnim(0.43)}>
                    <Label className="text-sm font-bold text-brown-dark flex items-center gap-1.5">
                      <FileText size={14} className="text-brown-muted" />
                      Agreement Document
                    </Label>
                    <label className="flex items-center gap-3 h-12 px-3.5 bg-beige-input border border-beige-card rounded-btn cursor-pointer hover:border-brown-muted transition-colors duration-150">
                      <FileText size={15} className="text-brown-muted shrink-0" />
                      <span className="text-sm font-semibold text-brown-muted">Upload agreement PDF...</span>
                      <input
                        type="file"
                        className="hidden"
                        {...register("agreement")}
                      />
                    </label>
                  </motion.div>
                </>
              )}

              {error && (
                <motion.p
                  className="text-xs font-semibold text-red-500 text-center bg-red-50 border border-red-200 rounded-btn py-2.5 px-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                className="space-y-3 pt-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isRenew ? 0.3 : 0.5, duration: 0.45 }}
              >
                <Button
                  type="submit"
                  disabled={!isValid || loading}
                  className="w-full h-12 bg-brown-dark hover:bg-[#1a0f09] text-white font-semibold text-base rounded-btn transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      {isRenew ? "Renewing..." : "Creating..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isRenew ? <RefreshCw size={16} /> : <FilePlus size={16} />}
                      {isRenew ? "Renew Rental" : "Create Rental"}
                    </span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-beige-card text-brown-dark font-semibold text-base rounded-btn hover:bg-beige-input transition-colors duration-150 flex items-center justify-center gap-2"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={15} />
                  Go Back
                </Button>
              </motion.div>

            </form>
          </div>

        </div>
      </motion.div >
    </div >
  )
}

export default CreateRental