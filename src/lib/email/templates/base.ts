/** Shared HTML shell for all withSahib emails */
export function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>withSahib</title>
<style>
  body { margin:0; padding:0; background:#06090F; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#E8EDF5; }
  * { box-sizing:border-box; }
  a { color:#00C896; text-decoration:none; }
  a:hover { text-decoration:underline; }
</style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#06090F; padding:40px 20px;">
  <tr><td align="center">
    <table width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0">

      <!-- HEADER -->
      <tr>
        <td style="padding:0 0 32px 0; text-align:center;">
          <a href="https://www.withsahib.com" style="text-decoration:none; display:inline-block;">
            <span style="font-size:22px; font-weight:300; color:#E8EDF5;">with</span><span style="font-size:22px; font-weight:700; color:#00C896;">Sahib</span><span style="font-size:22px; font-weight:300; color:#E8EDF5;">.com</span>
          </a>
        </td>
      </tr>

      <!-- CARD -->
      <tr>
        <td style="background:#141F2E; border:1px solid #1A2333; border-radius:16px; padding:40px 36px;">
          ${content}
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding:28px 0 0 0; text-align:center;">
          <p style="margin:0 0 8px 0; font-size:12px; color:#6B8AAA; letter-spacing:1px; font-family:monospace;">
            SEBI RA · INH000026266 · Sahib Singh Hora
          </p>
          <p style="margin:0; font-size:11px; color:#4A6075;">
            <a href="https://www.withsahib.com" style="color:#4A6075;">withSahib.com</a>
            &nbsp;·&nbsp;
            <a href="https://www.withsahib.com/faq" style="color:#4A6075;">FAQ</a>
            &nbsp;·&nbsp;
            <a href="https://www.withsahib.com/contact" style="color:#4A6075;">Contact</a>
          </p>
          <p style="margin:12px 0 0 0; font-size:10px; color:#2E4055; line-height:1.6;">
            Investments in securities markets are subject to market risks.<br/>
            SEBI registration does not guarantee returns. Read all disclosures carefully.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 12px 0; font-size:28px; font-weight:400; color:#E8EDF5; line-height:1.2;">${text}</h1>`
}

export function subheading(text: string): string {
  return `<p style="margin:0 0 28px 0; font-size:15px; color:#8FA8C0; line-height:1.7;">${text}</p>`
}

export function divider(): string {
  return `<hr style="border:none; border-top:1px solid #1A2333; margin:28px 0;" />`
}

export function primaryButton(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block; padding:14px 32px; background:#00C896; color:#031A13; border-radius:10px; font-weight:600; font-size:15px; text-decoration:none; margin:8px 0;">${label}</a>`
}

export function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0; font-size:13px; color:#8FA8C0; width:40%;">${label}</td>
    <td style="padding:8px 0; font-size:13px; color:#E8EDF5; font-weight:500;">${value}</td>
  </tr>`
}
