const nodemailer = require("nodemailer");

/**
 * Sends an email using Nodemailer from process.env.EMAIL_USER to user's entered email.
 * Supports both object signature ({ to, subject, text, html }) and positional signature (to, subject, text, html).
 */
const sendEmail = async (options, subjectArg, textArg, htmlArg) => {
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

    const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
    const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
    // Strip spaces from App Password (e.g. "eeyp ngcj nbov bmic" -> "eeypngcjnbovbmic")
    const smtpPass = rawPass.replace(/\s+/g, "");

    if (!smtpUser || !smtpPass) {
      throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment configuration.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Velora Store" <${smtpUser}>`,
      to,
      subject,
      text: text || "Your verification OTP code for checkout.",
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
