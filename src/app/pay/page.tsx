"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Lock, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PayPage() {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle")
  const [gateway, setGateway] = useState<"Paystack" | "Flutterwave" | null>(null)

  const handlePayment = (selectedGateway: "Paystack" | "Flutterwave") => {
    setGateway(selectedGateway)
    setStatus("processing")
    
    // Simulate API call delay
    setTimeout(() => {
      setStatus("success")
    }, 2000)
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-muted/30 py-20 px-4">
          <div className="w-full max-w-md bg-background border rounded-2xl shadow-lg p-8 text-center space-y-6 animate-in zoom-in-50 duration-300">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your transaction via {gateway} was completed.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold">₦15,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Ref</span>
                <span className="font-mono">TRX-{Math.floor(Math.random() * 1000000)}</span>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/track/LGS-12345">Track Shipment</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container max-w-lg mx-auto px-4">
          <div className="bg-background border rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b bg-muted/20">
              <h1 className="text-2xl font-bold">Secure Checkout</h1>
              <p className="text-muted-foreground">Complete your payment to process shipment.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipment ID</span>
                  <span className="font-medium">LGS-12345</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">Express Delivery (Lagos - Abuja)</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">₦15,500.00</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full h-12 text-lg bg-[#000000] hover:bg-[#000000]/90 text-white relative" 
                  onClick={() => handlePayment("Paystack")}
                  disabled={status === "processing"}
                >
                  {status === "processing" && gateway === "Paystack" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Pay with Paystack"
                  )}
                </Button>
                
                <Button 
                  className="w-full h-12 text-lg bg-[#FB9129] hover:bg-[#FB9129]/90 text-white relative" 
                  onClick={() => handlePayment("Flutterwave")}
                  disabled={status === "processing"}
                >
                  {status === "processing" && gateway === "Flutterwave" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Pay with Flutterwave"
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Lock className="h-3 w-3" />
                <span>Payments are secure and encrypted.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
