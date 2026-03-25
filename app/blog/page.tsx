import { getArticles } from "@/lib/contentstack";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles - Mon Blog",
  description: "Tous nos articles sur le développement web",
};

export default async function BlogPage() {
  const articles = await getArticles();

  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = a.published_date ? new Date(a.published_date).getTime() : 0;
    const dateB = b.published_date ? new Date(b.published_date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tous les articles</h1>

      {sortedArticles.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Aucun article pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedArticles.map((article) => (
            <ArticleCard key={article.uid} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
