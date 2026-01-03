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
    CheckCircle2, 
    MapPin, 
    Search,
    AlertCircle
} from "lucide-react"
import { Input } from "@/components/ui/input"

// Simple Card for Mobile, Table for Desktop
function ShipmentCard({ shipment, onUpdateStatus }: { shipment: any, onUpdateStatus: (id: string, status: string) => void }) {
    const isDelivered = shipment.status === "Delivered"
    
    return (
        <div className="bg-background p-4 rounded-xl border shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-mono text-xs text-muted-foreground">{shipment.tracking_id}</span>
                    <h3 className="font-semibold text-lg">{shipment.delivery_type} ({shipment.vehicle_type})</h3>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${isDelivered ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {shipment.status}
                </div>
            </div>
            
            <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" /> 
                    <span className="truncate max-w-[250px]">{shipment.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" /> 
                    <span className="truncate max-w-[250px]">{shipment.destination}</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold">₦{shipment.amount?.toLocaleString()}</span>
                {!isDelivered && (
                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(shipment.tracking_id, "Delivered")}>
                        Mark Delivered
                    </Button>
                )}
            </div>
        </div>
    )
}

export default function AdminPage() {
  const { user, isLoading: loading } = useAuth()
  const router = useRouter()
  const [shipments, setShipments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!loading && !user) {
        // Simple auth check
        router.push('/login')
        return
    }

    const fetchShipments = async () => {
        const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (data) setShipments(data)
        setIsLoading(false)
    }

    if (user) {
        fetchShipments()
        
        // Subscribe to changes
        const channel = supabase
            .channel('admin-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'shipments' },
                (payload) => {
                    fetchShipments()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }
  }, [user, loading, router])

  const updateStatus = async (trackingId: string, newStatus: string) => {
      // Optimistic update
      setShipments(prev => prev.map(s => 
          s.tracking_id === trackingId ? { ...s, status: newStatus } : s
      ))

      const { error } = await supabase
          .from('shipments')
          .update({ status: newStatus })
          .eq('tracking_id', trackingId)
          
      if (error) {
          console.error("Failed to update", error)
          // Revert or show toast
      }
  }

  const filteredShipments = shipments.filter(s => 
      s.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Package className="h-8 w-8 text-primary" />
                    Shipment Manager
                </h1>
                <p className="text-muted-foreground">Monitor and manage all active deliveries.</p>
            </div>
            
            <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search Tracking ID..." 
                    className="pl-9 w-full md:w-64 bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="grid grid-cols-1 md:hidden gap-4">
            {filteredShipments.map(shipment => (
                <ShipmentCard key={shipment.id} shipment={shipment} onUpdateStatus={updateStatus} />
            ))}
            {filteredShipments.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">No shipments found.</div>
            )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-background rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Tracking ID</th>
                            <th className="px-6 py-4">Route</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredShipments.map((shipment) => {
                            const isDelivered = shipment.status === "Delivered"
                            return (
                                <tr key={shipment.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium">{shipment.tracking_id}</td>
                                    <td className="px-6 py-4 max-w-[200px]">
                                        <div className="flex flex-col gap-1 truncate">
                                            <span className="text-xs text-muted-foreground">From: {shipment.origin}</span>
                                            <span>To: {shipment.destination}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{shipment.delivery_type}</span>
                                            <span className="text-xs text-muted-foreground">{shipment.vehicle_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${isDelivered ? "bg-green-100 text-green-700" : 
                                              shipment.status === "Pending Payment" ? "bg-yellow-100 text-yellow-700" :
                                              "bg-blue-100 text-blue-700"}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">
                                        ₦{shipment.amount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isDelivered && (
                                            <Button size="sm" variant="ghost" className="hover:bg-green-50 hover:text-green-700" onClick={() => updateStatus(shipment.tracking_id, "Delivered")}>
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Mark Delivered
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
             </div>
             {filteredShipments.length === 0 && (
                 <div className="p-10 text-center text-muted-foreground flex flex-col items-center gap-2">
                     <AlertCircle className="h-8 w-8 opacity-20" />
                     No shipments match your search.
                 </div>
             )}
        </div>
      </main>
    </div>
  )
}
