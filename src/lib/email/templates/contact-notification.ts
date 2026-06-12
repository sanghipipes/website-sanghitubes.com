interface ContactNotificationData {
  name: string
  email: string
  subject: string | null
  message: string
  receivedAt: string
}

export function contactNotificationHtml(data: ContactNotificationData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td>
<table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <tr>
    <td style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">New Contact Message</h1>
      <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px;">From Sanghi Pipes &amp; Tubes website</p>
    </td>
  </tr>

  <tr>
    <td style="padding:32px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        ${infoRow('From',    data.name)}
        ${infoRow('Email',   data.email)}
        ${infoRow('Subject', data.subject || 'General Inquiry')}
      </table>

      <h2 style="margin:0 0 12px;color:#1e40af;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Message</h2>
      <div style="background:#f8fafc;padding:20px;border-radius:8px;border-left:4px solid #2563eb;">
        <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escHtml(data.message)}</p>
      </div>

      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;">Received on ${data.receivedAt}</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export function contactNotificationSubject(name: string): string {
  return `New Contact Message from ${name} — Sanghi Pipes & Tubes`
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#64748b;font-size:14px;width:100px;">${label}</td>
    <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${escHtml(value)}</td>
  </tr>`
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
