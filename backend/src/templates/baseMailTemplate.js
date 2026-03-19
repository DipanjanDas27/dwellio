export const baseTemplate = ({ title, subtitle, content, footerNote, badgeText, badgeColor }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#fef7f2;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef7f2;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 32px rgba(43,27,18,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:#2b1b12;padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:1px;">Dwellio</span>
                    <span style="font-size:11px;font-weight:600;color:#ddc7bb;margin-left:8px;letter-spacing:2px;text-transform:uppercase;">Rental Platform</span>
                  </td>
                  <td align="right">
                    ${badgeText ? `
                    <span style="
                      background:${badgeColor || '#ddc7bb'};
                      color:#2b1b12;
                      font-size:11px;
                      font-weight:700;
                      padding:5px 14px;
                      border-radius:100px;
                      letter-spacing:0.5px;
                      text-transform:uppercase;
                    ">${badgeText}</span>
                    ` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title block -->
          <tr>
            <td style="background:#fbf5f1;padding:28px 36px 20px;border-bottom:1px solid #ddc7bb;">
              <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#2b1b12;line-height:1.3;">${title}</h1>
              ${subtitle ? `<p style="margin:0;font-size:14px;color:#695346;font-weight:600;">${subtitle}</p>` : ""}
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 36px;color:#2b1b12;font-size:15px;line-height:1.7;">
              ${content}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 36px;">
              <div style="height:1px;background:#ddc7bb;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;background:#fbf5f1;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:13px;font-weight:800;color:#2b1b12;">Dwellio</span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:#695346;font-weight:600;">
                      ${footerNote || "This is an automated message. Please do not reply."}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Bottom note -->
        <p style="margin-top:20px;font-size:11px;color:#695346;text-align:center;">
          © ${new Date().getFullYear()} Dwellio · Rental Platform · All rights reserved
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
`

export const infoRow = (label, value) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
    <tr>
      <td style="width:45%;font-size:13px;font-weight:600;color:#695346;padding:10px 14px;background:#fbf5f1;border-radius:8px 0 0 8px;">${label}</td>
      <td style="font-size:13px;font-weight:700;color:#2b1b12;padding:10px 14px;background:#fef7f2;border-radius:0 8px 8px 0;">${value}</td>
    </tr>
  </table>
`


export const ctaButton = (text, url) => `
  <div style="text-align:center;margin-top:28px;">
    <a href="${url}" style="
      display:inline-block;
      background:#2b1b12;
      color:#ffffff;
      font-size:14px;
      font-weight:700;
      padding:13px 32px;
      border-radius:8px;
      text-decoration:none;
      letter-spacing:0.3px;
    ">${text}</a>
  </div>
`


export const amountBlock = (label, amount) => `
  <div style="
    background:#fbf5f1;
    border:1.5px solid #ddc7bb;
    border-radius:12px;
    padding:18px 22px;
    margin:20px 0;
    text-align:center;
  ">
    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#695346;text-transform:uppercase;letter-spacing:1px;">${label}</p>
    <p style="margin:0;font-size:28px;font-weight:800;color:#2b1b12;">₹${Number(amount).toLocaleString("en-IN")}</p>
  </div>
`


export const alertBlock = (message, type = "warning") => {
  const colors = {
    warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
    error:   { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
    success: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  }
  const c = colors[type] || colors.warning
  return `
    <div style="
      background:${c.bg};
      border-left:4px solid ${c.border};
      border-radius:0 8px 8px 0;
      padding:14px 18px;
      margin:20px 0;
      font-size:13px;
      font-weight:600;
      color:${c.text};
    ">${message}</div>
  `
}