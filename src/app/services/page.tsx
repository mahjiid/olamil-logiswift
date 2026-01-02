import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Truck, Plane, Ship, Package, Clock, ShieldCheck, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function ServicesPage() {
  const services = [
    {
      icon: Truck,
      title: "Road Freight",
      description: "Reliable and cost-effective ground transport across all 36 states in Nigeria.",
      features: ["Door-to-door delivery", "Full Truck Load (FTL)", "Less than Truck Load (LTL)"]
    },
    {
      icon: Plane,
      title: "Air Freight",
      description: "Fastest delivery options for urgent shipments to major cities like Lagos, Abuja, and Port Harcourt.",
      features: ["Same-day delivery", "Next-flight out", "Airport-to-airport"]
    },
    {
      icon: Ship,
      title: "Sea Freight",
      description: "Economical solutions for large cargo and international imports/exports.",
      features: ["Container shipping", "Customs clearance support", "Bulk cargo"]
    },
    {
      icon: Package,
      title: "E-commerce Logistics",
      description: "End-to-end fulfillment solutions for online businesses.",
      features: ["Warehousing", "Last-mile delivery", "Cash on Delivery (COD) handling"]
    }
  ]

  const benefits = [
    { title: "Real-time Tracking", description: "Monitor your shipment's journey from pickup to delivery.", icon: Globe },
    { title: "Secure Handling", description: "Advanced packaging and handling to ensure safety.", icon: ShieldCheck },
    { title: "On-time Delivery", description: "Optimized routes to ensure your package arrives when expected.", icon: Clock },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 overflow-hidden relative isolate py-24 sm:py-32">
          <Image 
            src="/images/hero-bg.png" 
            alt="Logistics Background" 
            fill 
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-900 via-slate-900/40" />
          
          <div className="container mx-auto px-6 lg:px-8 text-center">
             <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl max-w-2xl mx-auto">
               Logistics Solutions for a <span className="text-blue-500">Connected World</span>
             </h1>
             <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
               From local deliveries to global freight, we provide the infrastructure your business needs to scale efficiently.
             </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-slate-100">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 blur-2xl group-hover:bg-blue-100 transition-colors" />
                
                <div className="relative">
                  <div className="h-14 w-14 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 mb-6 group-hover:scale-110 transition-transform">
                    <s.icon className="h-7 w-7" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{s.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{s.description}</p>
                  
                  <ul className="space-y-3 border-t border-slate-100 pt-6">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why Partner With Us?</h2>
                <p className="mt-4 text-lg text-slate-600">We don't just move cargo; we deliver peace of mind.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12">
                {benefits.map((b, i) => (
                  <div key={i} className="text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <b.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{b.title}</h3>
                    <p className="text-slate-600">{b.description}</p>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                 </svg>
              </div>

              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to streamline your shipping?</h2>
                <p className="text-slate-300 text-lg">
                  Join thousands of businesses that trust OlamilLogiSwift for their logistics needs.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="h-12 px-8 text-base bg-white text-slate-900 hover:bg-slate-100" asChild>
                    <Link href="/book">Get a Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base border-slate-700 text-white hover:bg-slate-800 hover:text-white" asChild>
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
