"use client"

import Link from "next/link"
import { ArrowRight, MapPin, Shield, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Map from "@/components/maps" // Dynamic wrapper
import HeroSlideshow from "@/components/hero-slideshow"
import { motion } from "framer-motion"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <HeroSlideshow />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/80 backdrop-blur shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Live Tracking Available
              </motion.div>
              
              <motion.h1 
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl drop-shadow-sm"
              >
                Logistics Simplified for <span className="text-primary">Nigeria</span>
              </motion.h1>
              
              <motion.p 
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium"
              >
                Experience seamless delivery, real-time tracking, and secure payments across the nation. From Lagos to Abuja, we've got you covered.
              </motion.p>
              
              <motion.div 
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md p-2 bg-background/95 backdrop-blur rounded-lg shadow-xl border flex gap-2"
              >
                <Input placeholder="Enter Tracking ID (e.g. LGS-12345)" className="border-0 shadow-none focus-visible:ring-0 bg-transparent" />
                <Button>Track</Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 text-sm text-muted-foreground pt-4"
              >
                <span>Trusted by:</span>
                <span className="font-bold">Jumia</span>
                <span className="font-bold">Konga</span>
                <span className="font-bold">Dangote</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose OlamilLogiSwift?</h2>
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { icon: Clock, title: "Fast Delivery", desc: "Same-day delivery within major cities." },
                { icon: Shield, title: "Secure Handling", desc: "Your packages are insured and handled with care." },
                { icon: MapPin, title: "Real-time Tracking", desc: "Know exactly where your package is, 24/7." },
                { icon: Globe, title: "Nationwide Coverage", desc: "Network covering all 36 states." },
              ].map((f, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  className="bg-background p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                >
                  <f.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Live Map Preview Section */}
        <section className="py-20 container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Monitor Your Fleet in Real-Time</h2>
              <p className="text-lg text-muted-foreground">
                Our advanced dashboard gives you complete visibility over your supply chain.
                Visualize routes, status updates, and estimated delivery times instantly.
              </p>
              <ul className="space-y-3">
                {["Live GPS Updates", "Route Optimization", "Delivery Proof"].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/dashboard">
                  Explore Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border bg-muted">
               <Map zoom={5} markers={[
                 { position: [6.5244, 3.3792], title: "Lagos Hub" },
                 { position: [9.0765, 7.3986], title: "Abuja Center" },
                 { position: [12.0022, 8.5920], title: "Kano Dispatch" }
               ]} />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to ship?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
              Get an instant quote and book your pickup in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="font-bold" asChild>
                <Link href="/book">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
