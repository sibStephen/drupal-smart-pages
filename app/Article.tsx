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
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<'fix' | 'regenerate' | null>(null);

  const handleAction = async (id: string, type: 'fix' | 'regenerate') => {
    setLoadingId(id);
    setLoadingType(type);
    
    try {
      const article = articles.find(a => a.id === id);
      if (!article) return;

      const prompt = type === 'fix' 
        ? `Correct the grammar and improve clarity of this content:\n\n${article.attributes.body.processed}`
        : `Rewrite this content in a more engaging way:\n\n${article.attributes.body.processed}`;

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
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.generated) {
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
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert(`Failed to ${type} content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingId(null);
      setLoadingType(null);
    }
  };

  return (
    <main className="container">
      <h1 className="title">Articles</h1>
      <div className="grid">
        {articles.map((article) => (
          <div key={article.id} className="card">
            <h2 className="card-title">{article.attributes.title}</h2>
            <div 
              className="card-content" 
              dangerouslySetInnerHTML={{ __html: article.attributes.body?.processed || '' }} 
            />
            <Link 
              href={`/article/${article.id}`} 
              className="read-more"
            >
              More Actions
            </Link>
            <div className="button-group">
              <button
                onClick={() => handleAction(article.id, 'fix')}
                disabled={loadingId === article.id && loadingType === 'fix'}
                className={`button ${loadingId === article.id && loadingType === 'fix' ? 'loading' : ''}`}
              >
                {loadingId === article.id && loadingType === 'fix' ? 'Processing...' : 'Fix Grammar'}
              </button>
              <button
                onClick={() => handleAction(article.id, 'regenerate')}
                disabled={loadingId === article.id && loadingType === 'regenerate'}
                className={`button ${loadingId === article.id && loadingType === 'regenerate' ? 'loading' : ''}`}
              >
                {loadingId === article.id && loadingType === 'regenerate' ? 'Generating...' : 'Regenerate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .title {
          font-size: 2rem;
          text-align: center;
          color: #2d3748;
          margin-bottom: 2rem;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .card {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .card-title {
          font-size: 1.25rem;
          color: #2d3748;
          margin-bottom: 0.75rem;
        }
        
        .card-content {
          font-size: 0.875rem;
          color: #4a5568;
          margin-bottom: 1rem;
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        
        .read-more {
          color: #3182ce;
          font-size: 0.875rem;
          display: inline-block;
          margin-bottom: 1rem;
        }
        
        .read-more:hover {
          text-decoration: underline;
        }
        
        .button-group {
          display: flex;
          gap: 0.5rem;
        }
        
        .button {
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          border: 1px solid #e2e8f0;
          background: white;
        }
        
        .button:hover:not(:disabled) {
          background: #f7fafc;
        }
        
        .button.loading {
          background: #4299e1;
          color: white;
          border-color: #4299e1;
        }
      `}</style>
    </main>
  );
}