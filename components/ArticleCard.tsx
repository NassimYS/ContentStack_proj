import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  showAuthor?: boolean;
  showDate?: boolean;
}

export default function ArticleCard({ article, showAuthor = true, showDate = true }: ArticleCardProps) {
  const slug = article.url?.startsWith("/") ? article.url.slice(1) : article.url;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {article.image && (
        <Link href={`/blog/${slug}`}>
          <Image
            src={article.image.url}
            alt={article.title}
            width={400}
            height={225}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}

      <div className="p-5">
        {/* Catégorie */}
        {article.category && article.category.length > 0 && (
          <div className="flex gap-2 mb-2">
            {article.category.map((cat) => (
              <span
                key={cat.uid}
                className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Titre */}
        <Link href={`/blog/${slug}`} className="no-underline">
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
        </Link>

        {/* Résumé */}
        {article.summary && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {article.summary}
          </p>
        )}

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            {showAuthor && article.author && article.author.length > 0 && (
              <div className="flex items-center gap-2">
                {article.author[0].photo && (
                  <Image
                    src={article.author[0].photo.url}
                    alt={article.author[0].title}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{article.author[0].title}</span>
              </div>
            )}
            {showDate && article.published_date && (
              <time dateTime={article.published_date}>
                {new Date(article.published_date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            )}
          </div>
          {article.reading_time && (
            <span>{article.reading_time} min de lecture</span>
          )}
        </div>
      </div>
    </article>
  );
}
