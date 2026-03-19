import { baseTemplate, alertBlock } from "./baseMailTemplate.js"

export const registerTemplate = (name) =>
  baseTemplate({
    title:     "Welcome to Dwellio 🎉",
    subtitle:  "Your account has been successfully created.",
    badgeText: "Welcome",
    badgeColor: "#bbf7d0",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="margin:0 0 20px;color:#4f3527;font-weight:600;">
        We're excited to have you on board. You can now explore properties,
        manage rentals, and make secure payments — all from your Dwellio dashboard.
      </p>
      ${alertBlock("Your account is verified and ready to use.", "success")}
    `,
  })

export const loginTemplate = () =>
  baseTemplate({
    title:     "New Login Detected",
    subtitle:  "We noticed a new login to your account.",
    badgeText: "Security Alert",
    badgeColor: "#fef3c7",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your Dwellio account was just accessed.
      </p>
      ${alertBlock("If this was you, no action is required. If not, please reset your password immediately.", "warning")}
    `,
  })

