'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, Hash } from 'lucide-react'
import { Article } from '@/lib/types'
import { articleStorage } from '@/lib/storage'

interface ArticleViewProps {
  articleId: string
}

export function ArticleView({ articleId }: ArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            Article not found
          </h1>
          <Link href="/">
            <motion.button
              className="
                flex items-center gap-2 px-6 py-3 rounded-lg
                bg-[var(--primary)] hover:bg-[var(--primary-hover)]
                text-white font-medium
                shadow-[var(--shadow-sm)]
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
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

  const content = article.content.split('\n').map((paragraph, index) => (
    <motion.p 
      key={index} 
      className="mb-6 last:mb-0 text-lg leading-relaxed text-[var(--foreground)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {paragraph || '\u00A0'}
    </motion.p>
  ))

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/">
            <motion.button
              className="
                flex items-center gap-2 px-4 py-2 rounded-lg
                bg-[var(--surface)] hover:bg-[var(--surface-hover)]
                border border-[var(--border)]
                text-[var(--foreground)]
                shadow-[var(--shadow-sm)]
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </motion.button>
          </Link>

          <motion.div 
            className="flex items-center gap-4 text-sm text-[var(--muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.views} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.createdAt)}
            </span>
          </motion.div>
        </motion.div>

        {/* Article */}
        <motion.article
          className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-8 md:p-12">
            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-[var(--foreground)] leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {article.title}
            </motion.h1>

            {/* Excerpt */}
            {article.excerpt && (
              <motion.p 
                className="text-xl text-[var(--muted)] mb-8 italic leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {article.excerpt}
              </motion.p>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {article.tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    className="
                      inline-flex items-center gap-1 px-3 py-1 rounded-full
                      bg-[var(--primary)]/10 text-[var(--primary)]
                      text-sm font-medium
                    "
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 20,
                      delay: 0.5 + index * 0.1 
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {content}
            </div>
          </div>
        </motion.article>

        {/* Reading Progress Indicator */}
        <motion.div
          className="fixed top-0 left-0 h-1 bg-[var(--primary)] z-50"
          style={{
            transformOrigin: '0%',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
      </div>
    </div>
  )
}