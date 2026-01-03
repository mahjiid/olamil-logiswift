import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const secret = process.env.PAYSTACK_SECRET_KEY || ''
        
        // Verify signature
        // In production, you must verify the signature to ensure the request is from Paystack
        // const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex')
        // const signature = req.headers.get('x-paystack-signature')
        // if (hash !== signature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })

        const event = body.event

        if (event === 'charge.success') {
            const { metadata } = body.data
            
            // Find tracking_id from custom_fields
            const trackingField = metadata?.custom_fields?.find((f: any) => f.variable_name === 'tracking_id')
            const trackingId = trackingField?.value

            if (trackingId) {
                // Update Shipment
                await supabase
                    .from('shipments')
                    .update({ 
                        status: 'Pending Pickup', 
                        payment_status: 'Paid',
                        updated_at: new Date().toISOString()
                    })
                    .eq('tracking_id', trackingId)
                
                // Here you could also trigger the Real Email Service
            }
        }

        return NextResponse.json({ status: true }, { status: 200 })
    } catch (error) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ message: 'Server Error' }, { status: 500 })
    }
}
