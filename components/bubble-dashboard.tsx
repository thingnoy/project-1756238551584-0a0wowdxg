'use client'

import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Eye, Plus, Sparkles, Zap, Heart, Star, TrendingUp } from 'lucide-react'
import { articleStorage } from '@/lib/storage'
import { Article } from '@/lib/types'

interface BubbleProps {
  article: Article
  size: number
  position: { x: number; y: number }
  delay: number
  rank: number
  containerSize: { width: number; height: number }
}

function ArticleBubble({ article, size, position, delay, rank, containerSize }: BubbleProps) {
  // Mobile-responsive sizing
  const isMobile = containerSize.width < 768
  const radius = Math.max(
    isMobile ? 50 : 60, 
    Math.min(isMobile ? 120 : 180, size * (isMobile ? 0.7 : 1))
  )
  const fontSize = Math.max(
    isMobile ? 10 : 12, 
    Math.min(isMobile ? 14 : 20, radius / (isMobile ? 6 : 10))
  )
  
  const [isHovered, setIsHovered] = useState(false)
  
  // Spring animations for ultra-smooth movement
  const x = useMotionValue(position.x)
  const y = useMotionValue(position.y)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })
  
  useEffect(() => {
    x.set(position.x)
    y.set(position.y)
  }, [position.x, position.y, x, y])
  
  // Dynamic gradient based on article rank
  const gradients = [
    'from-violet-500 via-purple-500 to-pink-500', // Most popular
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-emerald-500 via-green-500 to-lime-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-indigo-500 via-purple-500 to-pink-500'
  ]
  const gradientClass = gradients[Math.min(rank, gradients.length - 1)]
  
  const sparkleIcons = [Sparkles, Star, Zap, Heart, TrendingUp]
  const SparkleIcon = sparkleIcons[rank % sparkleIcons.length]

  return (
    <motion.div
      className="absolute gpu-accelerated"
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ 
        scale: 0, 
        opacity: 0,
        rotateX: -90,
        z: -100
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotateX: 0,
        z: 0
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay * 0.08,
        duration: 0.6
      }}
      whileHover={{ 
        scale: isMobile ? 1.1 : 1.2,
        z: 50,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { type: "spring", stiffness: 600, damping: 30 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/article/${article.id}`}>
        <motion.div
          className={`
            relative flex items-center justify-center
            bg-gradient-to-br ${gradientClass}
            text-white rounded-full cursor-pointer
            glass-strong gpu-accelerated
            overflow-hidden
            ${isMobile ? '' : 'glow-primary-lg'}
          `}
          style={{
            width: radius,
            height: radius,
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(139, 92, 246, 0.3)',
              '0 0 40px rgba(139, 92, 246, 0.5)',
              '0 0 20px rgba(139, 92, 246, 0.3)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Rotating gradient overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Sparkle effects - reduced for mobile performance */}
          <AnimatePresence>
            {isHovered && !isMobile && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.cos(i * 60 * Math.PI / 180) * (radius * 0.5)],
                      y: [0, Math.sin(i * 60 * Math.PI / 180) * (radius * 0.5)],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <Sparkles className="w-2 h-2 text-white/80" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
          
          <div className="text-center p-2 z-20 relative">
            {/* Rank indicator for top articles */}
            {rank < 3 && (
              <motion.div 
                className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {rank + 1}
              </motion.div>
            )}
            
            <motion.div
              className="mb-1"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <SparkleIcon size={Math.min(fontSize + 2, 16)} />
            </motion.div>
            
            <h3 
              className="font-bold leading-tight mb-1 line-clamp-2 drop-shadow-lg"
              style={{ fontSize: `${fontSize}px` }}
            >
              {article.title}
            </h3>
            
            <motion.div 
              className="flex items-center justify-center gap-1 bg-black/30 rounded-full px-2 py-1"
              whileHover={{ scale: 1.05 }}
            >
              <Eye size={fontSize * 0.7} />
              <span 
                className="font-semibold"
                style={{ fontSize: `${fontSize * 0.7}px` }}
              >
                {article.views > 999 ? `${(article.views/1000).toFixed(1)}k` : article.views}
              </span>
            </motion.div>
          </div>

          {/* Animated rings - fewer on mobile */}
          {Array.from({ length: isMobile ? 2 : 3 }).map((_, ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border border-white/20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.2, 0.6],
                rotate: 360,
              }}
              transition={{
                duration: 4 + ring,
                repeat: Infinity,
                ease: "easeInOut",
                delay: ring * 0.3,
              }}
            />
          ))}
        </motion.div>
      </Link>
    </motion.div>
  )
}

function AddArticleBubble({ position, containerSize }: { 
  position: { x: number; y: number }
  containerSize: { width: number; height: number }
}) {
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = containerSize.width < 768

  return (
    <motion.div
      className="absolute gpu-accelerated"
      initial={{ 
        scale: 0, 
        opacity: 0, 
        rotateY: -180 
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotateY: 0
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.4,
      }}
      whileHover={{ 
        scale: isMobile ? 1.15 : 1.3,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ 
        scale: 0.9,
        transition: { type: "spring", stiffness: 600, damping: 30 }
      }}
      style={{
        left: position.x,
        top: position.y,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href="/write">
        <motion.div
          className={`
            relative flex items-center justify-center
            ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} glass-strong
            border-2 border-dashed 
            rounded-full cursor-pointer
            ${isMobile ? '' : 'glow-primary'}
            hover:border-solid
            gpu-accelerated
          `}
          style={{
            borderColor: 'var(--primary-solid)',
          }}
          whileHover={{ 
            rotate: [0, 180, 360],
            borderColor: 'var(--accent-solid)',
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Pulsing background */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'var(--primary)',
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            animate={{ 
              rotate: isHovered ? 135 : 0,
              scale: isHovered ? 1.2 : 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <Plus className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white z-10 relative`} />
          </motion.div>
          
          {/* Mobile-optimized sparkle effects */}
          <AnimatePresence>
            {isHovered && (
              <>
                {Array.from({ length: isMobile ? 3 : 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.cos(i * 90 * Math.PI / 180) * 30],
                      y: [0, Math.sin(i * 90 * Math.PI / 180) * 30],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                    }}
                  >
                    <Plus className="w-3 h-3 text-white/70" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function BubbleDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stats = articleStorage.getArticleStats()
    setArticles(stats.articles)
    setIsMounted(true)

    const updateSize = () => {
      const isMobile = window.innerWidth < 768
      setContainerSize({
        width: Math.min(window.innerWidth - (isMobile ? 20 : 100), isMobile ? 380 : 1400),
        height: Math.min(window.innerHeight - (isMobile ? 100 : 150), isMobile ? 500 : 800),
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    
    // Refresh articles when dashboard is visible
    const interval = setInterval(() => {
      const newStats = articleStorage.getArticleStats()
      setArticles(newStats.articles)
    }, 5000)

    return () => {
      window.removeEventListener('resize', updateSize)
      clearInterval(interval)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current && containerSize.width >= 768) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }, [containerSize.width])

  if (!isMounted || containerSize.width === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-t-transparent"
          style={{ borderColor: 'var(--primary-solid)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  const isMobile = containerSize.width < 768
  
  // Enhanced bubble sizing with mobile considerations
  const maxViews = Math.max(...articles.map(a => a.views), 1)
  const bubblesWithSizes = articles.map((article, index) => ({
    article,
    size: (isMobile ? 60 : 80) + Math.pow(article.views / maxViews, 0.6) * (isMobile ? 60 : 100),
    rank: index
  }))

  // Mobile-optimized positioning algorithm
  const positionedBubbles = bubblesWithSizes.map((bubble, index) => {
    if (isMobile) {
      // Grid-based layout for mobile
      const cols = 2
      const rows = Math.ceil(bubblesWithSizes.length / cols)
      const col = index % cols
      const row = Math.floor(index / cols)
      
      const cellWidth = containerSize.width / cols
      const cellHeight = containerSize.height / (rows + 1)
      
      const position = {
        x: col * cellWidth + cellWidth/2 - bubble.size/2 + (Math.random() - 0.5) * 30,
        y: row * cellHeight + cellHeight/2 - bubble.size/2 + (Math.random() - 0.5) * 20,
      }

      return { ...bubble, position }
    } else {
      // Golden spiral for desktop
      const angle = index * 2.4 // Golden angle
      const radius = Math.sqrt(index + 1) * 50
      
      const centerX = containerSize.width / 2
      const centerY = containerSize.height / 2
      
      const randomOffset = {
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
      }

      const position = {
        x: Math.max(bubble.size/2, Math.min(containerSize.width - bubble.size/2, 
          centerX + Math.cos(angle) * radius + randomOffset.x - bubble.size / 2)),
        y: Math.max(bubble.size/2, Math.min(containerSize.height - bubble.size/2,
          centerY + Math.sin(angle) * radius + randomOffset.y - bubble.size / 2)),
      }

      return { ...bubble, position }
    }
  })

  const addButtonPosition = {
    x: containerSize.width / 2 - (isMobile ? 32 : 40),
    y: isMobile ? containerSize.height - 80 : containerSize.height / 2 - (isMobile ? 32 : 40),
  }

  return (
    <div className="relative w-full flex justify-center">
      {/* Dynamic background with mobile optimization */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--glow-primary) 0%, transparent 50%)`,
          }}
        />
      )}
      
      <motion.div
        ref={containerRef}
        className="relative glass rounded-3xl border-2 gpu-accelerated"
        style={{
          width: containerSize.width,
          height: containerSize.height,
          borderColor: 'var(--border)',
          margin: isMobile ? '1rem' : '2rem',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.6
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Simplified grid background for mobile */}
        {!isMobile && (
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"
                style={{ left: `${(i + 1) * 10}%` }}
                animate={{
                  opacity: [0.05, 0.2, 0.05],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        )}

        {/* Article bubbles */}
        <AnimatePresence mode="popLayout">
          {positionedBubbles.map((bubble, index) => (
            <ArticleBubble
              key={bubble.article.id}
              article={bubble.article}
              size={bubble.size}
              position={bubble.position}
              delay={index}
              rank={bubble.rank}
              containerSize={containerSize}
            />
          ))}
        </AnimatePresence>

        {/* Add article button */}
        <AddArticleBubble 
          position={addButtonPosition} 
          containerSize={containerSize}
        />

        {/* Optimized floating particles */}
        {Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: isMobile ? 2 : 3,
              height: isMobile ? 2 : 3,
              background: `var(--glow-${i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'})`,
              left: Math.random() * containerSize.width,
              top: Math.random() * containerSize.height,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: isMobile ? 6 : 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}