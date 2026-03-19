import { baseTemplate, infoRow, alertBlock } from "./baseMailTemplate.js"

export const propertyCreatedTemplate = (title) =>
  baseTemplate({
    title:     "Property Listed Successfully",
    subtitle:  "Your property is now live on Dwellio.",
    badgeText: "Live",
    badgeColor: "#bbf7d0",
    content: `
      <p style="margin:0 0 20px;color:#4f3527;font-weight:600;">
        Your property has been successfully listed on Dwellio and is now visible to tenants.
      </p>
      ${infoRow("Property", title)}
      ${alertBlock("You will be notified when a tenant submits a rental request.", "success")}
    `,
  })