import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(
    to: string, 
    subject: string, 
    html: string
) {
    if (process.env.RESEND_API_KEY) {
        try {
            await resend.emails.send({
                from: 'OlamilLogiswift <noreply@resend.dev>', // Change to your domain in prod
                to,
                subject,
                html
            })
            console.log("✅ Email sent via Resend")
            return { success: true }
        } catch (error) {
            console.error("❌ Resend Error:", error)
            return { success: false, error }
        }
    }

    // Fallback to Mock
    console.log(`
    📨 --- SENDING MOCK EMAIL (No API Key) ---
    TO: ${to}
    SUBJECT: ${subject}
    CONTENT: 
    ${html.replace(/<[^>]*>?/gm, '')} // Strip HTML for console
    ------------------------------------------
    `)

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("✅ Email sent successfully (Mock)")
            resolve({ success: true })
        }, 1000)
    })
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
