import { ArticleView } from '@/components/article-view'

interface ArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params
  
  return <ArticleView articleId={id} />
}