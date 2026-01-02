"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  {
    src: "/images/hero-bg.png",
    alt: "Fast Delivery in Lagos",
  },
  {
    src: "/images/happy-customer.png",
    alt: "Happy Customer Receiving Package",
  },
  {
    src: "/images/cargo-ship.png",
    alt: "International Sea Freight",
  },
  {
    src: "/images/air-freight.png",
    alt: "Global Air Cargo",
  }
]

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={images[index].src} 
            alt={images[index].alt} 
            className="w-full h-full object-cover opacity-60" 
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white dark:from-slate-950/80 dark:to-background mix-blend-overlay" />
      <div className="absolute inset-0 bg-white/20 dark:bg-black/20" />
    </div>
  )
}
