'use client'

import { BubbleDashboard } from '@/components/bubble-dashboard'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="flex flex-col items-center justify-center pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-4">
            Personal Blog
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-md mx-auto">
            Share your thoughts with the world. Each bubble represents an article, 
            sized by popularity.
          </p>
        </motion.div>
        
        <BubbleDashboard />
      </div>
    </div>
  )
}
