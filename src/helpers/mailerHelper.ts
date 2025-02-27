import nodemailer from 'nodemailer';
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, text:string, html: string) {

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("SMTP_USER and SMTP_PASS are required to send emails");
    
    throw new Error("SMTP_USER and SMTP_PASS are required to send emails");
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error(error);
  }
}