import { baseTemplate, infoRow, amountBlock, alertBlock } from "./baseMailTemplate.js"

export const rentalCreatedTemplate = () =>
  baseTemplate({
    title:     "Rental Request Submitted",
    subtitle:  "Your rental is under processing.",
    badgeText: "Submitted",
    badgeColor: "#ddc7bb",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your rental request has been recorded successfully on Dwellio.
      </p>
      ${alertBlock("Your rental will be activated automatically once the security deposit payment is confirmed.", "warning")}
    `,
  })

export const ownerRentalRequestTemplate = (propertyTitle, tenantName) =>
  baseTemplate({
    title:     "New Rental Request",
    subtitle:  "A tenant has requested your property.",
    badgeText: "New Request",
    badgeColor: "#ddc7bb",
    content: `
      <p style="margin:0 0 20px;color:#4f3527;font-weight:600;">
        A new rental request has been submitted for your property on Dwellio.
      </p>
      ${infoRow("Property", propertyTitle)}
      ${infoRow("Tenant", tenantName)}
      <p style="margin:16px 0 0;color:#695346;font-size:13px;font-weight:600;">
        The rental will be activated automatically once the security deposit payment clears.
      </p>
    `,
  })

export const rentalActivatedTemplate = () =>
  baseTemplate({
    title:     "Rental Activated 🎉",
    subtitle:  "Your agreement is now active.",
    badgeText: "Active",
    badgeColor: "#bbf7d0",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Congratulations! Your rental agreement is now active on Dwellio.
        You can manage your rental and track monthly payments from your dashboard.
      </p>
      ${alertBlock("Monthly rent reminders will be sent to you at the start of each month.", "success")}
    `,
  })

export const ownerRentalActivatedTemplate = (propertyTitle) =>
  baseTemplate({
    title:     "Your Property Is Now Rented",
    subtitle:  "A tenant has successfully activated a rental.",
    badgeText: "Rented",
    badgeColor: "#bbf7d0",
    content: `
      <p style="margin:0 0 20px;color:#4f3527;font-weight:600;">
        Great news! Your property has been successfully rented out on Dwellio.
      </p>
      ${infoRow("Property", propertyTitle)}
    `,
  })

export const rentalRenewedTemplate = () =>
  baseTemplate({
    title:     "Rental Renewed Successfully",
    subtitle:  "Your rental agreement has been extended.",
    badgeText: "Renewed",
    badgeColor: "#bbf7d0",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your rental has been renewed and is now active for the new period.
        Log in to your Dwellio dashboard to view the updated details.
      </p>
    `,
  })

export const ownerRentalRenewedTemplate = (propertyTitle) =>
  baseTemplate({
    title:     "Rental Renewed by Tenant",
    subtitle:  "A tenant has renewed their rental agreement.",
    badgeText: "Renewed",
    badgeColor: "#bbf7d0",
    content: `
      ${infoRow("Property", propertyTitle)}
    `,
  })

export const rentalTerminatedTemplate = () =>
  baseTemplate({
    title:     "Rental Terminated",
    subtitle:  "Your rental agreement has ended.",
    badgeText: "Terminated",
    badgeColor: "#fecaca",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your rental agreement has been terminated.
      </p>
      ${alertBlock("If this was unexpected, please contact support immediately.", "error")}
    `,
  })

export const ownerRentalTerminatedTemplate = (propertyTitle) =>
  baseTemplate({
    title:     "Rental Agreement Ended",
    subtitle:  "A rental agreement for your property has been terminated.",
    badgeText: "Terminated",
    badgeColor: "#fecaca",
    content: `
      ${infoRow("Property", propertyTitle)}
    `,
  })

export const rentalCancelledTemplate = () =>
  baseTemplate({
    title:     "Rental Cancelled",
    subtitle:  "Your rental request has been cancelled.",
    badgeText: "Cancelled",
    badgeColor: "#e5e7eb",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your rental request has been cancelled successfully.
      </p>
      ${alertBlock("If a payment was made, refund processing will begin shortly.", "warning")}
    `,
  })

export const ownerRentalCancelledTemplate = (propertyTitle) =>
  baseTemplate({
    title:     "Rental Request Cancelled",
    subtitle:  "A rental request for your property was cancelled.",
    badgeText: "Cancelled",
    badgeColor: "#e5e7eb",
    content: `
      ${infoRow("Property", propertyTitle)}
    `,
  })