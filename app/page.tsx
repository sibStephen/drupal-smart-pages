import ArticleList from './components/ArticleList';
import { fetchArticles } from '@/lib/drupal';

export default async function Home() {
  const articles = await fetchArticles();
  
  return (
    <main className="container">
      <h1 style={{textAlign:"center"}}> Decoupled Days 2025 </h1>
      <ArticleList initialArticles={articles} />
    </main>
  );
}