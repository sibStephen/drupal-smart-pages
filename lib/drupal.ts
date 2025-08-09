// lib/drupal.ts
import { DrupalArticle } from '@/types/article';

// Cache config for fetch requests (no revalidation)
const defaultCacheConfig = {
  next: {
    tags: ['drupal-articles'] // Optional: for manual revalidation
  }
};

export const fetchArticles = async (): Promise<DrupalArticle[]> => {
  try {
    const endpoint = `${process.env.DRUPAL_BASE_URL}/jsonapi/node/article`;
    const url = new URL(endpoint);
    
    url.searchParams.append('include', 'field_image');
    url.searchParams.append('sort', '-created');
    url.searchParams.append('fields[node--article]', 'title,body,path,field_image');
    
    const res = await fetch(url.toString(), {
      cache: 'force-cache', // Explicitly cache indefinitely
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      }
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Drupal API Error: ${res.status} ${res.statusText}\n${errorData}`);
    }

    const data = await res.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid Drupal API response structure');
    }

    return data.data as DrupalArticle[];
  } catch (error) {
    console.error('Drupal fetchArticles error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch articles from Drupal'
    );
  }
};

export const fetchArticle = async (id: string): Promise<DrupalArticle> => {
  try {
    const endpoint = `${process.env.DRUPAL_BASE_URL}/jsonapi/node/article/${id}`;
    const url = new URL(endpoint);
    
    url.searchParams.append('include', 'field_image');
    url.searchParams.append('fields[node--article]', 'title,body,path,field_image');

    const res = await fetch(url.toString(), {
      cache: 'force-cache', // Explicitly cache indefinitely
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      }
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Drupal API Error: ${res.status} ${res.statusText}\n${errorData}`);
    }

    const data = await res.json();
    
    if (!data.data) {
      throw new Error('Invalid Drupal API response structure');
    }

    return data.data as DrupalArticle;
  } catch (error) {
    console.error(`Drupal fetchArticle error for ID ${id}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch article from Drupal'
    );
  }
};

// Helper function remains the same
export const getArticlePath = (article: DrupalArticle): string => {
  return article.attributes.path?.alias 
    ? article.attributes.path.alias.replace('/article', '') 
    : `/articles/${article.id}`;
};