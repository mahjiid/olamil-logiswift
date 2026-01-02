"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Truck, MapPin, Package, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [quote, setQuote] = useState<number | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock calculation
    setQuote(15500)
    setStep(2)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="bg-background rounded-2xl shadow-sm border overflow-hidden">
            <div className="bg-primary p-6 text-primary-foreground">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Truck className="h-6 w-6" />
                Book a Shipment
              </h1>
              <p className="text-blue-100 mt-1">
                {step === 1 ? "Enter shipment details to get an instant quote." : "Review your quote and proceed to payment."}
              </p>
            </div>

            <div className="p-8">
              {step === 1 ? (
                <form onSubmit={handleCalculate} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pickup Location (Origin)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. 123 Lagos St, Ikeja" className="pl-9" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Delivery Address (Destination)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. 456 Abuja Way, Wuse" className="pl-9" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Package Details</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground">Weight (kg)</span>
                        <Input type="number" placeholder="0.0" min="0" step="0.1" required />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground">Length (cm)</span>
                        <Input type="number" placeholder="0" min="0" />
                      </div>
                       <div className="col-span-1 md:col-span-1 space-y-2">
                         <span className="text-xs text-muted-foreground">Type</span>
                         <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                           <option>Standard Parcel</option>
                           <option>Fragile</option>
                           <option>Documents</option>
                           <option>Electronics</option>
                         </select>
                       </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Calculate Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Quote Ready!</h2>
                    <p className="text-muted-foreground">Based on your route (Lagos to Abuja) and weight.</p>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-xl border border-muted flex flex-col items-center justify-center space-y-2">
                    <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Total Estimate</span>
                    <span className="text-4xl font-extrabold text-primary">₦{quote?.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Includes insurance & tax</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                      Edit Details
                    </Button>
                    <Button size="lg" asChild>
                      <Link href="/pay">Proceed to Pay</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
