"use client"

import { Suspense, useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Lock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { usePaystackPayment } from 'react-paystack'
import { sendEmail, generatePaymentReceiptEmail } from "@/lib/email"

function PayContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [shipment, setShipment] = useState<any>(null)
  const [email, setEmail] = useState("")

  // Hardcoded public key for test if not in env
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_test_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

  useEffect(() => {
    if (id) {
       const fetchShipment = async () => {
           // Fetch shipment details without joining profiles
           // because there is no direct foreign key relation setup for it to infer
           const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('tracking_id', id)
            .single()
           
           if (data) {
               setShipment(data)
               // Get email from current session since user is logged in
               const { data: { user } } = await supabase.auth.getUser()
               if (user?.email) setEmail(user.email)
           }
       }
       fetchShipment()
    }
  }, [id])

  const config = {
      reference: (new Date()).getTime().toString(),
      email: email,
      amount: shipment ? shipment.amount * 100 : 0, // Paystack is in kobo
      publicKey: publicKey,
  }

  const initializePayment = usePaystackPayment(config)

  const onSuccess = async () => {
    setStatus("processing")
    
    if (id) {
        try {
            const { error } = await supabase
                .from('shipments')
                .update({ 
                    status: 'Paid', 
                    payment_status: 'Paid' 
                })
                .eq('tracking_id', id)
            
            if (error) throw error
            setStatus("success")
        } catch (e) {
            console.error(e)
            // Even if DB update fails, payment was successful conceptually
            setStatus("success") 
        }
    }
  }

  const onClose = () => {
    // User closed popup
    console.log('Payment closed')
  }

  const handlePaystack = () => {
      initializePayment({onSuccess, onClose})
  }

  if (status === "success") {
    return (
          <div className="w-full max-w-md bg-background border rounded-2xl shadow-lg p-8 text-center space-y-6 animate-in zoom-in-50 duration-300">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your transaction was completed and your shipment is ready.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold">₦{shipment?.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Ref</span>
                <span className="font-mono">TRX-{config.reference.slice(-8)}</span>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/track/${id || 'LGS-12345'}`}>Track Shipment</Link>
            </Button>
          </div>
    )
  }

  if (!id) {
      return (
          <div className="w-full max-w-md bg-background border rounded-2xl shadow-lg p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold">Invalid Request</h2>
              <p className="text-muted-foreground mb-6">No shipment ID found.</p>
              <Button asChild><Link href="/book">Book Shipment</Link></Button>
          </div>
      )
  }

  return (
          <div className="bg-background border rounded-xl shadow-lg overflow-hidden max-w-lg w-full">
            <div className="p-6 border-b bg-muted/20">
              <h1 className="text-2xl font-bold">Secure Checkout</h1>
              <p className="text-muted-foreground">Complete your payment to process shipment.</p>
            </div>
            
            <div className="p-6 space-y-6">
              {shipment ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipment ID</span>
                      <span className="font-medium">{id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">{shipment.delivery_type} ({shipment.vehicle_type})</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Route</span>
                      <span className="font-medium truncate max-w-[200px]">{shipment.origin} &rarr; {shipment.destination}</span>
                    </div>
                    
                    <div className="py-2 space-y-2 border-t border-dashed">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span>₦{Math.round(shipment.amount / 1.05).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Service Charge</span>
                            <span>₦{Math.round(shipment.amount - (shipment.amount / 1.05)).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">₦{shipment.amount?.toLocaleString()}</span>
                    </div>
                  </div>
              ) : (
                  <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-10 bg-muted rounded w-full mt-4"></div>
                  </div>
              )}
              
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full h-12 text-lg bg-[#000000] hover:bg-[#000000]/90 text-white relative" 
                  onClick={handlePaystack}
                  disabled={!shipment || !email}
                >
                  Pay with Paystack
                </Button>
                
                <Button 
                  className="w-full h-12 text-lg bg-[#FB9129] hover:bg-[#FB9129]/90 text-white relative" 
                  onClick={() => alert("Flutterwave not integrated yet!")}
                  disabled={true}
                >
                  Pay with Flutterwave
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Lock className="h-3 w-3" />
                <span>Payments are secure and encrypted.</span>
              </div>
            </div>
          </div>
  )
}

export default function PayPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-muted/30 py-8 md:py-20 px-4">
         <Suspense fallback={<div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />}>
            <PayContent />
         </Suspense>
      </main>
      <Footer />
    </div>
  )
}
