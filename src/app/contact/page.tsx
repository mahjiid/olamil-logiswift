"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react"

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Message sent! We'll get back to you shortly.")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-slate-900 py-20 text-center">
           <div className="container px-4 mx-auto">
             <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
             <p className="text-slate-400 max-w-xl mx-auto text-lg">
               Have questions about our shipping services or need support? Our team is ready to help 24/7.
             </p>
           </div>
        </section>

        <section className="py-20 container mx-auto px-4 -mt-10">
           <div className="grid lg:grid-cols-3 gap-8">
             {/* Contact Info Cards */}
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="h-5 w-5" />
                   </div>
                   <h3 className="font-bold text-lg mb-2 text-slate-900">Visit Us</h3>
                   <p className="text-slate-600">12 Marina Way, Victoria Island,<br />Lagos, Nigeria</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <Phone className="h-5 w-5" />
                   </div>
                   <h3 className="font-bold text-lg mb-2 text-slate-900">Call Us</h3>
                   <p className="text-slate-600">+234 913 425 2300</p>
                   <p className="text-sm text-slate-400 mt-1">Mon-Fri from 8am to 6pm</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <Mail className="h-5 w-5" />
                   </div>
                   <h3 className="font-bold text-lg mb-2 text-slate-900">Email Us</h3>
                   <p className="text-slate-600">olamilo55@gmail.com</p>
                   <p className="text-sm text-slate-400 mt-1">We reply within 2 hours</p>
                </div>
             </div>

             {/* Form */}
             <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">First Name</label>
                       <Input placeholder="John" required className="bg-slate-50 border-slate-200 focus-visible:bg-white" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Last Name</label>
                       <Input placeholder="Doe" required className="bg-slate-50 border-slate-200 focus-visible:bg-white" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Email Address</label>
                       <Input type="email" placeholder="john@example.com" required className="bg-slate-50 border-slate-200 focus-visible:bg-white" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Subject</label>
                       <select className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                         <option>Support Inquiry</option>
                         <option>Sales & Partnerships</option>
                         <option>Lost Package</option>
                         <option>Other</option>
                       </select>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <Textarea 
                      className="min-h-[150px] bg-slate-50 border-slate-200 focus-visible:bg-white"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
             </div>
           </div>

           {/* Map */}
           <div className="mt-12 h-[400px] w-full bg-slate-200 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.721789467666!2d3.425164!3d6.429019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53283e00001%3A0x66c856753d078170!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1709291234567" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy"
               title="Office Location"
               className="grayscale hover:grayscale-0 transition-all duration-700"
             />
           </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
