import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPinOff, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 text-center">
      <div className="bg-background p-8 md:p-12 rounded-2xl shadow-sm border max-w-lg w-full space-y-6">
        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <MapPinOff className="h-10 w-10 text-orange-600" />
        </div>
        
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Lost in Transit?</h1>
            <p className="text-muted-foreground">
                We couldn't locate the page you're looking for. It might have been moved or deleted.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button asChild variant="outline" className="w-full">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                </Link>
            </Button>
            <Button asChild className="w-full">
                <Link href="/track">
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                </Link>
            </Button>
        </div>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        Error Code: 404
      </div>
    </div>
  )
}
