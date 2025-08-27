'use client'

import { BubbleDashboard } from '@/components/bubble-dashboard'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Sparkles, Zap, Heart, Star, TrendingUp } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollY } = useScroll()
  
  // Ultra-smooth parallax effects
  const y1 = useSpring(useTransform(scrollY, [0, 300], [0, -50]), {
    stiffness: 300,
    damping: 30
  })
  const y2 = useSpring(useTransform(scrollY, [0, 300], [0, -100]), {
    stiffness: 200,
    damping: 25
  })
  const opacity = useSpring(useTransform(scrollY, [0, 200], [1, 0]), {
    stiffness: 400,
    damping: 40
  })

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden gpu-accelerated" style={{ background: 'var(--background)' }}>
      {/* Hero Section - Mobile Optimized */}
      <motion.div 
        className="relative z-10 px-4 sm:px-6 lg:px-8"
        style={{ 
          y: isMobile ? 0 : y1, 
          opacity: isMobile ? 1 : opacity 
        }}
      >
        <div className={`text-center max-w-4xl mx-auto ${isMobile ? 'pt-16 pb-8' : 'pt-32 pb-16'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.8 
            }}
            className="relative"
          >
            {/* Floating icons around title - Hidden on mobile */}
            {!isMobile && (
              <div className="absolute inset-0 pointer-events-none">
                {[Sparkles, Star, Zap, Heart, TrendingUp].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${10 + (index % 2) * 80}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon 
                      className="w-4 h-4 sm:w-6 sm:h-6 opacity-20" 
                      style={{ color: index % 2 === 0 ? 'var(--glow-primary)' : 'var(--glow-secondary)' }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            <motion.h1 
              className={`${
                isMobile 
                  ? 'text-4xl sm:text-5xl' 
                  : 'text-5xl md:text-7xl lg:text-8xl'
              } font-black mb-4 sm:mb-6 text-transparent bg-clip-text leading-tight`}
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
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.3 
              }}
              className={`glass-strong rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 max-w-2xl mx-auto ${
                isMobile ? 'mx-4' : ''
              }`}
            >
              <p className={`${
                isMobile ? 'text-lg' : 'text-xl md:text-2xl'
              } text-[var(--foreground)] leading-relaxed`}>
                <span className="text-transparent bg-clip-text font-semibold" style={{ backgroundImage: 'var(--secondary)' }}>
                  Experience the universe of ideas
                </span>
                {' '}through our revolutionary bubble interface. Each sphere represents a story, 
                sized by its impact, floating in your personal cosmos of creativity.
              </p>
            </motion.div>

            <motion.div
              className={`flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 ${
                isMobile ? 'px-4' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.6 
              }}
            >
              {[
                { icon: Sparkles, text: "AI-Enhanced" },
                { icon: Zap, text: "Lightning Fast" },
                { icon: Heart, text: "Reader Loved" },
                { icon: TrendingUp, text: "Trend Tracking" }
              ].map((feature) => (
                <motion.div
                  key={feature.text}
                  className={`flex items-center gap-2 glass rounded-full px-3 py-2 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  } font-medium gpu-accelerated`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 20px var(--glow-primary)',
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { type: "spring", stiffness: 600, damping: 30 }
                  }}
                  style={{ color: 'var(--foreground)' }}
                >
                  <feature.icon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} style={{ color: 'var(--primary-solid)' }} />
                  {feature.text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Background Elements - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: isMobile ? 15 : 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * (isMobile ? 60 : 100) + (isMobile ? 15 : 20),
              height: Math.random() * (isMobile ? 60 : 100) + (isMobile ? 15 : 20),
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? 'var(--glow-primary)' : 
                i % 3 === 1 ? 'var(--glow-secondary)' : 'var(--glow-accent)'
              } 0%, transparent 70%)`,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: isMobile ? 15 : 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Dashboard - Mobile responsive */}
      <motion.div
        style={{ y: isMobile ? 0 : y2 }}
        className="relative z-10"
      >
        <BubbleDashboard />
      </motion.div>

      {/* Gradient Orbs - Simplified for mobile */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {[
            { size: isMobile ? 200 : 500, position: { top: '20%', left: '-5%' }, color: 'var(--primary)', delay: 0 },
            { size: isMobile ? 150 : 400, position: { bottom: '20%', right: '-5%' }, color: 'var(--secondary)', delay: 2 },
            ...(isMobile ? [] : [{ size: 300, position: { top: '50%', right: '20%' }, color: 'var(--accent)', delay: 4 }])
          ].map((orb, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full blur-3xl"
              style={{
                width: orb.size,
                height: orb.size,
                background: orb.color,
                ...orb.position,
                opacity: isMobile ? 0.1 : 0.15,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [isMobile ? 0.1 : 0.15, isMobile ? 0.15 : 0.25, isMobile ? 0.1 : 0.15],
              }}
              transition={{
                duration: 8 + orb.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: orb.delay,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}