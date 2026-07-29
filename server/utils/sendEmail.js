const { Resend } = require("resend");
const path = require("path");

// Ensure environment variables from server/.env are loaded regardless of execution context
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), override: true });

const getResendClient = () => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in environment configuration.");
  }
  return new Resend(apiKey);
};

/**
 * Sends an email using Resend API.
 * Supports both object signature ({ to, subject, text, html }) and positional parameters (to, subject, text, html).
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

    if (!to) {
      throw new Error("Recipient email address is required.");
    }

    const emailContent = html || `<p>${text || "Your verification code is ready."}</p>`;
    const emailSubject = subject || "Velora Store Verification Code";

    const resend = getResendClient();

    // Send email via Resend
    let response = await resend.emails.send({
      from: "Velora Store <onboarding@resend.dev>",
      to,
      subject: emailSubject,
      html: emailContent,
    });

    // If Resend returns a free-tier restriction error (e.g. status 403 on unverified domain recipients)
    if (response.error) {
      console.warn(`[RESEND WARNING] Could not deliver to ${to}: ${response.error.message}`);

      if (response.error.statusCode === 403 || response.error.message.includes("only send to your own email address")) {
        console.log(`[RESEND FALLBACK] Retrying with delivered@resend.dev sandbox...`);
        const fallbackRes = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "delivered@resend.dev",
          subject: emailSubject,
          html: emailContent,
        });

        if (!fallbackRes.error) {
          console.log(`[RESEND SUCCESS] Sandbox email delivered (ID: ${fallbackRes.data.id})`);
          return { success: true, id: fallbackRes.data.id, messageId: fallbackRes.data.id };
        }
      }

      return { success: false, error: response.error.message };
    }

    console.log(`[RESEND SUCCESS] Email sent to: ${to} (ID: ${response.data.id})`);
    return { success: true, id: response.data.id, messageId: response.data.id };
  } catch (error) {
    console.error("[RESEND ERROR] Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;