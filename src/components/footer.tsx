"use client"

import { Truck, Facebook, Twitter, Instagram, Linkedin, Send, Check } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"

export default function Footer() {
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email) return
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }, 500)
  }

  return (
    <footer className="bg-slate-950 text-slate-300 py-16 text-sm">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-white hover:opacity-90 transition-opacity">
            <Logo className="h-8 w-8 text-white" textClassName="text-xl text-white" />
          </Link>
          <p className="leading-relaxed opacity-90">
            Pioneering reliable logistics across Nigeria. From bustling Lagos markets to the quiet streets of Abuja, we deliver trust, speed, and security.
          </p>
          <div className="flex gap-4">
             {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
               <Link key={i} href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                 <Icon className="h-5 w-5" />
               </Link>
             ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-white text-lg mb-6">Our Services</h3>
          <ul className="space-y-4">
            <li><Link href="/services" className="hover:text-white hover:translate-x-1 transition-all inline-block">Express Delivery</Link></li>
            <li><Link href="/services" className="hover:text-white hover:translate-x-1 transition-all inline-block">International Freight</Link></li>
            <li><Link href="/services" className="hover:text-white hover:translate-x-1 transition-all inline-block">Warehousing Solutions</Link></li>
            <li><Link href="/services" className="hover:text-white hover:translate-x-1 transition-all inline-block">E-commerce Fulfillment</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-white text-lg mb-6">Company</h3>
          <ul className="space-y-4">
            <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-white hover:translate-x-1 transition-all inline-block">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact Support</Link></li>
            <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
            {user?.email === "olamilo55@gmail.com" && (
                <li><Link href="/admin" className="hover:text-white hover:translate-x-1 transition-all inline-block opacity-50 hover:opacity-100">Staff Login</Link></li>
            )}
          </ul>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-bold text-white text-lg">Stay Updated</h3>
          <p className="opacity-90">Subscribe to our newsletter for the latest logistics trends and company updates.</p>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter your email" 
              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-offset-slate-950" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              size="icon" 
              className={`shrink-0 transition-all ${subscribed ? "bg-green-600 hover:bg-green-700" : ""}`}
              onClick={handleSubscribe}
            >
              {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-8 border-t border-slate-900 text-center text-slate-500 text-xs">
        <p>&copy; {new Date().getFullYear()} OlamilLogiSwift. All rights reserved.</p>
      </div>
    </footer>
  )
}
