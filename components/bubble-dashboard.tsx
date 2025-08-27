'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Plus } from 'lucide-react'
import { articleStorage } from '@/lib/storage'
import { Article } from '@/lib/types'

interface BubbleProps {
  article: Article
  size: number
  position: { x: number; y: number }
  delay: number
}

function ArticleBubble({ article, size, position, delay }: BubbleProps) {
  const radius = Math.max(40, Math.min(120, size))
  const fontSize = Math.max(10, Math.min(16, size / 8))

  return (
    <motion.div
      className="absolute"
      initial={{ scale: 0, opacity: 0, x: position.x, y: position.y }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay * 0.1,
      }}
      whileHover={{ scale: 1.1, z: 10 }}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <Link href={`/article/${article.id}`}>
        <motion.div
          className="
            relative flex items-center justify-center
            bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]
            text-white rounded-full cursor-pointer
            shadow-[var(--shadow-lg)]
            overflow-hidden
          "
          style={{
            width: radius,
            height: radius,
          }}
          whileHover={{ 
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          
          <div className="text-center p-2 z-10">
            <h3 
              className="font-semibold leading-tight mb-1 line-clamp-2"
              style={{ fontSize: `${fontSize}px` }}
            >
              {article.title}
            </h3>
            <div className="flex items-center justify-center gap-1 opacity-80">
              <Eye size={fontSize * 0.7} />
              <span style={{ fontSize: `${fontSize * 0.7}px` }}>
                {article.views}
              </span>
            </div>
          </div>

          {/* Animated ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

function AddArticleBubble({ position }: { position: { x: number; y: number } }) {
  return (
    <motion.div
      className="absolute"
      initial={{ scale: 0, opacity: 0, x: position.x, y: position.y }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.1 }}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <Link href="/write">
        <motion.div
          className="
            relative flex items-center justify-center
            w-16 h-16 bg-[var(--surface)] hover:bg-[var(--surface-hover)]
            border-2 border-dashed border-[var(--border)]
            rounded-full cursor-pointer
            shadow-[var(--shadow-md)]
          "
          whileHover={{ 
            rotate: 180,
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6 text-[var(--muted)]" />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function BubbleDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const stats = articleStorage.getArticleStats()
    setArticles(stats.articles)

    const updateSize = () => {
      setContainerSize({
        width: Math.min(window.innerWidth - 100, 1000),
        height: Math.min(window.innerHeight - 200, 700),
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Calculate bubble sizes based on views (logarithmic scale for better distribution)
  const maxViews = Math.max(...articles.map(a => a.views), 1)
  const bubblesWithSizes = articles.map(article => ({
    article,
    size: 60 + Math.log(article.views + 1) / Math.log(maxViews + 1) * 60
  }))

  // Position bubbles using a simple circle packing algorithm
  const positionedBubbles = bubblesWithSizes.map((bubble, index) => {
    const angle = (index / bubblesWithSizes.length) * 2 * Math.PI
    const radiusFromCenter = Math.min(containerSize.width, containerSize.height) * 0.25
    
    // Add some randomness to avoid perfect circular arrangement
    const randomOffset = {
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
    }

    const position = {
      x: containerSize.width / 2 + Math.cos(angle) * radiusFromCenter + randomOffset.x - bubble.size / 2,
      y: containerSize.height / 2 + Math.sin(angle) * radiusFromCenter + randomOffset.y - bubble.size / 2,
    }

    return {
      ...bubble,
      position,
    }
  })

  // Position for add article button
  const addButtonPosition = {
    x: containerSize.width / 2 - 32,
    y: containerSize.height / 2 - 32,
  }

  return (
    <div className="relative w-full min-h-screen bg-[var(--background)] overflow-hidden">
      <motion.div
        className="relative mx-auto"
        style={{
          width: containerSize.width,
          height: containerSize.height,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 rounded-3xl" />

        {/* Article bubbles */}
        {positionedBubbles.map((bubble, index) => (
          <ArticleBubble
            key={bubble.article.id}
            article={bubble.article}
            size={bubble.size}
            position={bubble.position}
            delay={index}
          />
        ))}

        {/* Add article button */}
        <AddArticleBubble position={addButtonPosition} />

        {/* Floating particles for ambient effect */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--primary)]/20 rounded-full"
            style={{
              left: Math.random() * containerSize.width,
              top: Math.random() * containerSize.height,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}