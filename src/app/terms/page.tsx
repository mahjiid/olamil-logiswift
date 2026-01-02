import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <div className="border-b pb-6 mb-8">
              <h1 className="text-3xl font-bold mb-2 text-slate-900">Terms of Service</h1>
              <p className="text-slate-500">Effective Date: January 1, 2026</p>
            </div>
            
            <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
              <p>Welcome to OlamilLogiSwift. By accessing or using our website and services, you agree to be bound by these terms.</p>
              
              <section>
                <h2 className="text-slate-900 text-xl font-bold mb-3">1. Acceptance of Terms</h2>
                <p>By accessing our service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
              </section>

              <section>
                <h2 className="text-slate-900 text-xl font-bold mb-3">2. Shipping and Delivery</h2>
                <p>We strive to deliver packages on time. However, delivery estimates are not guaranteed and may be affected by factors outside our control, such as weather, traffic conditions, or regulatory inspections.</p>
              </section>

              <section>
                <h2 className="text-slate-900 text-xl font-bold mb-3">3. User Accounts</h2>
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
              </section>

              <section>
                <h2 className="text-slate-900 text-xl font-bold mb-3">4. Limitation of Liability</h2>
                <p>OlamilLogiSwift shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
