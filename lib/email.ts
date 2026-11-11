import { Resend } from "resend";
import { renderEmailLayout, emailButton, detailRow, SITE_URL } from "./email-template";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM || "May-Be Tours Cozumel <bookings@maybetours.com>";
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || "info@maybetours.com";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

/** Sends via Resend if configured; otherwise logs so local dev / demoing still works. */
async function sendEmail({ to, subject, html }: SendEmailArgs) {
  if (!resend) {
    console.log(`[email:skipped - no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[email:error]", err);
  }
}

export async function sendBookingConfirmationEmail(params: {
  to: string;
  customerName: string;
  tourName: string;
  date: string;
  partySize: number;
  totalPriceMXN: number;
  bookingId: string;
}) {
  const { to, customerName, tourName, date, partySize, totalPriceMXN, bookingId } = params;

  const body = `
    <p style="margin:0 0 4px;color:#0e90a6;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Booking confirmed</p>
    <h1 style="margin:0 0 16px;color:#0b3c66;font-size:24px;line-height:1.3;">You're all set, ${customerName}! 🤿</h1>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      Thanks for booking with May-Be Tours Cozumel. Here are your trip details — save this email
      for your records.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${detailRow("Tour", tourName)}
      ${detailRow("Date", date)}
      ${detailRow("Party size", String(partySize))}
      ${detailRow("Total", `$${totalPriceMXN.toLocaleString()} MXN`)}
      ${detailRow("Booking reference", bookingId, { last: true })}
    </table>
    <div style="text-align:center;margin-bottom:24px;">
      ${emailButton(`${SITE_URL}/booking/confirmation?bookingId=${bookingId}`, "View Booking")}
    </div>
    <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
      <strong>Meeting point:</strong> Marina Cozumel ASIPONA, Carr. Costera Sur Km 6.5, Zona
      Hotelera Sur, Cozumel. Please arrive about 15–20 minutes before your departure time.
    </p>
    <p style="margin:16px 0 0;color:#374151;font-size:14px;line-height:1.6;">
      Questions before your trip? Message us anytime on WhatsApp — we're happy to help.
    </p>
  `;

  await sendEmail({
    to,
    subject: `Booking confirmed — ${tourName} | May-Be Tours Cozumel`,
    html: renderEmailLayout(body),
  });
}

export async function sendAdminBookingAlert(params: {
  tourName: string;
  date: string;
  partySize: number;
  customerName: string;
  email: string;
  phone: string;
  totalPriceMXN: number;
  source: "ONLINE" | "MANUAL";
}) {
  const { tourName, date, partySize, customerName, email, phone, totalPriceMXN, source } = params;

  const body = `
    <p style="margin:0 0 4px;color:#e42313;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">
      New ${source === "ONLINE" ? "online" : "manual"} booking
    </p>
    <h1 style="margin:0 0 20px;color:#0b3c66;font-size:22px;line-height:1.3;">${tourName}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${detailRow("Date", date)}
      ${detailRow("Party size", String(partySize))}
      ${detailRow("Customer", customerName)}
      ${detailRow("Email", email)}
      ${detailRow("Phone", phone)}
      ${detailRow("Total", `$${totalPriceMXN.toLocaleString()} MXN`, { last: true })}
    </table>
    <div style="text-align:center;">
      ${emailButton(`${SITE_URL}/admin/bookings`, "Open Booking Manager")}
    </div>
  `;

  await sendEmail({
    to: ADMIN_ALERT_EMAIL,
    subject: `New booking: ${tourName} on ${date}`,
    html: renderEmailLayout(body),
  });
}
