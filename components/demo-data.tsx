'use client'

import { useEffect } from 'react'
import { articleStorage } from '@/lib/storage'

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if demo data already exists
    const existingArticles = articleStorage.getAllArticles()
    if (existingArticles.length === 0) {
      // Create some demo articles
      const demoArticles = [
        {
          title: "Welcome to Your Personal Blog",
          content: `Welcome to your beautiful new blog platform! This is a demonstration article to show you how the Apple Watch-inspired bubble dashboard works.

Each bubble on your dashboard represents an article, and the size of the bubble corresponds to how many views that article has received. The more popular an article, the bigger its bubble becomes!

This blog platform features:

• A unique bubble-based dashboard inspired by Apple Watch
• Easy-to-use article editor with live preview
• Dark and light theme support
• Responsive design that works on all devices
• Local storage for your articles (no login required)
• Smooth animations and modern design

To get started, click the "+" button in the center of the dashboard to create your first article. The editor is simple yet powerful, allowing you to focus on writing great content.

Your articles are automatically saved to your browser's local storage, so they'll be there whenever you return. Each time someone reads an article, it gains a view, making its bubble grow larger on the dashboard.

Happy writing!`,
          excerpt: "Learn how to use your new blog platform with this comprehensive guide to getting started.",
          tags: ["welcome", "tutorial", "getting-started"],
          published: true
        },
        {
          title: "The Art of Minimalist Design",
          content: `Minimalism in design is not just about using less—it's about using exactly what you need and nothing more. This philosophy has shaped some of the most iconic designs in history.

In web design, minimalism helps create clarity and focus. When users visit your site, they should immediately understand what you offer and how to get it. Every element should have a purpose.

Key principles of minimalist design:

1. White space is your friend
2. Typography matters more than you think
3. Color should enhance, not distract
4. Every element must justify its existence

The bubble dashboard you're looking at right now is a perfect example of minimalist design. It shows you exactly what you need to know—your articles and their popularity—without any clutter or unnecessary decoration.

Remember: good design is invisible. If users are thinking about your design instead of your content, you've probably added too much.`,
          excerpt: "Exploring the principles of minimalist design and how they apply to modern web interfaces.",
          tags: ["design", "minimalism", "ui-ux"],
          published: true
        },
        {
          title: "Building Better User Experiences",
          content: `User experience is at the heart of every successful digital product. It's not just about making things look pretty—it's about creating intuitive, efficient, and delightful interactions.

Great UX starts with understanding your users. What are they trying to accomplish? What frustrates them? What makes them happy? These questions should guide every design decision.

This blog platform was designed with UX in mind:

• The bubble visualization makes it instantly clear which articles are popular
• The writing interface removes distractions so you can focus on content
• Theme switching respects user preferences
• Animations provide feedback and create emotional connection

Small details matter. The way a button responds when clicked, the smoothness of transitions, the readability of text—these seemingly minor elements combine to create the overall experience.

Always remember: you are not your user. Test your assumptions, gather feedback, and iterate based on real usage patterns.`,
          excerpt: "Understanding the fundamentals of user experience design and why it matters for digital products.",
          tags: ["ux", "user-experience", "product-design"],
          published: true
        }
      ]

      // Create articles with different view counts to demonstrate bubble sizing
      demoArticles.forEach((articleData, index) => {
        const article = articleStorage.createArticle(articleData)
        
        // Add some views to demonstrate bubble sizing
        const viewCounts = [25, 12, 8] // Different view counts for different bubble sizes
        for (let i = 0; i < viewCounts[index]; i++) {
          articleStorage.incrementViews(article.id)
        }
      })
    }
  }, [])

  return <>{children}</>
}