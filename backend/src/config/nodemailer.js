import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
};

export default createTransporter;
