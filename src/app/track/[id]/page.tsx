"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Map from "@/components/maps" // Dynamic wrapper
import TrackingTimeline from "@/components/tracking-timeline"
import { CheckCircle2, Circle, Truck, MapPin, Package, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

// Mock data as fallback
const mockShipment = (id: string) => ({
    id,
    origin: "Lagos, NG",
    destination: "Abuja, NG",
    status: "In Transit",
    estimatedDelivery: "Jan 12, 2026",
    timeline: [
      { status: "Shipment Created", location: "Lagos Hub", time: "Jan 10, 09:00 AM", completed: true },
      { status: "Picked Up", location: "Lagos Hub", time: "Jan 10, 02:30 PM", completed: true },
      { status: "In Transit", location: "Ibadan Checkpoint", time: "Jan 11, 08:15 AM", completed: true },
      { status: "Out for Delivery", location: "Abuja Hub", time: null, completed: false },
      { status: "Delivered", location: "Customer Address", time: null, completed: false },
    ]
})

export default function TrackingPage() {
  const params = useParams()
  const id = params?.id as string
  const [shipment, setShipment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)

  useEffect(() => {
    async function fetchShipment() {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from('shipments')
          .select('*')
          .eq('tracking_id', id)
          .single()

        if (error || !data) {
          console.warn("Using demo data due to error:", error)
          setShipment(mockShipment(id))
          setUsingDemo(true)
        } else {
          // Transform DB data to UI format if needed
          setShipment({
              ...data,
              // If timeline is JSON in DB, use it directly, else mock or parse
              timeline: data.timeline || mockShipment(id).timeline
          })
        }
      } catch (e) {
         setShipment(mockShipment(id))
         setUsingDemo(true)
      } finally {
        setLoading(false)
      }
    }

    fetchShipment()
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('shipment_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shipments', filter: `tracking_id=eq.${id}` },
        (payload) => {
           console.log("Realtime update:", payload)
           setShipment((prev: any) => ({ ...prev, ...payload.new }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  if (loading) {
      return (
          <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </main>
              <Footer />
          </div>
      )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tracking: <span className="text-primary">{id}</span></h1>
            <p className="text-muted-foreground">Detailed status of your shipment.</p>
            {usingDemo && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg flex items-center gap-2 text-sm border border-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <span>Database not connected. Showing demo data.</span>
                </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Status Timeline */}
            <div className="lg:col-span-1 bg-background p-6 rounded-xl border shadow-sm h-fit">
              <h2 className="font-semibold text-lg mb-6">Shipment Status</h2>
              <TrackingTimeline events={shipment.timeline} />
            </div>

            {/* Map View */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-background p-6 rounded-xl border shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                   <div>
                     <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                     <p className="font-bold text-xl">{shipment.estimatedDelivery}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm text-muted-foreground">Current Status</p>
                     <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700">
                       {shipment.status}
                     </div>
                   </div>
                 </div>
                 
                 <div className="h-[400px] w-full rounded-lg overflow-hidden border">
                   {/* Centered between Lagos and Abuja approx */}
                   <Map center={[7.8, 5.5]} zoom={7} markers={[
                     { position: [6.5244, 3.3792], title: "Origin: Lagos" },
                     { position: [7.3775, 3.9470], title: "Current: Ibadan" },
                     { position: [9.0765, 7.3986], title: "Dest: Abuja" }
                   ]} />
                 </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-background border rounded-lg text-center">
                    <Package className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-semibold">2.5 KG</p>
                  </div>
                  <div className="p-4 bg-background border rounded-lg text-center">
                    <Truck className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="font-semibold">Express</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
