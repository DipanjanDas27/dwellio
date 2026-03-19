import { baseTemplate, infoRow, amountBlock, ctaButton, alertBlock } from "./baseMailTemplate.js"

export const paymentCreatedTemplate = (amount) =>
  baseTemplate({
    title:     "Payment Initiated",
    subtitle:  "Your payment is being processed.",
    badgeText: "Processing",
    badgeColor: "#fef3c7",
    content: `
      ${amountBlock("Amount", amount)}
      <p style="margin:0;color:#695346;font-weight:600;font-size:13px;text-align:center;">
        Your transaction is currently being processed. You will be notified once confirmed.
      </p>
    `,
  })

export const paymentSuccessTemplate = (amount) =>
  baseTemplate({
    title:     "Payment Successful",
    subtitle:  "Your transaction was completed successfully.",
    badgeText: "Success",
    badgeColor: "#bbf7d0",
    content: `
      ${amountBlock("Amount Paid", amount)}
      ${alertBlock("Payment confirmed and recorded. Thank you for using Dwellio.", "success")}
    `,
  })

export const paymentFailedTemplate = (amount) =>
  baseTemplate({
    title:     "Payment Failed",
    subtitle:  "We were unable to process your payment.",
    badgeText: "Failed",
    badgeColor: "#fecaca",
    content: `
      ${amountBlock("Amount", amount)}
      ${alertBlock("Your payment could not be processed. Please retry from your Dwellio dashboard.", "error")}
    `,
  })

export const refundTemplate = (amount) =>
  baseTemplate({
    title:     "Refund Processed",
    subtitle:  "Your payment has been successfully refunded.",
    badgeText: "Refunded",
    badgeColor: "#ddd6fe",
    content: `
      ${amountBlock("Refund Amount", amount)}
      <p style="margin:12px 0 0;color:#695346;font-weight:600;font-size:13px;text-align:center;">
        Please allow 3–5 business days for the amount to reflect in your account.
      </p>
    `,
  })

export const ownerPaymentReceivedTemplate = (tenantName, amount) =>
  baseTemplate({
    title:     "Payment Received",
    subtitle:  "A tenant has completed a payment.",
    badgeText: "Received",
    badgeColor: "#bbf7d0",
    content: `
      ${amountBlock("Amount Received", amount)}
      ${infoRow("From", tenantName)}
    `,
  })

export const monthlyPaymentDueTemplate = (amount, monthYear) =>
  baseTemplate({
    title:     `Monthly Rent Due — ${monthYear}`,
    subtitle:  "Your monthly rent payment is due for this period.",
    badgeText: "Due",
    badgeColor: "#fef3c7",
    content: `
      ${amountBlock("Amount Due", amount)}
      ${infoRow("Period", monthYear)}
      ${alertBlock("Please complete your payment before the end of the month to avoid reminders.", "warning")}
    `,
  })

export const monthlyPaymentReminderTemplate = (amount, monthYear, daysOverdue) =>
  baseTemplate({
    title:     "Payment Reminder",
    subtitle:  `Your rent for ${monthYear} is ${daysOverdue} days overdue.`,
    badgeText: "Overdue",
    badgeColor: "#fecaca",
    content: `
      ${amountBlock("Overdue Amount", amount)}
      ${infoRow("Period", monthYear)}
      ${infoRow("Days Overdue", `${daysOverdue} days`)}
      ${alertBlock("Please log in to your Dwellio dashboard and complete this payment as soon as possible.", "error")}
    `,
  })

export const ownerMonthlyPaymentDueTemplate = (tenantName, amount, monthYear) =>
  baseTemplate({
    title:     "Tenant Rent Due",
    subtitle:  `Monthly rent has been generated for ${tenantName}.`,
    badgeText: "Pending",
    badgeColor: "#fef3c7",
    content: `
      ${amountBlock("Monthly Rent", amount)}
      ${infoRow("Tenant", tenantName)}
      ${infoRow("Period", monthYear)}
      <p style="margin:16px 0 0;color:#695346;font-size:13px;font-weight:600;">
        Your tenant has been notified. You will receive confirmation once payment is completed.
      </p>
    `,
  })