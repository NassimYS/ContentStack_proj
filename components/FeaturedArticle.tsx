import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/types";

interface FeaturedArticleProps {
  article: Article | undefined;
  highlightText?: string;
  backgroundColor?: string;
}

export default function FeaturedArticle({
  article,
  highlightText,
  backgroundColor = "#F3F4F6",
}: FeaturedArticleProps) {
  if (!article) return null;

  const slug = article.url?.startsWith("/") ? article.url.slice(1) : article.url;

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {article.image && (
          <div className="relative h-64 md:h-96">
            <Image
              src={article.image.url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8 flex flex-col justify-center">
          {highlightText && (
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
              {highlightText}
            </span>
          )}

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h2>

          {article.summary && (
            <p className="text-gray-600 mb-6 leading-relaxed">
              {article.summary}
            </p>
          )}

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            {article.author && article.author.length > 0 && (
              <div className="flex items-center gap-2">
                {article.author[0].photo && (
                  <Image
                    src={article.author[0].photo.url}
                    alt={article.author[0].title}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span>{article.author[0].title}</span>
              </div>
            )}
            {article.reading_time && (
              <span>· {article.reading_time} min de lecture</span>
            )}
          </div>

          <Link
            href={`/blog/${slug}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors no-underline w-fit"
          >
            Lire l&apos;article
          </Link>
        </div>
      </div>
    </section>
  );
}
