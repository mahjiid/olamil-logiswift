"use client"

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Map from "@/components/maps"
import Link from "next/link"
import { Activity, Package, Truck, AlertCircle, TrendingUp, Users } from "lucide-react"

export default function DashboardPage() {
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Shipment ID,Status,Date,Value\n"
      + "LGS-8821,Delivered,2026-01-01,15000\n"
      + "LGS-9923,In Transit,2026-01-01,12500\n"
      + "LGS-1102,Pending,2026-01-01,4500";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fleet_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20 p-6">
        <div className="container mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
              <p className="text-muted-foreground">Real-time overview of your logistics operations.</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" onClick={handleExport} className="gap-2">
                 <Activity className="h-4 w-4" /> Export Report
               </Button>
               <Button asChild>
                 <Link href="/book">Add New Shipment</Link>
               </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Shipments", value: "1,234", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
              { label: "Vehicles in Transit", value: "48", icon: Truck, color: "text-orange-600", bg: "bg-orange-100" },
              { label: "Pending Deliveries", value: "12", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
              { label: "Revenue (Today)", value: "₦2.4M", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
            ].map((stat, i) => (
              <div key={i} className="bg-background p-6 rounded-xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Live Map */}
            <div className="lg:col-span-2 bg-background p-6 rounded-xl border shadow-sm h-[500px] flex flex-col">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Live Fleet Tracking
              </h2>
              <div className="flex-1 rounded-lg overflow-hidden border">
                <Map zoom={6} center={[9.0820, 8.6753]} markers={[
                   { position: [6.5244, 3.3792], title: "Truck LG-001 (Lagos)" },
                   { position: [9.0765, 7.3986], title: "Van AB-042 (Abuja)" },
                   { position: [11.9984, 8.5153], title: "Truck KN-882 (Kano)" },
                   { position: [4.8156, 7.0498], title: "Bike PH-101 (Port Harcourt)" },
                   { position: [7.3775, 3.9470], title: "Truck IB-55 (Ibadan)" },
                ]} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1 bg-background p-6 rounded-xl border shadow-sm h-[500px] overflow-y-auto">
              <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
              <div className="space-y-6">
                {[
                  { id: "LGS-8821", action: "Delivered successfully", time: "2 mins ago", user: "John Doe" },
                  { id: "LGS-9923", action: "Picked up at Ikeja Hub", time: "15 mins ago", user: "Sarah Smith" },
                  { id: "LGS-1102", action: "Payment confirmed", time: "32 mins ago", user: "Mike Johnson" },
                  { id: "LGS-4421", action: "Delayed due to traffic", time: "1 hour ago", user: "System" },
                  { id: "LGS-0021", action: "New shipment created", time: "2 hours ago", user: "Guest User" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-primary font-mono">{item.id}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
