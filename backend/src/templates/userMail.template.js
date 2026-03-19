import { baseTemplate, alertBlock } from "./baseMailTemplate.js"

const otpBlock = (otp) => `
  <div style="text-align:center;margin:28px 0;">
    <div style="
      display:inline-block;
      background:#2b1b12;
      color:#fef7f2;
      font-size:32px;
      font-weight:800;
      letter-spacing:10px;
      padding:16px 36px;
      border-radius:12px;
      font-family:'Courier New',monospace;
    ">${otp}</div>
    <p style="margin:12px 0 0;font-size:12px;color:#695346;font-weight:600;letter-spacing:0.5px;">
      DO NOT SHARE THIS CODE WITH ANYONE
    </p>
  </div>
`

export const otpTemplate = (otp) =>
  baseTemplate({
    title: "Your Verification Code",
    subtitle: "Use the code below to complete verification.",
    badgeText: "OTP",
    badgeColor: "#ddc7bb",
    content: `
      <p style="margin:0 0 8px;color:#4f3527;font-weight:600;">
        Enter this code to verify your identity on Dwellio.
      </p>
      ${otpBlock(otp)}
      ${alertBlock("This code expires in 5 minutes. Do not share it with anyone.", "warning")}
    `,
  })

export const forgotPasswordTemplate = (otp) =>
  baseTemplate({
    title: "Password Reset Request",
    subtitle: "Use the code below to reset your password.",
    badgeText: "Reset",
    badgeColor: "#fef3c7",
    content: `
      <p style="margin:0 0 8px;color:#4f3527;font-weight:600;">
        We received a request to reset your Dwellio account password.
      </p>
      ${otpBlock(otp)}
      ${alertBlock("This code expires in 5 minutes. If you did not request a reset, ignore this email.", "warning")}
    `,
  })

export const passwordUpdatedTemplate = () =>
  baseTemplate({
    title: "Password Updated",
    subtitle: "Your account security has been updated.",
    badgeText: "Updated",
    badgeColor: "#bbf7d0",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your Dwellio account password has been changed successfully.
      </p>
      ${alertBlock("If this wasn't you, contact support immediately and reset your password.", "error")}
    `,
  })

export const passwordResetSuccessTemplate = () =>
  baseTemplate({
    title: "Password Reset Successful",
    subtitle: "Your password has been updated.",
    badgeText: "Success",
    badgeColor: "#bbf7d0",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your Dwellio account password has been successfully reset.
        You can now log in with your new password.
      </p>
      ${alertBlock("If this was not you, please contact support immediately.", "error")}
    `,
  })
export const accountDeletedTemplate = () =>
  baseTemplate({
    title: "Account Deleted",
    subtitle: "Your account has been permanently removed.",
    badgeText: "Deleted",
    badgeColor: "#fecaca",
    content: `
      <p style="margin:0 0 16px;color:#4f3527;font-weight:600;">
        Your Dwellio account has been deleted successfully. We're sorry to see you go.
      </p>
      <p style="margin:0;color:#695346;font-size:13px;font-weight:600;">
        If this was a mistake, please contact our support team as soon as possible.
      </p>
    `,
  })