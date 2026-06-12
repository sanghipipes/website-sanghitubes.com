import { SPT_LOGO_DATA_URI } from '../logo'

interface QuoteConfirmationData {
  customerName: string
  items: Array<{ productName: string; quantity: number }>
}

export function quoteConfirmationHtml(data: QuoteConfirmationData): string {
  const itemsList = data.items
    .map(
      (item) => `
      <li style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#374151;">
        <strong>${escHtml(item.productName)}</strong>
        <span style="color:#64748b;"> &times; ${item.quantity}</span>
      </li>`
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
    <td style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:40px;">
      <table cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <img src="${SPT_LOGO_DATA_URI}" alt="SPT" width="56" height="56" style="display:block;border-radius:8px;background:#fff;" />
          </td>
          <td style="vertical-align:middle;">
            <div style="color:#ffffff;font-size:20px;font-weight:900;letter-spacing:-0.03em;line-height:1.1;">SANGHI</div>
            <div style="color:#bfdbfe;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Pipes &amp; Tubes</div>
          </td>
        </tr>
      </table>
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Quote Request Received</h1>
      <p style="margin:8px 0 0;color:#bfdbfe;font-size:15px;">Thank you for choosing Sanghi Pipes &amp; Tubes</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:40px;">
      <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
        Dear <strong>${escHtml(data.customerName)}</strong>,
      </p>
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
        We have received your quote request for the following items. Our technical team will review
        your selection and get back to you with a detailed estimate within <strong>24 business hours</strong>.
      </p>

      <!-- Items -->
      <div style="background:#f8fafc;border-radius:8px;padding:20px 24px;margin:0 0 28px;">
        <h3 style="margin:0 0 12px;color:#1e40af;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Your Quote Summary</h3>
        <ul style="margin:0;padding:0;list-style:none;">${itemsList}</ul>
      </div>

      <!-- Contact block -->
      <div style="background:#eff6ff;border-radius:8px;padding:20px 24px;border-left:4px solid #2563eb;">
        <p style="margin:0 0 8px;color:#1e40af;font-weight:700;font-size:15px;">Need to reach us sooner?</p>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.8;">
          📞 <a href="tel:+917971549587" style="color:#1e40af;text-decoration:none;">+91 7971549587</a><br>
          ✉️ <a href="mailto:info@sanghitubes.com" style="color:#1e40af;text-decoration:none;">info@sanghitubes.com</a><br>
          🕐 Mon–Sat, 9:00 AM – 7:00 PM
        </p>
      </div>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:0 40px 32px;border-top:1px solid #e2e8f0;">
      <p style="margin:24px 0 4px;color:#94a3b8;font-size:12px;">
        Sanghi Pipes &amp; Tubes<br>
        B No 79/8, Latouche Road, Kanpur, Uttar Pradesh 208002
      </p>
      <p style="margin:0;color:#cbd5e1;font-size:11px;">
        This is an automated confirmation. Please do not reply to this email.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export function quoteConfirmationSubject(): string {
  return 'Your Quote Request — Sanghi Pipes & Tubes'
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
