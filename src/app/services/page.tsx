import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Truck, Shield, Clock, Globe, Package, Warehouse, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Truck,
      title: "Express Delivery",
      description: "Same-day delivery within major cities and next-day delivery nationwide. Perfect for urgent packages.",
      features: ["Door-to-door service", "Real-time tracking", "SMS updates"]
    },
    {
      icon: Globe,
      title: "International Shipping",
      description: "Reliable shipping to over 200 countries. We handle customs clearance and documentation for you.",
      features: ["Customs handling", "Air & Sea freight", "Insurance included"]
    },
    {
      icon: Warehouse,
      title: "Warehousing",
      description: "Secure storage solutions for businesses. Inventory management and fulfillment services available.",
      features: ["24/7 Security", "Climate control", "Inventory dashboard"]
    },
    {
      icon: Shield,
      title: "Secure Handling",
      description: "Specialized handling for fragile, high-value, or sensitive items. Your goods are safe with us.",
      features: ["Tamper-proof packaging", "Full insurance coverage", "Specialized fleet"]
    },
    {
      icon: Package,
      title: "E-commerce Logistics",
      description: "End-to-end logistics for online businesses. From checkout to delivery, we manage it all.",
      features: ["API Integration", "Cash on Delivery", "Returns management"]
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our dedicated support team is always available to answer your queries and resolve issues.",
      features: ["Live chat", "Phone support", "Dedicated account manager"]
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Our Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive logistic solutions tailored to your personal and business needs.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-background border rounded-xl p-8 hover:shadow-lg transition-shadow bg-blue-50/50 flex flex-col items-center text-center">
                  <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 transition-transform hover:scale-110">
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">{service.description}</p>
                  <ul className="space-y-3 w-fit mx-auto p-4 rounded-lg text-left">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm font-medium text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-primary/80 mr-3 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Need a custom solution?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              We understand that every business is unique. Contact our sales team to discuss a tailored logistics plan for your company.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/book">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
