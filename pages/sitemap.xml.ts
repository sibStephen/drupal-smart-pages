import { GetServerSideProps } from 'next';

const DRUPAL_BASE_URL = process.env.DRUPAL_BASE_URL || 'http://localhost:3000';

function generateSiteMap(articles: any[]) {
  const urls = articles
    .map((article) => {
      const alias = article.attributes?.path?.alias;
      const slug = alias ? alias.replace('/article/', '') : article.id;
      return `
        <url>
          <loc>${DRUPAL_BASE_URL}/articles/${slug}</loc>
          <lastmod>${article.attributes.changed}</lastmod>
        </url>
      `;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const response = await fetch(`${process.env.DRUPAL_BASE_URL}/jsonapi/node/article`);
  const data = await response.json();
  const sitemap = generateSiteMap(data.data);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
