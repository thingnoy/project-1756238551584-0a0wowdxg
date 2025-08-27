'use client'

import { BubbleDashboard } from '@/components/bubble-dashboard'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Sparkles, Zap, Heart, Star, TrendingUp } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const opacity = useTransform(scrollY, [0, 200], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Hero Section */}
      <motion.div 
        className="relative z-10 pt-32 pb-16"
        style={{ y: y1, opacity }}
      >
        <div className="text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Floating icons around title */}
            <div className="absolute inset-0 pointer-events-none">
              {[Sparkles, Star, Zap, Heart, TrendingUp].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${20 + index * 20}%`,
                    top: `${10 + (index % 2) * 80}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + index,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  <Icon 
                    className="w-6 h-6 opacity-20" 
                    style={{ color: index % 2 === 0 ? 'var(--glow-primary)' : 'var(--glow-secondary)' }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-transparent bg-clip-text"
              style={{ 
                backgroundImage: 'var(--primary)',
                filter: 'drop-shadow(0 0 20px var(--glow-primary))'
              }}
              animate={{
                textShadow: [
                  '0 0 20px var(--glow-primary)',
                  '0 0 40px var(--glow-primary)',
                  '0 0 20px var(--glow-primary)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Personal Blog
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-strong rounded-2xl p-8 mb-8 max-w-2xl mx-auto"
            >
              <p className="text-xl md:text-2xl text-[var(--foreground)] leading-relaxed">
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--secondary)' }}>
                  Experience the universe of ideas
                </span>
                {' '}through our revolutionary bubble interface. Each sphere represents a story, 
                sized by its impact, floating in your personal cosmos of creativity.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: Sparkles, text: "AI-Enhanced" },
                { icon: Zap, text: "Lightning Fast" },
                { icon: Heart, text: "Reader Loved" },
                { icon: TrendingUp, text: "Trend Tracking" }
              ].map((feature) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 20px var(--glow-primary)'
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ color: 'var(--foreground)' }}
                >
                  <feature.icon className="w-4 h-4" style={{ color: 'var(--primary-solid)' }} />
                  {feature.text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? 'var(--glow-primary)' : 
                i % 3 === 1 ? 'var(--glow-secondary)' : 'var(--glow-accent)'
              } 0%, transparent 70%)`,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Dashboard */}
      <motion.div
        style={{ y: y2 }}
        className="relative z-10"
      >
        <BubbleDashboard />
      </motion.div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'var(--primary)',
            top: '20%',
            left: '-10%',
            animationDuration: '8s',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl animate-pulse"
          style={{
            background: 'var(--secondary)',
            bottom: '20%',
            right: '-10%',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            background: 'var(--accent)',
            top: '50%',
            right: '20%',
            animationDuration: '12s',
            animationDelay: '4s',
          }}
        />
      </div>
    </div>
  )
}
