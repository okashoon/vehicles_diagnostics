import { Resend } from "resend";

const FROM = "noreply@crashpulse.com";

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  // Lazy init — runs at request time, not build time
  const resend = new Resend(process.env.RESEND_API_KEY);
  const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${BASE_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your Crash Pulse account",
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:monospace;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="480" cellpadding="0" cellspacing="0"
               style="border:1px solid #00ff4133;background:#111111;max-width:480px;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #00ff4120;">
              <p style="margin:0;color:#00ff41;font-size:11px;letter-spacing:0.3em;">
                // CRASH_PULSE_TECHNOLOGIES
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;color:#e0ffe0;font-size:20px;font-weight:900;
                          letter-spacing:0.1em;">EMAIL VERIFICATION</h1>
              <p style="margin:0 0 24px;color:#00cc33;font-size:13px;line-height:1.6;">
                &gt; Click the button below to verify your email address.<br/>
                &gt; This link expires in <strong style="color:#e0ffe0;">24 hours</strong>.
              </p>
              <a href="${verifyUrl}"
                 style="display:inline-block;background:#00ff41;color:#0a0a0a;
                        font-family:monospace;font-weight:900;font-size:13px;
                        letter-spacing:0.15em;text-decoration:none;
                        padding:14px 32px;border:none;">
                [ VERIFY_EMAIL ]
              </a>
              <p style="margin:32px 0 0;color:#00ff4160;font-size:11px;line-height:1.5;">
                If you didn&apos;t create a Crash Pulse account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #00ff4120;">
              <p style="margin:0;color:#00ff4130;font-size:10px;letter-spacing:0.2em;">
                &copy; ${new Date().getFullYear()} CRASH_PULSE_TECHNOLOGIES :: ALL_RIGHTS_RESERVED
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
