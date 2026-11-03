"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const PayContent = dynamic(() => import("./pay-content"), {
  ssr: false,
  loading: () => <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" aria-label="Loading checkout" />,
});

export default function PayPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-muted/30 py-8 md:py-20 px-4">
        <PayContent />
      </main>
      <Footer />
    </div>
  );
}
