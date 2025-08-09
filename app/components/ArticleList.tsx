'use client';

import { useState } from 'react';
import Link from 'next/link';

type Article = {
  id: string;
  attributes: {
    title: string;
    body: {
      processed: string;
    };
    path: {
      alias: string;
    };
  };
};

export default function ArticleList({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loadingStates, setLoadingStates] = useState<Record<string, 'fix' | 'regenerate' | null>>({});

  const handleAction = async (id: string, type: 'fix' | 'regenerate') => {
    try {
      // Set loading state for this specific article
      setLoadingStates(prev => ({ ...prev, [id]: type }));

      const article = articles.find(a => a.id === id);
      if (!article) return;

      const prompt = type === 'fix'
        ? `Correct the grammar and improve clarity of this content:\n\n${article.attributes.body.processed}`
        : `Rewrite this content in a more engaging way:\n\n${article.attributes.body.processed}`;

      // Call the API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.attributes.title,
          body: prompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();

      if (!data.success || !data.generated) {
        throw new Error(data.error || 'No content generated');
      }

      // Update the article content
      setArticles(prev => prev.map(a => 
        a.id === id ? {
          ...a,
          attributes: {
            ...a.attributes,
            body: {
              ...a.attributes.body,
              processed: data.generated
            }
          }
        } : a
      ));

    } catch (error) {
      console.error('Action failed:', error);
      alert(`Failed to ${type} content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="article-list">
      {articles.map((article) => (
        <div key={article.id} className="article-card">
          <h2>{article.attributes.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: article.attributes.body.processed }} />
          <Link href={`/article/${article.id}`}>More Actions</Link>
          <div className="action-buttons">
            <button
              onClick={() => handleAction(article.id, 'fix')}
              disabled={loadingStates[article.id] === 'fix'}
            >
              {loadingStates[article.id] === 'fix' ? 'Processing...' : 'Fix Grammar'}
            </button>
            <button
              onClick={() => handleAction(article.id, 'regenerate')}
              disabled={loadingStates[article.id] === 'regenerate'}
            >
              {loadingStates[article.id] === 'regenerate' ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        .article-list {
          display: flex;
          flex-direction: row;
          gap: 1.5rem;
          padding: 2rem;
          flex-wrap: wrap;
        }
        .article-card {
          border: 1px solid #ddd;
          padding: 1.5rem;
          border-radius: 8px;
        }
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
        }
        button:disabled {
          background: #ccc;
        }
      `}</style>
    </div>
  );
}