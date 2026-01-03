"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
    Loader2, 
    Package, 
    Truck, 
    MapPin, 
    ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading: loading } = useAuth()
  const router = useRouter()
  const [shipments, setShipments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login')
        return
    }

    const fetchShipments = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            
        if (data) setShipments(data)
        setIsLoading(false)
    }

    if (user) {
        fetchShipments()
    }
  }, [user, loading, router])

  if (loading || isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Package className="h-8 w-8 text-primary" />
                    My Shipments
                </h1>
                <p className="text-muted-foreground">Track and manage your delivery history.</p>
            </div>
            <Link href="/book">
                <Button>
                    <Truck className="mr-2 h-4 w-4" />
                    New Shipment
                </Button>
            </Link>
        </div>

        <div className="space-y-4">
            {shipments.map(shipment => (
                <div key={shipment.id} className="bg-background p-4 md:p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 md:items-center justify-between hover:border-primary/50 transition-colors">
                    <div className="flex-1 space-y-2">
                         <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-medium bg-muted px-2 py-1 rounded">
                                {shipment.tracking_id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                ${shipment.status === "Delivered" ? "bg-green-100 text-green-700" : 
                                  shipment.status === "Pending Payment" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-blue-100 text-blue-700"}`}>
                                {shipment.status}
                            </span>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1 min-w-[150px]">
                                <MapPin className="h-3 w-3" /> 
                                <span className="truncate max-w-[200px]">{shipment.origin}</span>
                            </div>
                            <ArrowRight className="h-3 w-3 hidden sm:block opacity-50" />
                            <div className="flex items-center gap-1 min-w-[150px]">
                                <MapPin className="h-3 w-3 text-primary" /> 
                                <span className="truncate max-w-[200px]">{shipment.destination}</span>
                            </div>
                         </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                        <div className="text-right">
                             <p className="text-xs text-muted-foreground">Amount</p>
                             <p className="font-bold">₦{shipment.amount?.toLocaleString()}</p>
                        </div>
                        <Link href={shipment.status === 'Pending Payment' ? `/pay?id=${shipment.tracking_id}` : `/track/${shipment.tracking_id}`}>
                            <Button variant={shipment.status === 'Pending Payment' ? "default" : "outline"} size="sm">
                                {shipment.status === 'Pending Payment' ? "Pay Now" : "Track"}
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}

            {shipments.length === 0 && (
                <div className="text-center py-20 bg-background rounded-xl border border-dashed">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">No shipments yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first booking today!</p>
                    <Link href="/book">
                        <Button variant="outline">Book Now</Button>
                    </Link>
                </div>
            )}
        </div>
      </main>
    </div>
  )
}
