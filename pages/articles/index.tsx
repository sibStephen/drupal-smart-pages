import { fetchArticles } from "@/lib/drupal";

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map((article: any) => (
          <li key={article.id}>
            <a href={`/articles/${article.attributes.path.alias.replace('/article', '')}`}>
              {article.attributes.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
