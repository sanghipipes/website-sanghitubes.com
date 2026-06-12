import { SPT_LOGO_DATA_URI } from '../logo'

interface QuoteNotificationData {
  quoteId: string
  customerName: string
  companyName?: string
  email: string
  phone: string
  city?: string
  message?: string
  items: Array<{ productName: string; quantity: number }>
  submittedAt: string
}

export function quoteNotificationHtml(data: QuoteNotificationData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${escHtml(item.productName)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:bold;">${item.quantity}</td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td>
<table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:32px 40px;">
      <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <img src="${SPT_LOGO_DATA_URI}" alt="SPT" width="52" height="52" style="display:block;border-radius:8px;background:#fff;" />
          </td>
          <td style="vertical-align:middle;">
            <div style="color:#ffffff;font-size:18px;font-weight:900;letter-spacing:-0.03em;line-height:1.1;">SANGHI</div>
            <div style="color:#bfdbfe;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Pipes &amp; Tubes</div>
          </td>
        </tr>
      </table>
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">New Quote Request</h1>
      <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px;">Submitted via Sanghi Pipes &amp; Tubes website</p>
    </td>
  </tr>

  <!-- Customer Details -->
  <tr>
    <td style="padding:32px 40px 0;">
      <h2 style="margin:0 0 16px;color:#1e40af;font-size:16px;text-transform:uppercase;letter-spacing:0.05em;">Customer Details</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${row('Name',    data.customerName)}
        ${row('Company', data.companyName || '—')}
        ${row('Email',   data.email)}
        ${row('Phone',   data.phone)}
        ${row('City',    data.city || '—')}
        ${row('Quote ID','#' + data.quoteId.slice(0, 8).toUpperCase())}
      </table>
    </td>
  </tr>

  <!-- Products -->
  <tr>
    <td style="padding:28px 40px 0;">
      <h2 style="margin:0 0 16px;color:#1e40af;font-size:16px;text-transform:uppercase;letter-spacing:0.05em;">Requested Products</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Product</th>
            <th style="padding:10px 12px;text-align:center;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>
    </td>
  </tr>

  <!-- Message -->
  ${data.message ? `
  <tr>
    <td style="padding:28px 40px 0;">
      <h2 style="margin:0 0 12px;color:#1e40af;font-size:16px;text-transform:uppercase;letter-spacing:0.05em;">Message</h2>
      <p style="margin:0;color:#374151;background:#f8fafc;padding:16px;border-radius:8px;border-left:4px solid #2563eb;line-height:1.6;">${escHtml(data.message)}</p>
    </td>
  </tr>` : ''}

  <!-- Footer -->
  <tr>
    <td style="padding:32px 40px;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Received on ${data.submittedAt}</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export function quoteNotificationSubject(customerName: string): string {
  return `New Quote Request from ${customerName} — Sanghi Pipes & Tubes`
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#64748b;font-size:14px;width:120px;vertical-align:top;">${label}</td>
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
