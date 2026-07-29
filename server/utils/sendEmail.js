const nodemailer = require("nodemailer");
const path = require("path");

// Ensure environment variables from server/.env are loaded regardless of execution context
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), override: true });

/**
 * Sends an email using Nodemailer from EMAIL_USER to user's entered email address.
 * Supports both object parameter ({ to, subject, text, html }) and positional parameters (to, subject, text, html).
 */
const sendEmail = async (options, subjectArg, textArg, htmlArg) => {
  {console.log(options , "options")}
  try {
    let to, subject, text, html;

    if (typeof options === "object" && options !== null && !Array.isArray(options)) {
      to = options.to;
      subject = options.subject;
      text = options.text;
      html = options.html;
    } else {
      to = options;
      subject = subjectArg;
      text = textArg;
      html = htmlArg;
    }

    if (!to) {
      throw new Error("Recipient email address is required.");
    }

    // Credentials used for authentication (from server/.env file)
    const rawUser = process.env.EMAIL_USER || process.env.SMTP_USER || "";
    const rawPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || "";

    const smtpUser = (rawUser || "").trim();
    // Strip spaces from App Password (e.g. "urmz hvbw gygm cfpl" -> "urmzhvbwgygmcfpl")
    const smtpPass = (rawPass || "").replace(/\s+/g, "");

    if (!smtpUser || !smtpPass) {
      throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment configuration.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser, // Sender email address from .env file
        pass: smtpPass, // Sender App password from .env file
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Velora Store" <${smtpUser}>`, // Sent from store email (.env)
      to: to,                              // Sent to client email filled in place order form
      subject: subject || "Velora Store Verification Code",
      text: text || "Your OTP verification code.",
      html: html || `<p>${text || "Your verification code is ready."}</p>`,
    });

    console.log(`\n========================================`);
    console.log(`[NODEMAILER SUCCESS] Email sent to: ${to}`);
    console.log(`[NODEMAILER SUCCESS] Message ID: ${info.messageId}`);
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

