'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, Hash, Sparkles, Clock, User } from 'lucide-react'
import { Article } from '@/lib/types'
import { articleStorage } from '@/lib/storage'

interface ArticleViewProps {
  articleId: string
}

export function ArticleView({ articleId }: ArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const fetchArticle = () => {
      const fetchedArticle = articleStorage.getArticleById(articleId)
      
      if (fetchedArticle) {
        // Increment views
        articleStorage.incrementViews(articleId)
        // Fetch updated article with new view count
        setArticle(articleStorage.getArticleById(articleId))
      }
      
      setLoading(false)
    }

    fetchArticle()
  }, [articleId])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setReadingProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--background)' }}>
        {/* Loading animation background */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                background: `var(--glow-${i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'})`,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-t-transparent"
            style={{ borderColor: 'var(--primary-solid)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-xl font-medium"
            style={{ color: 'var(--foreground)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading your story...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <motion.div
          className="text-center glass-strong rounded-3xl p-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--primary)' }}
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Story Not Found
          </h1>
          <p className="text-lg text-[var(--muted)] mb-8">
            This tale seems to have wandered off into the digital void.
          </p>
          <Link href="/">
            <motion.button
              className="
                flex items-center gap-3 px-8 py-4 rounded-xl mx-auto
                text-white font-semibold
              "
              style={{ background: 'var(--primary)' }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px var(--glow-primary)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Universe
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const estimatedReadTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200))

  const content = article.content.split('\n').map((paragraph, index) => (
    <motion.p 
      key={index} 
      className="mb-8 last:mb-0 text-lg leading-relaxed"
      style={{ color: 'var(--foreground)' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {paragraph || '\u00A0'}
    </motion.p>
  ))

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 z-50 rounded-r-full"
        style={{ 
          background: 'var(--primary)',
          boxShadow: '0 0 10px var(--glow-primary)'
        }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              background: `radial-gradient(circle, var(--glow-${
                i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'
              }) 0%, transparent 70%)`,
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
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/">
            <motion.button
              className="
                flex items-center gap-3 px-6 py-3 rounded-2xl
                glass-strong glow-primary
                text-[var(--foreground)] font-medium
              "
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px var(--glow-primary)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Universe
            </motion.button>
          </Link>

          <motion.div 
            className="flex items-center gap-6 text-sm glass rounded-2xl px-6 py-3"
            style={{ color: 'var(--muted)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {estimatedReadTime} min read
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.createdAt)}
            </span>
          </motion.div>
        </motion.div>

        {/* Article */}
        <motion.article
          className="glass-strong rounded-3xl overflow-hidden border-2 relative"
          style={{ borderColor: 'var(--border)' }}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div 
              className="absolute top-0 left-0 w-full h-32 opacity-50"
              style={{ background: 'var(--primary)' }}
            />
          </div>

          <div className="relative z-10 p-8 md:p-16">
            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 text-transparent bg-clip-text leading-tight"
              style={{ 
                backgroundImage: 'var(--primary)',
                filter: 'drop-shadow(0 0 20px var(--glow-primary))'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {article.title}
            </motion.h1>

            {/* Author info */}
            <motion.div 
              className="flex items-center gap-4 mb-8 glass rounded-2xl p-4 w-fit"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'var(--primary)' }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Anonymous Writer</p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Digital Storyteller</p>
              </div>
            </motion.div>

            {/* Excerpt */}
            <AnimatePresence>
              {article.excerpt && (
                <motion.div
                  className="glass rounded-2xl p-8 mb-12"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.p 
                    className="text-xl md:text-2xl italic leading-relaxed text-center"
                    style={{ color: 'var(--muted)' }}
                  >
                    &ldquo;{article.excerpt}&rdquo;
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tags */}
            <AnimatePresence>
              {article.tags.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-3 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  {article.tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      className="
                        inline-flex items-center gap-2 px-4 py-2 rounded-full
                        glass-strong glow-primary
                        text-sm font-medium
                      "
                      style={{ color: 'var(--primary-solid)' }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 20,
                        delay: 1.2 + index * 0.1 
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 0 20px var(--glow-primary)'
                      }}
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <motion.div 
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {content}
            </motion.div>

            {/* End flourish */}
            <motion.div
              className="flex justify-center mt-16 pt-8 border-t border-[var(--border)]"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex items-center gap-2 text-[var(--muted)]"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-lg font-medium">End of Story</span>
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}