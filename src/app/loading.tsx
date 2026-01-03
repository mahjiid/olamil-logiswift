import { Truck, Package } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="relative">
          {/* Animated Truck */}
          <div className="animate-bounce">
            <Truck className="h-12 w-12 text-primary" />
          </div>
          {/* Moving Road Line */}
          <div className="absolute -bottom-2 w-16 h-1 bg-muted rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary/20 animate-pulse" />
          </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading Logistics...
      </p>
    </div>
  )
}
