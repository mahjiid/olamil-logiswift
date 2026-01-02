"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface TimelineEvent {
  status: string
  location: string
  time: string | null
  completed: boolean
}

export default function TrackingTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
      {events.map((event, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="relative pl-8"
        >
          <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 transition-colors duration-500 ${event.completed ? "bg-primary border-primary" : "bg-background border-muted"}`}>
            {event.completed && <CheckCircle2 className="h-3 w-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
          </span>
          <div className="space-y-1">
            <p className={`text-sm font-medium ${event.completed ? "text-foreground" : "text-muted-foreground"}`}>
              {event.status}
            </p>
            <p className="text-xs text-muted-foreground">{event.location}</p>
            {event.time && <p className="text-xs text-muted-foreground">{event.time}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
