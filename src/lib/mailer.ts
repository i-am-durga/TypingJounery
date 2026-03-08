import nodemailer from "nodemailer";

// Create a fresh transporter on each call so env vars are always current
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "a43f9e001@smtp-brevo.com",
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendOTPEmail(to: string, otp: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your TypingJounery account</title>
    </head>
    <body style="margin:0;padding:0;background:#0A0F1E;font-family:'Segoe UI',system-ui,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:40px 20px;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#00E5FF22,#7c3aed22);padding:40px 40px 30px;text-align:center;border-bottom:1px solid #1e293b;">
                <div style="font-size:32px;font-weight:900;color:#00E5FF;letter-spacing:-1px;margin-bottom:4px;">TypingJounery⌨️</div>
                <div style="color:#64748b;font-size:14px;">Typing Master Platform</div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 12px;">Hi ${name}, verify your email 👋</h2>
                <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 32px;">
                  Use the code below to verify your email address and activate your TypingJounery account. This code expires in <strong style="color:#f1f5f9;">10 minutes</strong>.
                </p>
                <div style="background:#0A0F1E;border:2px solid #00E5FF33;border-radius:12px;padding:28px;text-align:center;margin:0 0 32px;">
                  <div style="letter-spacing:16px;font-size:40px;font-weight:900;color:#00E5FF;font-family:monospace;">${otp}</div>
                  <div style="color:#64748b;font-size:12px;margin-top:12px;letter-spacing:2px;text-transform:uppercase;">Verification Code</div>
                </div>
                <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
                  If you didn't request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px;background:#0A0F1E;border-top:1px solid #1e293b;text-align:center;">
                <div style="color:#475569;font-size:12px;">© 2024 TypingJounery · All rights reserved</div>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

  const transporter = createTransporter();
  console.log("[Mailer] Sending OTP to:", to, "via", process.env.EMAIL_HOST, "user:", process.env.EMAIL_USER);

  try {
    const info = await transporter.sendMail({
      from: `"TypingJounery" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: `${otp} is your TypingJounery verification code`,
      html,
    });
    console.log("[Mailer] OTP sent! Message ID:", info.messageId);
  } catch (err) {
    console.error("[Mailer] FAILED to send OTP email:", err);
    throw err;
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your TypingJounery password</title>
    </head>
    <body style="margin:0;padding:0;background:#0A0F1E;font-family:'Segoe UI',system-ui,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:40px 20px;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#7c3aed22,#00E5FF22);padding:40px 40px 30px;text-align:center;border-bottom:1px solid #1e293b;">
                <div style="font-size:32px;font-weight:900;color:#00E5FF;letter-spacing:-1px;margin-bottom:4px;">TypingJounery⌨️</div>
                <div style="color:#64748b;font-size:14px;">Typing Master Platform</div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 12px;">Reset your password 🔐</h2>
                <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 32px;">
                  Hi <strong style="color:#f1f5f9;">${name}</strong>, click the button below to reset your password. This link expires in <strong style="color:#f1f5f9;">15 minutes</strong>.
                </p>
                <div style="text-align:center;margin:0 0 32px;">
                  <a href="${resetUrl}" style="display:inline-block;background:#00E5FF;color:#0A0F1E;font-weight:800;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:10px;">
                    Reset My Password →
                  </a>
                </div>
                <p style="color:#64748b;font-size:12px;line-height:1.6;margin:0;word-break:break-all;">
                  Or paste: <span style="color:#00E5FF;">${resetUrl}</span>
                </p>
                <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
                <p style="color:#475569;font-size:13px;">If you didn't request this, ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px;background:#0A0F1E;border-top:1px solid #1e293b;text-align:center;">
                <div style="color:#475569;font-size:12px;">© 2024 TypingJounery · All rights reserved</div>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

  const transporter = createTransporter();
  console.log("[Mailer] Sending reset email to:", to);

  try {
    const info = await transporter.sendMail({
      from: `"TypingJounery" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: "Reset your TypingJounery password",
      html,
    });
    console.log("[Mailer] Reset email sent! Message ID:", info.messageId);
  } catch (err) {
    console.error("[Mailer] FAILED to send reset email:", err);
    throw err;
  }
}
