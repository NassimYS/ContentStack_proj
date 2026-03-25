import { getArticleByUrl, getArticles } from "@/lib/contentstack";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleByUrl(`/${slug}`);

  if (!article) return { title: "Article introuvable" };

  return {
    title: article.seo?.meta_title || article.title,
    description: article.seo?.meta_description || article.summary,
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.url?.startsWith("/") ? article.url.slice(1) : article.url,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleByUrl(`/${slug}`);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête */}
      <header className="mb-8">
        {article.category && article.category.length > 0 && (
          <div className="flex gap-2 mb-4">
            {article.category.map((cat) => {
              const catSlug = cat.url?.startsWith("/") ? cat.url.slice(1) : cat.url;
              return (
                <Link
                  key={cat.uid}
                  href={`/categories/${catSlug}`}
                  className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full no-underline hover:bg-blue-100 transition-colors"
                >
                  {cat.title}
                </Link>
              );
            })}
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

        {article.summary && (
          <p className="text-xl text-gray-600 mb-6">{article.summary}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
          {article.author && article.author.length > 0 && (
            <div className="flex items-center gap-3">
              {article.author[0].photo && (
                <Image
                  src={article.author[0].photo.url}
                  alt={article.author[0].title}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{article.author[0].title}</p>
                {article.author[0].bio && (
                  <p className="text-xs text-gray-500">{article.author[0].bio}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {article.published_date && (
              <time dateTime={article.published_date}>
                {new Date(article.published_date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            {article.reading_time && (
              <span>· {article.reading_time} min de lecture</span>
            )}
          </div>
        </div>
      </header>

      {/* Image principale */}
      {article.image && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <Image
            src={article.image.url}
            alt={article.title}
            width={896}
            height={504}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      {/* Contenu */}
      {article.content && (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(article.content),
          }}
        />
      )}

      {/* Navigation retour */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 font-medium no-underline"
        >
          ← Retour aux articles
        </Link>
      </div>
    </article>
  );
}
