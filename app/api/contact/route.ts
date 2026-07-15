import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, message } = await req.json();

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name and email are required." },
      { status: 400 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const senderEmail = process.env.SENDER_EMAIL;
  if (!adminEmail || !senderEmail) {
    console.error("[contact] ADMIN_EMAIL env var is not set");
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: senderEmail,
    to: adminEmail,
    replyTo: email,
    subject: `New contact from ${firstName} ${lastName}`,
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
                ${row("FIRST_NAME", firstName)}
                ${row("LAST_NAME",  lastName)}
                ${row("EMAIL",      `<a href="mailto:${email}" style="color:#00ff41;">${email}</a>`)}
                ${phone ? row("PHONE", phone) : ""}
                ${message ? row("MESSAGE", message.replace(/\n/g, "<br/>")) : ""}
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

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
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
