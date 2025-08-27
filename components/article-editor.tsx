'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Save, Eye, ArrowLeft, Hash } from 'lucide-react'
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
        excerpt: formData.excerpt || formData.content.slice(0, 150) + '...'
      }
      
      const validatedData = CreateArticleSchema.parse(dataToValidate)
      const article = articleStorage.createArticle(validatedData)
      
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
    <p key={index} className="mb-4 last:mb-0">
      {paragraph || '\u00A0'}
    </p>
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

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsPreview(!isPreview)}
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
              <Eye className="w-4 h-4" />
              {isPreview ? 'Edit' : 'Preview'}
            </motion.button>

            <motion.button
              onClick={handleSave}
              disabled={isSaving || !formData.title || !formData.content}
              className="
                flex items-center gap-2 px-6 py-2 rounded-lg
                bg-[var(--primary)] hover:bg-[var(--primary-hover)]
                text-white font-medium
                shadow-[var(--shadow-sm)]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Publish Article'}
            </motion.button>
          </div>
        </motion.div>

        {/* Editor */}
        <motion.div
          className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {!isPreview ? (
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <input
                  type="text"
                  placeholder="Article title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="
                    w-full text-3xl font-bold bg-transparent
                    border-none outline-none
                    text-[var(--foreground)]
                    placeholder-[var(--muted)]
                  "
                />
                {errors.title && (
                  <p className="text-[var(--error)] text-sm mt-2">{errors.title}</p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <textarea
                  placeholder="Brief excerpt (optional - will be auto-generated if empty)..."
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={2}
                  className="
                    w-full bg-transparent resize-none
                    border border-[var(--border)] rounded-lg p-3
                    text-[var(--muted)]
                    placeholder-[var(--muted)]
                    focus:border-[var(--primary)] focus:outline-none
                  "
                />
              </div>

              {/* Tags */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(tag => (
                    <motion.span
                      key={tag}
                      className="
                        inline-flex items-center gap-1 px-3 py-1 rounded-full
                        bg-[var(--primary)]/10 text-[var(--primary)]
                        text-sm font-medium
                      "
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-[var(--error)]"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags (press Enter)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="
                    w-full bg-transparent
                    border border-[var(--border)] rounded-lg p-3
                    text-[var(--foreground)]
                    placeholder-[var(--muted)]
                    focus:border-[var(--primary)] focus:outline-none
                  "
                />
              </div>

              {/* Content */}
              <div>
                <textarea
                  placeholder="Start writing your article..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={20}
                  className="
                    w-full bg-transparent resize-none
                    border border-[var(--border)] rounded-lg p-4
                    text-[var(--foreground)] leading-relaxed
                    placeholder-[var(--muted)]
                    focus:border-[var(--primary)] focus:outline-none
                  "
                />
                {errors.content && (
                  <p className="text-[var(--error)] text-sm mt-2">{errors.content}</p>
                )}
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)]">
                {formData.title || 'Untitled Article'}
              </h1>
              
              {formData.excerpt && (
                <p className="text-lg text-[var(--muted)] mb-6 italic">
                  {formData.excerpt}
                </p>
              )}

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="
                        inline-flex items-center gap-1 px-3 py-1 rounded-full
                        bg-[var(--primary)]/10 text-[var(--primary)]
                        text-sm font-medium
                      "
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-lg max-w-none text-[var(--foreground)]">
                {formData.content ? previewContent : (
                  <p className="text-[var(--muted)] italic">Start writing to see preview...</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}