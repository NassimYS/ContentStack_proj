import { getHomepage, getArticles, getCategories } from "@/lib/contentstack";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";
import { Article } from "@/lib/types";

export default async function Home() {
  const [homepage, articles, categories] = await Promise.all([
    getHomepage(),
    getArticles(),
    getCategories(),
  ]);

  // Article mis en avant
  const featuredRef = homepage?.featured_article?.article;
  let featuredArticle: Article | undefined;
  if (featuredRef && featuredRef.length > 0) {
    featuredArticle = featuredRef[0];
    // Si la référence n'est pas entièrement résolue, chercher dans les articles
    if (!featuredArticle.title && featuredArticle.uid) {
      featuredArticle = articles.find((a) => a.uid === featuredArticle!.uid);
    }
  }

  // Articles récents (triés par date)
  const recentArticles = [...articles]
    .sort((a, b) => {
      const dateA = a.published_date ? new Date(a.published_date).getTime() : 0;
      const dateB = b.published_date ? new Date(b.published_date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  const showAuthor = homepage?.recent_articles?.show_author !== false;
  const showDate = homepage?.recent_articles?.show_date !== false;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Section Article mis en avant */}
      {featuredArticle && (
        <section className="mb-12">
          <FeaturedArticle
            article={featuredArticle}
            highlightText={homepage?.featured_article?.highlight_text}
            backgroundColor={homepage?.featured_article?.background_color}
          />
        </section>
      )}

      {/* Section Articles récents */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {homepage?.recent_articles?.section_title || "Articles récents"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <ArticleCard
              key={article.uid}
              article={article}
              showAuthor={showAuthor}
              showDate={showDate}
            />
          ))}
        </div>
        {articles.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors no-underline"
            >
              Voir tous les articles
            </Link>
          </div>
        )}
      </section>

      {/* Section Catégories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {homepage?.categories_section?.section_title || "Nos catégories"}
        </h2>
        <div className={`grid gap-6 ${
          homepage?.categories_section?.display_type === "Liste"
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {categories.map((category) => (
            <CategoryCard key={category.uid} category={category} />
          ))}
        </div>
        {homepage?.categories_section?.button_label && (
          <div className="text-center mt-8">
            <Link
              href="/categories"
              className="inline-block border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors no-underline"
            >
              {homepage.categories_section.button_label}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
