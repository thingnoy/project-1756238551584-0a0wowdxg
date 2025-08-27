import { z } from 'zod'

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  views: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
  published: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
})

export type Article = z.infer<typeof ArticleSchema>

export const CreateArticleSchema = ArticleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
})

export type CreateArticle = z.infer<typeof CreateArticleSchema>