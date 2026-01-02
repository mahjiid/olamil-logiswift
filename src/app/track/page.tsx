"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function TrackSearchPage() {
  const [trackingId, setTrackingId] = useState("")
  const router = useRouter()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingId.trim()) {
      router.push(`/track/${trackingId}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center bg-muted/30 py-20 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Track Your Shipment</h1>
            <p className="text-muted-foreground">Enter your tracking ID to see the current status.</p>
          </div>
          
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Sort Code / Tracking ID" 
                className="pl-9" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Track</Button>
          </form>

          <div className="text-sm text-muted-foreground">
            <p>Don't have a tracking ID? Check your confirmation email or SMS.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
