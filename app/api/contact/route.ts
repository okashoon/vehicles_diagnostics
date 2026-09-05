import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, message } = await req.json();

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name and email are required." },
      { status: 400 }
    );
  }

  const first = String(firstName).trim();
  const last = String(lastName).trim();
  const fromEmail = String(email).trim();
  const phoneVal = typeof phone === "string" && phone.trim() ? phone.trim() : null;
  const messageVal = typeof message === "string" && message.trim() ? message.trim() : null;

  try {
    await pool.query(
      `INSERT INTO contacts (first_name, last_name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [first, last, fromEmail, phoneVal, messageVal]
    );
  } catch (err) {
    console.error("[contact] failed to save contact:", err);
    return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const senderEmail = process.env.SENDER_EMAIL;
  if (adminEmail && senderEmail && process.env.RESEND_API_KEY) {
    try {
      const senderName = process.env.SENDER_NAME?.trim() || "Crash Pulse | Contact";
      const from = senderEmail.includes("<")
        ? senderEmail
        : `${senderName} <${senderEmail}>`;

      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from,
        to: adminEmail,
        replyTo: fromEmail,
        subject: `New contact from ${first} ${last}`,
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:monospace;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="520" cellpadding="0" cellspacing="0"
               style="border:1px solid #00ff4133;background:#111111;max-width:520px;">
          <tr>
            <td style="padding:24px 32px 16px;border-bottom:1px solid #00ff4120;">
              <p style="margin:0;color:#00ff41;font-size:11px;letter-spacing:0.3em;">
                // CRASH_PULSE :: CONTACT_FORM_SUBMISSION
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("FIRST_NAME", first)}
                ${row("LAST_NAME",  last)}
                ${row("EMAIL",      `<a href="mailto:${fromEmail}" style="color:#00ff41;">${fromEmail}</a>`)}
                ${phoneVal ? row("PHONE", phoneVal) : ""}
                ${messageVal ? row("MESSAGE", messageVal.replace(/\n/g, "<br/>")) : ""}
              </table>
            </td>
          </tr>
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
</html>`,
      });
      if (error) console.error("[contact] Resend error:", error);
    } catch (err) {
      console.error("[contact] Resend error:", err);
    }
  } else {
    console.error("[contact] email skipped — ADMIN_EMAIL / SENDER_EMAIL / RESEND_API_KEY missing");
  }

  return NextResponse.json({ ok: true });
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 0;vertical-align:top;width:130px;">
        <span style="color:#00ff41;font-size:10px;letter-spacing:0.2em;">${label}</span>
      </td>
      <td style="padding:6px 0;vertical-align:top;">
        <span style="color:#e0ffe0;font-size:13px;">${value}</span>
      </td>
    </tr>`;
}
