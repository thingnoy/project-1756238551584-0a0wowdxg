import { nanoid } from 'nanoid'
import { Article, CreateArticle } from './types'

const STORAGE_KEY = 'blog_articles'

export class ArticleStorage {
  private getArticles(): Article[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private saveArticles(articles: Article[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    } catch (error) {
      console.error('Failed to save articles:', error)
    }
  }

  getAllArticles(): Article[] {
    return this.getArticles().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  getPublishedArticles(): Article[] {
    return this.getAllArticles().filter(article => article.published)
  }

  getArticleById(id: string): Article | null {
    const articles = this.getArticles()
    return articles.find(article => article.id === id) || null
  }

  createArticle(data: CreateArticle): Article {
    const article: Article = {
      ...data,
      id: nanoid(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const articles = this.getArticles()
    articles.push(article)
    this.saveArticles(articles)

    return article
  }

  updateArticle(id: string, updates: Partial<CreateArticle>): Article | null {
    const articles = this.getArticles()
    const index = articles.findIndex(article => article.id === id)
    
    if (index === -1) return null

    articles[index] = {
      ...articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveArticles(articles)
    return articles[index]
  }

  deleteArticle(id: string): boolean {
    const articles = this.getArticles()
    const filteredArticles = articles.filter(article => article.id !== id)
    
    if (filteredArticles.length === articles.length) return false

    this.saveArticles(filteredArticles)
    return true
  }

  incrementViews(id: string): void {
    const articles = this.getArticles()
    const article = articles.find(a => a.id === id)
    
    if (article) {
      article.views += 1
      this.saveArticles(articles)
    }
  }

  getArticleStats() {
    const articles = this.getPublishedArticles()
    const totalViews = articles.reduce((sum, article) => sum + article.views, 0)
    const mostViewed = articles.sort((a, b) => b.views - a.views)

    return {
      totalArticles: articles.length,
      totalViews,
      mostViewedArticle: mostViewed[0] || null,
      articles: mostViewed,
    }
  }
}

export const articleStorage = new ArticleStorage()