import { Resend } from "resend";

/**
 * Server-side email sender. Never expose Resend credentials to a client bundle.
 * Booking/payment pages still require a trusted server endpoint for mail triggers.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  if (typeof window !== "undefined") {
    return { success: false, error: "Email must be triggered by an authenticated server action." };
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) {
    return { success: false, error: "Transactional email has not been configured." };
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      console.error("Transactional email provider rejected the request.");
      return { success: false, error: "Email provider rejected the request." };
    }
    return { success: true };
  } catch {
    console.error("Transactional email delivery failed.");
    return { success: false, error: "Email delivery failed." };
  }
}

export function generateBookingEmail(trackingId: string, name: string) {
    return `
      <h1>Booking Confirmed!</h1>
      <p>Hi ${name},</p>
      <p>Your shipment has been booked successfully.</p>
      <p><strong>Tracking ID:</strong> ${trackingId}</p>
      <p>Please proceed to payment to initiate dispatch.</p>
    `
}

export function generatePaymentReceiptEmail(trackingId: string, amount: number) {
    return `
      <h1>Payment Received</h1>
      <p>Thank you for your payment of ₦${amount.toLocaleString()}.</p>
      <p>Your shipment (${trackingId}) is now <strong>Pending Pickup</strong>.</p>
      <p>Our rider will contact you shortly.</p>
    `
}
