import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock, Heart, Zap, Coffee, ArrowRight } from "lucide-react"

export default function CareersPage() {
  const jobs = [
    {
      title: "Logistics Operations Manager",
      location: "Lagos, NG",
      type: "Full-time",
      dept: "Operations",
      description: "Lead our day-to-day operations and optimize fleet efficiency."
    },
    {
      title: "Senior Full Stack Engineer",
      location: "Remote / Lagos",
      type: "Full-time",
      dept: "Engineering",
      description: "Build the next generation of logistics software."
    },
    {
      title: "Fleet Coordinator",
      location: "Abuja, NG",
      type: "Full-time",
      dept: "Logistics",
      description: "Coordinate vehicle maintenance and driver schedules."
    },
    {
      title: "Customer Support Specialist",
      location: "Lagos, NG",
      type: "Full-time",
      dept: "Support",
      description: "Provide world-class support to our growing customer base."
    }
  ]

  const benefits = [
    { icon: Heart, title: "Health Insurance", desc: "Premium coverage for you and your family." },
    { icon: Zap, title: "Performance Bonus", desc: "Competitive salaries and quarterly bonuses." },
    { icon: Coffee, title: "Work-Life Balance", desc: "Flexible hours and remote work options." },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <section className="bg-slate-900 py-24 text-center">
          <div className="container mx-auto px-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
              We're Hiring
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white tracking-tight">Join Our Team</h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed">
              Help us build the future of logistics in Africa. We're looking for passionate individuals to solve complex problems and deliver excellence.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
             {benefits.map((b, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                   <div className="mx-auto h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <b.icon className="h-6 w-6" />
                   </div>
                   <h3 className="font-bold text-slate-900 mb-2">{b.title}</h3>
                   <p className="text-slate-500 text-sm">{b.desc}</p>
                </div>
             ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Open Positions</h2>
            
            <div className="space-y-4">
              {jobs.map((job, i) => (
                <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-2 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <p className="text-slate-500 text-sm">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-2">
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                        <Briefcase className="h-3 w-3" /> {job.dept}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                         <MapPin className="h-3 w-3" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                         <Clock className="h-3 w-3" /> {job.type}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    <a href={`mailto:careers@olamillogiswift.ng?subject=Application for ${job.title}`}>
                      Apply Now <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-16 p-10 bg-slate-900 rounded-2xl text-center shadow-xl">
              <h3 className="text-2xl font-bold mb-2 text-white">Don't see the right role?</h3>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                We are always looking for talent. If you think you'd be a great fit, we'd love to hear from you.
              </p>
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                <a href="mailto:careers@olamillogiswift.ng?subject=General Inquiry">Email Recruitment</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
