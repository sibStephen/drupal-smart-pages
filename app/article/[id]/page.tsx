import { notFound } from 'next/navigation';
import ArticleClientPage from './ArticleClientPage';

export default async function ArticlePage({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(
      `${process.env.DRUPAL_BASE_URL}/jsonapi/node/article/${params.id}`,
      {
        headers: {
          'Accept': 'application/vnd.api+json',
        },
        next: { revalidate: 60 } // ISR
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch article: ${res.status}`);
    }

    const data = await res.json();
    const article = data.data;

    return <ArticleClientPage article={article} />;
  } catch (error) {
    console.error('Article page error:', error);
    return <div>Error loading article</div>;
  }
}