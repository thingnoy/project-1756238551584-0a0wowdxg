'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Save, Eye, ArrowLeft, Hash, Wand2, Sparkles, Type, Palette } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { articleStorage } from '@/lib/storage'
import { CreateArticle, CreateArticleSchema } from '@/lib/types'

export function ArticleEditor() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateArticle>({
    title: '',
    content: '',
    excerpt: '',
    published: true,
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [wordCount, setWordCount] = useState(0)
  const [estimatedReadTime, setEstimatedReadTime] = useState(0)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
    setEstimatedReadTime(Math.max(1, Math.ceil(words.length / 200))) // Average reading speed
  }, [formData.content])

  const handleInputChange = (field: keyof CreateArticle, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!formData.tags.includes(newTag)) {
        handleInputChange('tags', [...formData.tags, newTag])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrors({})
    
    try {
      // Generate excerpt if not provided
      const dataToValidate = {
        ...formData,
        excerpt: formData.excerpt || formData.content.slice(0, 150) + (formData.content.length > 150 ? '...' : '')
      }
      
      const validatedData = CreateArticleSchema.parse(dataToValidate)
      const article = articleStorage.createArticle(validatedData)
      
      // Success animation before redirect
      await new Promise(resolve => setTimeout(resolve, 800))
      router.push(`/article/${article.id}`)
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const fieldErrors: Record<string, string> = {}
        const zodError = error as { errors: Array<{ path: string[]; message: string }> }
        zodError.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const previewContent = formData.content.split('\n').map((paragraph, index) => (
    <motion.p 
      key={index} 
      className="mb-6 last:mb-0 text-lg leading-relaxed"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {paragraph || '\u00A0'}
    </motion.p>
  ))

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
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
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
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

          <div className="flex items-center gap-4">
            {/* Writing stats */}
            <motion.div 
              className="glass rounded-xl px-4 py-2 text-sm text-[var(--muted)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Type className="w-4 h-4" />
                  {wordCount} words
                </span>
                <span>{estimatedReadTime} min read</span>
              </div>
            </motion.div>

            <motion.button
              onClick={() => setIsPreview(!isPreview)}
              className="
                flex items-center gap-2 px-6 py-3 rounded-xl
                glass-strong hover:glow-primary
                text-[var(--foreground)] font-medium
                border border-[var(--border)]
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                borderColor: isPreview ? 'var(--accent-solid)' : 'var(--border)'
              }}
            >
              <Eye className="w-5 h-5" />
              {isPreview ? 'Edit' : 'Preview'}
            </motion.button>

            <motion.button
              onClick={handleSave}
              disabled={isSaving || !formData.title || !formData.content}
              className="
                flex items-center gap-2 px-8 py-3 rounded-xl
                text-white font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed
                overflow-hidden relative
              "
              style={{ 
                background: 'var(--primary)',
                boxShadow: 'var(--shadow-glow-lg)'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 40px var(--glow-primary), 0 0 80px var(--glow-primary)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Wand2 className="w-5 h-5" />
                    </motion.div>
                    Creating Magic...
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Publish Article
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Editor */}
        <motion.div
          className="glass-strong rounded-3xl overflow-hidden border-2"
          style={{ borderColor: 'var(--border)' }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {!isPreview ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="p-8 space-y-8"
              >
                {/* Title */}
                <div className="relative">
                  <motion.input
                    ref={titleRef}
                    type="text"
                    placeholder="Your amazing title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="
                      w-full text-4xl md:text-5xl font-black bg-transparent
                      border-none outline-none text-transparent bg-clip-text
                      placeholder-[var(--muted)] placeholder-opacity-50
                    "
                    style={{ 
                      backgroundImage: 'var(--primary)',
                      caretColor: 'var(--foreground)'
                    }}
                    whileFocus={{ scale: 1.02 }}
                  />
                  {errors.title && (
                    <motion.p 
                      className="text-red-500 text-sm mt-2 flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      {errors.title}
                    </motion.p>
                  )}
                </div>

                {/* Excerpt */}
                <motion.div
                  className="glass rounded-2xl p-6"
                  whileFocus={{ scale: 1.01 }}
                >
                  <textarea
                    placeholder="Captivating excerpt (auto-generated if empty)..."
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    className="
                      w-full bg-transparent resize-none
                      border-none outline-none text-lg
                      text-[var(--foreground)]
                      placeholder-[var(--muted)]
                    "
                  />
                </motion.div>

                {/* Tags */}
                <div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <AnimatePresence>
                      {formData.tags.map(tag => (
                        <motion.span
                          key={tag}
                          layout
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="
                            inline-flex items-center gap-2 px-4 py-2 rounded-full
                            glass-strong glow-primary
                            text-sm font-medium cursor-pointer
                          "
                          style={{ color: 'var(--primary-solid)' }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 0 20px var(--glow-primary)'
                          }}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <Hash className="w-3 h-3" />
                          {tag}
                          <span className="ml-1 hover:text-red-400 transition-colors">×</span>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  <motion.input
                    type="text"
                    placeholder="Add magical tags (press Enter)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="
                      w-full bg-transparent glass rounded-xl p-4
                      border border-[var(--border)] outline-none text-lg
                      text-[var(--foreground)]
                      placeholder-[var(--muted)]
                      focus:border-[var(--primary-solid)] focus:glow-primary
                    "
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                {/* Content */}
                <motion.div
                  className="glass rounded-2xl p-6"
                  whileFocus={{ scale: 1.005 }}
                >
                  <textarea
                    placeholder="Let your creativity flow... ✨"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={20}
                    className="
                      w-full bg-transparent resize-none
                      border-none outline-none text-lg leading-relaxed
                      text-[var(--foreground)]
                      placeholder-[var(--muted)]
                    "
                  />
                  {errors.content && (
                    <motion.p 
                      className="text-red-500 text-sm mt-4 flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      {errors.content}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            ) : (
              /* Preview */
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-8"
              >
                <motion.h1 
                  className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text"
                  style={{ backgroundImage: 'var(--primary)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formData.title || 'Untitled Masterpiece'}
                </motion.h1>
                
                {formData.excerpt && (
                  <motion.p 
                    className="text-xl text-[var(--muted)] mb-8 italic glass rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {formData.excerpt}
                  </motion.p>
                )}

                {formData.tags.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {formData.tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        className="
                          inline-flex items-center gap-1 px-3 py-1 rounded-full
                          glass-strong glow-primary
                          text-sm font-medium
                        "
                        style={{ color: 'var(--primary-solid)' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Hash className="w-3 h-3" />
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                <motion.div 
                  className="prose prose-lg max-w-none text-[var(--foreground)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {formData.content ? previewContent : (
                    <p className="text-[var(--muted)] italic flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Start writing to see your masterpiece come to life...
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}