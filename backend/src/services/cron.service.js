import cron from "node-cron"
import {
  getActiveRentalsForCron,
  createMonthlyPayment,
  getUnpaidMonthlyPayments,
} from "../models/payment.model.js"
import { getUserById } from "../models/user.model.js"
import { terminateExpiredRentalsService } from "./rental.service.js"
import sendMail from "./mail.service.js"
import {
  monthlyPaymentDueTemplate,
  monthlyPaymentReminderTemplate,
  ownerMonthlyPaymentDueTemplate,
} from "../templates/paymentMail.template.js"

export const startCronJobs = () => {

  cron.schedule("0 9 1 * *", async () => {
    console.log("[CRON] Running monthly payment generation...")

    try {
      const rentals = await getActiveRentalsForCron()

      const now = new Date()
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      const dueDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split("T")[0]

      let created = 0

      for (const rental of rentals) {
        const idempotencyKey = `monthly-${rental.id}-${monthYear}`

        const payment = await createMonthlyPayment({
          agreement_id: rental.id,
          tenant_id: rental.tenant_id,
          owner_id: rental.owner_id,
          amount: rental.monthly_rent,
          due_date: dueDate,
          month_year: monthYear,
          idempotency_key: idempotencyKey,
        })

        if (!payment) continue

        created++

        await sendMail({
          to: rental.tenant_email,
          subject: `Monthly Rent Due for ${monthYear} - Dwellio`,
          html: monthlyPaymentDueTemplate(rental.monthly_rent, monthYear),
        })

        const owner = await getUserById(rental.owner_id)
        if (owner) {
          await sendMail({
            to: owner.email,
            subject: `Tenant Rent Due for ${monthYear} - Dwellio`,
            html: ownerMonthlyPaymentDueTemplate(
              rental.tenant_name,
              rental.monthly_rent,
              monthYear
            ),
          })
        }
      }

      console.log(`[CRON] Monthly payments created: ${created}/${rentals.length}`)

    } catch (error) {
      console.error("[CRON] Monthly payment generation error:", error.message)
    }
  })


  cron.schedule("0 10 * * *", async () => {
    console.log("[CRON] Running overdue payment reminder check...")

    try {
      const overduePayments = await getUnpaidMonthlyPayments(7)

      let reminded = 0

      for (const payment of overduePayments) {
        const daysOverdue = Math.floor(
          (new Date() - new Date(payment.due_date)) / (1000 * 60 * 60 * 24)
        )

        await sendMail({
          to: payment.tenant_email,
          subject: `Payment Reminder — ${payment.month_year} - Dwellio`,
          html: monthlyPaymentReminderTemplate(
            payment.amount,
            payment.month_year,
            daysOverdue
          ),
        })

        reminded++
      }

      console.log(`[CRON] Reminders sent: ${reminded}`)

    } catch (error) {
      console.error("[CRON] Payment reminder error:", error.message)
    }
  })


  cron.schedule("0 0 * * *", async () => {
    console.log("[CRON] Running expired rental termination...")

    try {
      const result = await terminateExpiredRentalsService()
      console.log(`[CRON] Rentals terminated: ${result.terminated_count}`)
    } catch (error) {
      console.error("[CRON] Rental termination error:", error.message)
    }
  })

  console.log("[CRON] All jobs registered:")
  console.log("  → Monthly payment generation  — 1st of month  @ 09:00")
  console.log("  → Overdue payment reminders   — every day     @ 10:00")
  console.log("  → Expired rental termination  — every day     @ 00:00")
}