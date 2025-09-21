// File: W:\Amazone-clone2\my-app\src\lib\mailer.ts
import nodemailer from "nodemailer";

// Create reusable transporter object
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // e.g., smtp.gmail.com
  port: Number(process.env.SMTP_PORT),  // e.g., 465
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,        // your email address
    pass: process.env.SMTP_PASS,        // email password or app password
  },
});

// Function to send email
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"MyShop" <${process.env.SMTP_USER}>`, // sender address
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return { ok: true, info };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { ok: false, error };
  }
}
