import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { fetchArticles } from "@/lib/drupal";

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await fetchArticles();

  const paths = articles.map((article: any) => {
    const alias = article.attributes?.path?.alias;
    const slug = alias ? alias.replace("/article/", "") : article.id;

    return {
      params: { slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const alias = `/article/${slug}`;

  const res = await fetch(`${process.env.DRUPAL_BASE_URL}/jsonapi/node/article?include=field_image`);
  const data = await res.json();

  const article = data.data.find(
    (item: any) => item.attributes?.path?.alias === alias
  ) || null;

  return {
    props: { article },
    revalidate: 3600, // Enable ISR
  };
};

export default function ArticlePage({ article }: { article: any }) {
  const [mode, setMode] = useState<"correct" | "regenerate">("correct");
  const title = article?.attributes?.title || "Untitled";
  const body = article?.attributes?.body?.value || "No content available";

  const correctedContent = mode === "correct"
    ? `(Grammar Checked) ${body}`
    : `(AI Regenerated) [Regenerated version will appear here]`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="article-list max-w-3xl mx-auto py-12 px-4">
        <div className="article-card">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <article className="prose prose-lg" dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </main>
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
    </>
  );
} 
