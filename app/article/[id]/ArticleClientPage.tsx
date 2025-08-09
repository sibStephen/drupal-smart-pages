'use client';

import { useState } from 'react';

export default function ArticleClientPage({ article }: { article: any }) {
  const [content, setContent] = useState(article?.attributes?.body?.value || '');
  const [mode, setMode] = useState<'original' | 'corrected' | 'regenerated'>('original');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (type: 'correct' | 'regenerate') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = type === 'correct'
        ? `Correct the grammar and improve clarity of this content:\n\n${content}`
        : `Rewrite this content in a more engaging way:\n\n${content}`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article?.attributes.title || 'Untitled',
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

      setContent(data.generated);
      setMode(type === 'correct' ? 'corrected' : 'regenerated');

    } catch (err) {
      console.error('Content generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to process content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="article-container">
      <h1>{article?.attributes?.title || 'Untitled'}</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="content-controls">
        <button
          onClick={() => setMode('original')}
          disabled={isLoading}
          className={mode === 'original' ? 'active' : ''}
        >
          Original
        </button>
        <button
          onClick={() => handleAction('correct')}
          disabled={isLoading}
          className={mode === 'corrected' ? 'active' : ''}
        >
          {isLoading && mode === 'corrected' ? 'Processing...' : 'Fix Grammar'}
        </button>
        <button
          onClick={() => handleAction('regenerate')}
          disabled={isLoading}
          className={mode === 'regenerated' ? 'active' : ''}
        >
          {isLoading && mode === 'regenerated' ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      <div className="content-display">
        {mode === 'original' ? (
          <div dangerouslySetInnerHTML={{ __html: article?.attributes?.body?.value || '' }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>

      <style jsx>{`
        .article-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .error-message {
          color: red;
          margin: 1rem 0;
        }
        .content-controls {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
        }
        button.active {
          background: #0070f3;
          color: white;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .content-display {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}