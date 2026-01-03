"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Truck, MapPin, Package, ArrowRight, CheckCircle2, Map as MapIcon, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import MapView from "@/components/maps"

import { sendEmail, generateBookingEmail } from "@/lib/email"

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [quoteDetails, setQuoteDetails] = useState<{delivery: number, service: number, total: number} | null>(null)
  
  // Form State
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [weight, setWeight] = useState("")
  const [deliveryType, setDeliveryType] = useState("Standard")
  const [vehicleType, setVehicleType] = useState("Bike")

  // Map Picker State
  const [showMap, setShowMap] = useState(false)
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null)
  const [tempLocation, setTempLocation] = useState<{lat: number, lng: number} | null>(null)
  
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock calculation
    const w = parseFloat(weight) || 1
    
    // Base Rates
    let baseRate = 1000 // Bike Base
    if (vehicleType === "Car") baseRate = 3000
    if (vehicleType === "Truck") baseRate = 15000
    
    // Delivery Speed Multiplier
    if (deliveryType === "Express") baseRate *= 1.5
    
    // Weight Multiplier
    const weightCost = w * 125
    
    const deliveryFee = baseRate + weightCost
    const serviceFee = deliveryFee * 0.05 // 5% Service Charge
    
    setQuoteDetails({
        delivery: deliveryFee,
        service: serviceFee,
        total: deliveryFee + serviceFee
    })
    setStep(2)
  }

  const openMap = (field: 'origin' | 'destination') => {
    setActiveField(field)
    
    // Parse existing value if it looks like coordinates
    const currentValue = field === 'origin' ? origin : destination
    const coords = currentValue.split(',').map(s => parseFloat(s.trim()))
    
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setTempLocation({ lat: coords[0], lng: coords[1] })
    } else {
        setTempLocation(null)
    }
    
    setShowMap(true)
  }

  const handleMapClick = (lat: number, lng: number) => {
    setTempLocation({ lat, lng })
  }
  
  const confirmLocation = () => {
      if (tempLocation && activeField) {
          const address = `${tempLocation.lat.toFixed(6)}, ${tempLocation.lng.toFixed(6)}`
          if (activeField === 'origin') setOrigin(address)
          if (activeField === 'destination') setDestination(address)
      }
      setShowMap(false)
  }

  const handleProceed = async () => {
    if (!user) {
       alert("Please login to book a shipment")
       router.push('/login')
       return
    }
    
    setIsLoading(true)
    const trackingId = "LGS-" + Math.floor(100000 + Math.random() * 900000)
    
    // Check if Supabase keys are present by attempting a simple check or just try/catch
    try {
        const { error } = await supabase.from('shipments').insert({
           user_id: user.id,
           tracking_id: trackingId,
           origin: origin,
           destination: destination,
           delivery_type: deliveryType,
           vehicle_type: vehicleType,
           amount: quoteDetails?.total,
           status: "Pending Payment"
        })
        
        if (error) {
           throw error
        }
        
        // Simulate sending email
        if (user.email) {
            const emailHtml = generateBookingEmail(trackingId, user.email.split('@')[0])
            // We don't await this to keep UI snappy, or we can toast
            sendEmail(user.email, "Booking Confirmation", emailHtml)
        }
        
        router.push(`/pay?id=${trackingId}`)
    } catch (e: any) {
        console.error(e)
        // Fallback for demo without DB connection
        if (e.message?.includes("apikey") || e.message?.includes("URL")) {
             alert("Database not connected. Simulating success with ID: " + trackingId)
             router.push(`/pay?id=${trackingId}`)
        } else {
             alert("Error creating shipment: " + (e.message || "Unknown error"))
        }
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col relative">
      <Navbar />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="bg-background rounded-2xl shadow-sm border overflow-hidden">
            <div className="bg-primary p-6 text-primary-foreground">
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Truck className="h-6 w-6" />
                Book a Shipment
              </h1>
              <p className="text-blue-100 mt-1 text-sm md:text-base">
                {step === 1 ? "Enter shipment details to get an instant quote." : "Review your quote and proceed to payment."}
              </p>
            </div>

            <div className="p-4 md:p-8">
              {step === 1 ? (
                <form onSubmit={handleCalculate} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pickup Location (Origin)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="e.g. 123 Lagos St, Ikeja" 
                                className="pl-9" 
                                required 
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            />
                        </div>
                        <Button type="button" variant="outline" size="icon" onClick={() => openMap('origin')} title="Pick on Map">
                            <MapIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Delivery Address (Destination)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="e.g. 456 Abuja Way, Wuse" 
                                className="pl-9" 
                                required 
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <Button type="button" variant="outline" size="icon" onClick={() => openMap('destination')} title="Pick on Map">
                            <MapIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Package Details</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground">Weight (kg)</span>
                        <Input 
                            type="number" 
                            placeholder="0.0" 
                            min="0" 
                            step="0.1" 
                            required 
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground">Length (cm)</span>
                        <Input type="number" placeholder="0" min="0" />
                      </div>
                       <div className="col-span-1 md:col-span-1 space-y-2">
                         <span className="text-xs text-muted-foreground">Vehicle Type</span>
                         <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                         >
                           <option value="Bike">Bike (Small items)</option>
                           <option value="Car">Car (Standard)</option>
                           <option value="Truck">Truck (Large Loads)</option>
                         </select>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Delivery Speed</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${deliveryType === "Standard" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/50"}`}
                          onClick={() => setDeliveryType("Standard")}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Standard</span>
                                {deliveryType === "Standard" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground">3-5 Business Days. Best value for non-urgent items.</p>
                        </div>
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${deliveryType === "Express" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/50"}`}
                          onClick={() => setDeliveryType("Express")}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Express</span>
                                {deliveryType === "Express" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground">1-2 Business Days. Priority handling and faster route.</p>
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
                    <p className="text-muted-foreground">Based on your route and weight.</p>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-xl border border-muted flex flex-col space-y-4">
                    <div className="flex justify-between items-center text-sm border-b pb-4 border-dashed border-gray-300">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span className="font-medium">₦{quoteDetails?.delivery.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-4 border-dashed border-gray-300">
                        <span className="text-muted-foreground">Service Charge (5%)</span>
                        <span className="font-medium">₦{quoteDetails?.service.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Estimate</span>
                        <span className="text-3xl font-extrabold text-primary">₦{quoteDetails?.total.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground pt-2">Includes insurance & tax</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                      Edit Details
                    </Button>
                    <Button size="lg" onClick={handleProceed} disabled={isLoading}>
                      {isLoading ? "creating..." : "Proceed to Pay"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-2 z-[401] bg-background/80 backdrop-blur hover:bg-background" 
                    onClick={() => setShowMap(false)}
                >
                    <X className="h-5 w-5" />
                </Button>
                <div className="p-4 border-b bg-card flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MapIcon className="h-5 w-5 text-primary" />
                            Select {activeField === 'origin' ? 'Pickup' : 'Delivery'} Location
                        </h3>
                        <p className="text-sm text-muted-foreground">Click on the map to place pin.</p>
                    </div>
                    {tempLocation && (
                        <Button size="sm" onClick={confirmLocation}>
                            Confirm Location
                        </Button>
                    )}
                </div>
                <div className="flex-1 relative">
                    <MapView 
                        onMapClick={handleMapClick} 
                        markers={tempLocation ? [{ position: [tempLocation.lat, tempLocation.lng], title: "Selected Location" }] : []}
                    />
                </div>
            </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
