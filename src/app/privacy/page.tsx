import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <div className="border-b pb-6 mb-8">
              <h1 className="text-3xl font-bold mb-2 text-slate-900">Privacy Policy</h1>
              <p className="text-slate-500">Effective Date: January 1, 2026</p>
            </div>
            
            <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
              <p>Your privacy is important to us at OlamilLogiSwift. This policy outlines how we handle your personal information.</p>
              
              <section>
                <h2 className="text-slate-900 text-xl font-bold mb-3">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, book a shipment, or contact support.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Personal identifiers (Name, email, phone number)</li>
                  <li>Shipping addresses and location data</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-slate-900 text-xl font-bold mb-3">2. How We Use Information</h2>
                <p>We use your information to provide, maintain, and improve our services, including processing transactions and sending shipment updates.</p>
              </section>

              <section>
                <h2 className="text-slate-900 text-xl font-bold mb-3">3. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
