import createTransporter from "../config/nodemailer.js";

const SENDER_EMAIL = process.env.SENDER_EMAIL;

const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
}
};

export default sendMail;
