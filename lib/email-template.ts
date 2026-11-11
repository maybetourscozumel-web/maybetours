// Shared branded layout for transactional emails. Table-based markup with
// inline styles only — required for consistent rendering across email
// clients (Gmail, Outlook, Apple Mail), which don't support external CSS,
// flexbox or grid reliably.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const FONT_STACK = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function renderEmailLayout(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6efe0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efe0;padding:32px 16px;font-family:${FONT_STACK};">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#0b3c66;padding:28px 32px;text-align:center;">
                <img src="${SITE_URL}/brand/logo-white.png" alt="May-Be Tours Cozumel" width="52" style="display:block;margin:0 auto 10px;border:0;" />
                <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">May-Be Tours Cozumel</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background:#f6efe0;padding:20px 32px;text-align:center;">
                <p style="margin:0;color:#0b3c66;font-size:12px;line-height:1.5;">
                  Marina Cozumel ASIPONA<br />Cozumel, Quintana Roo, México
                </p>
                <p style="margin:8px 0 0;font-size:12px;">
                  <a href="https://wa.me/529871052528" style="color:#0e90a6;text-decoration:none;font-weight:700;">
                    WhatsApp +52 987 105 2528
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#e42313;color:#ffffff;font-weight:700;font-size:14px;padding:13px 30px;border-radius:999px;text-decoration:none;">${label}</a>`;
}

export function detailRow(label: string, value: string, { last = false }: { last?: boolean } = {}): string {
  const border = last ? "" : "border-bottom:1px solid #f0ece0;";
  return `<tr>
    <td style="padding:10px 0;color:#6b7280;font-size:14px;${border}">${label}</td>
    <td style="padding:10px 0;color:#0b3c66;font-size:14px;font-weight:700;text-align:right;${border}">${value}</td>
  </tr>`;
}

export { SITE_URL };
