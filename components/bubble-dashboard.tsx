'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
}

function ArticleBubble({ article, size, position, delay, rank }: BubbleProps) {
  const radius = Math.max(60, Math.min(180, size))
  const fontSize = Math.max(12, Math.min(20, size / 10))
  const [isHovered, setIsHovered] = useState(false)
  
  // Create dynamic gradient based on article rank
  const gradients = [
    'from-purple-500 via-pink-500 to-red-500', // Most popular
    'from-blue-500 via-purple-500 to-pink-500',
    'from-green-500 via-blue-500 to-purple-500',
    'from-yellow-500 via-orange-500 to-red-500',
    'from-pink-500 via-purple-500 to-indigo-500'
  ]
  const gradientClass = gradients[Math.min(rank, gradients.length - 1)]
  
  const sparkleIcons = [Sparkles, Star, Zap, Heart, TrendingUp]
  const SparkleIcon = sparkleIcons[rank % sparkleIcons.length]

  return (
    <motion.div
      className="absolute"
      initial={{ 
        scale: 0, 
        opacity: 0, 
        x: position.x, 
        y: position.y,
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
        stiffness: 200,
        damping: 25,
        delay: delay * 0.15,
      }}
      whileHover={{ 
        scale: 1.2, 
        z: 50,
        transition: { duration: 0.3 }
      }}
      style={{
        left: position.x,
        top: position.y,
        perspective: 1000,
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
            glass-strong glow-primary-lg
            overflow-hidden
            float-animation
          `}
          style={{
            width: radius,
            height: radius,
            animationDelay: `${delay * 0.5}s`
          }}
          whileHover={{ 
            rotate: [0, -10, 10, -5, 5, 0],
            transition: { 
              duration: 1, 
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 0.8, 1]
            }
          }}
          whileTap={{ 
            scale: 0.9,
            rotate: 15
          }}
        >
          {/* Animated gradient overlay */}
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
          
          {/* Sparkle effects */}
          <AnimatePresence>
            {isHovered && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.cos(i * 45 * Math.PI / 180) * (radius * 0.6)],
                      y: [0, Math.sin(i * 45 * Math.PI / 180) * (radius * 0.6)],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-white/80" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
          
          <div className="text-center p-3 z-20 relative">
            {/* Rank indicator for top articles */}
            {rank < 3 && (
              <motion.div 
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {rank + 1}
              </motion.div>
            )}
            
            <motion.div
              className="mb-2"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <SparkleIcon size={fontSize + 4} />
            </motion.div>
            
            <h3 
              className="font-bold leading-tight mb-2 line-clamp-2 drop-shadow-lg"
              style={{ fontSize: `${fontSize}px` }}
            >
              {article.title}
            </h3>
            
            <motion.div 
              className="flex items-center justify-center gap-2 bg-black/20 rounded-full px-3 py-1"
              whileHover={{ scale: 1.05 }}
            >
              <Eye size={fontSize * 0.8} />
              <span 
                className="font-semibold"
                style={{ fontSize: `${fontSize * 0.8}px` }}
              >
                {article.views.toLocaleString()}
              </span>
            </motion.div>
          </div>

          {/* Multiple animated rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border-2 border-white/20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 0.2, 0.8],
                rotate: 360,
              }}
              transition={{
                duration: 4 + ring,
                repeat: Infinity,
                ease: "easeInOut",
                delay: ring * 0.5,
              }}
            />
          ))}
        </motion.div>
      </Link>
    </motion.div>
  )
}

function AddArticleBubble({ position }: { position: { x: number; y: number } }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="absolute"
      initial={{ 
        scale: 0, 
        opacity: 0, 
        x: position.x, 
        y: position.y,
        rotateY: -180 
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotateY: 0
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.5,
      }}
      whileHover={{ 
        scale: 1.3,
        transition: { duration: 0.3 }
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
          className="
            relative flex items-center justify-center
            w-24 h-24 glass-strong
            border-3 border-dashed 
            rounded-full cursor-pointer
            glow-primary
            hover:border-solid
            group
          "
          style={{
            borderColor: 'var(--primary-solid)',
          }}
          whileHover={{ 
            rotate: [0, 180, 360],
            borderColor: 'var(--accent-solid)',
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          whileTap={{ scale: 0.9 }}
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
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            animate={{ 
              rotate: isHovered ? 180 : 0,
              scale: isHovered ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-8 h-8 text-white z-10 relative" />
          </motion.div>
          
          {/* Sparkle effects on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                      y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                    }}
                  >
                    <Plus className="w-4 h-4 text-white/60" />
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
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stats = articleStorage.getArticleStats()
    setArticles(stats.articles)

    const updateSize = () => {
      setContainerSize({
        width: Math.min(window.innerWidth - 100, 1400),
        height: Math.min(window.innerHeight - 150, 900),
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }, [])

  // Enhanced bubble sizing and positioning
  const maxViews = Math.max(...articles.map(a => a.views), 1)
  const bubblesWithSizes = articles.map((article, index) => ({
    article,
    size: 80 + Math.pow(article.views / maxViews, 0.7) * 100, // More dramatic size differences
    rank: index
  }))

  // More sophisticated positioning using golden spiral
  const positionedBubbles = bubblesWithSizes.map((bubble, index) => {
    const angle = index * 2.4 // Golden angle
    const radius = Math.sqrt(index + 1) * 60
    
    const centerX = containerSize.width / 2
    const centerY = containerSize.height / 2
    
    // Apply some controlled randomness
    const randomOffset = {
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }

    const position = {
      x: centerX + Math.cos(angle) * radius + randomOffset.x - bubble.size / 2,
      y: centerY + Math.sin(angle) * radius + randomOffset.y - bubble.size / 2,
    }

    return {
      ...bubble,
      position,
    }
  })

  const addButtonPosition = {
    x: containerSize.width / 2 - 48,
    y: containerSize.height / 2 - 48,
  }

  return (
    <div 
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Dynamic background with mouse interaction */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--glow-primary) 0%, transparent 50%)`,
        }}
      />
      
      <motion.div
        ref={containerRef}
        className="relative mx-auto glass rounded-3xl border-2"
        style={{
          width: containerSize.width,
          height: containerSize.height,
          borderColor: 'var(--border)',
          marginTop: '2rem',
        }}
        initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ 
          duration: 1, 
          ease: "easeOut",
          staggerChildren: 0.1
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"
              style={{ left: `${(i + 1) * 5}%` }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ top: `${(i + 1) * 6.25}%` }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Article bubbles */}
        <AnimatePresence>
          {positionedBubbles.map((bubble, index) => (
            <ArticleBubble
              key={bubble.article.id}
              article={bubble.article}
              size={bubble.size}
              position={bubble.position}
              delay={index}
              rank={bubble.rank}
            />
          ))}
        </AnimatePresence>

        {/* Add article button */}
        <AddArticleBubble position={addButtonPosition} />

        {/* Enhanced floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full sparkle"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: i % 3 === 0 ? 'var(--glow-primary)' : 
                         i % 3 === 1 ? 'var(--glow-secondary)' : 'var(--glow-accent)',
              left: Math.random() * containerSize.width,
              top: Math.random() * containerSize.height,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Ambient light effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'var(--primary)',
              top: '10%',
              left: '10%',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{
              background: 'var(--secondary)',
              bottom: '10%',
              right: '10%',
              animation: 'float 10s ease-in-out infinite reverse',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}