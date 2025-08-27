import { ArticleEditor } from '@/components/article-editor-mobile'

export const metadata = {
  title: 'Write Article - Personal Blog',
  description: 'Create and publish a new article',
}

export default function WritePage() {
  return <ArticleEditor />
}