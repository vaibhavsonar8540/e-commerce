const nodemailer = require("nodemailer");

/**
 * Creates and returns a Nodemailer transporter instance.
 */
const createTransporter = async () => {
  const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
  const smtpPass = rawPass.replace(/\s+/g, "");

  if (smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Fallback: Generate real working Ethereal SMTP test account
  console.log("[NODEMAILER] No custom SMTP credentials in .env. Creating Ethereal test account...");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Sends an email using Nodemailer.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await createTransporter();
    const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();

    const senderEmail = smtpUser || "velozaestore@gmail.com";
    const senderName = process.env.SMTP_FROM_NAME || "Velora Store";

    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject,
      text: text || "Your verification OTP code for checkout.",
      html: html || `<p>Your verification code is ready.</p>`,
    });

    console.log(`\n========================================`);
    console.log(`[NODEMAILER] Email successfully sent to: ${to}`);
    console.log(`[NODEMAILER] Subject: ${subject}`);
    console.log(`[NODEMAILER] Message ID: ${info.messageId}`);
    console.log(`========================================\n`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[NODEMAILER ERROR] Failed to send email:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmail;
