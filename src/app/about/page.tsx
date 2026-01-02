import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">Driving Logistics Innovation in Nigeria</h1>
              <p className="text-lg text-muted-foreground">
                OlamilLogiSwift was founded with a single mission: to bridge the gap between businesses and customers through reliable, technology-driven logistics.
              </p>
              <p className="text-lg text-muted-foreground">
                We believe that distance shouldn't be a barrier to trade. By leveraging advanced tracking systems and a vast network of delivery partners, we ensure that every package arrives safely and on time.
              </p>
            </div>
            <div className="relative h-[400px] bg-muted rounded-2xl overflow-hidden flex items-center justify-center group">
               <Image 
                 src="/images/ols-delivery-agent.png" 
                 alt="Smiling Delivery Agent" 
                 fill 
                 className="object-cover transition-transform duration-500 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <div className="absolute bottom-6 left-6 text-white">
                 <p className="font-bold text-lg">Meet Our Team</p>
                 <p className="text-sm opacity-90">Dedicated to your success</p>
               </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-900">
           <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-3 gap-8 text-center">
               <div>
                  <h3 className="text-4xl font-bold text-primary mb-2">50k+</h3>
                  <p className="text-muted-foreground">Deliveries Completed</p>
               </div>
               <div>
                  <h3 className="text-4xl font-bold text-primary mb-2">36</h3>
                  <p className="text-muted-foreground">States Covered</p>
               </div>
               <div>
                  <h3 className="text-4xl font-bold text-primary mb-2">99.9%</h3>
                  <p className="text-muted-foreground">On-Time Rate</p>
               </div>
             </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
