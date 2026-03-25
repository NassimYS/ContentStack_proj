import { getAuthorByUrl, getAuthors, getArticles } from "@/lib/contentstack";
import ArticleCard from "@/components/ArticleCard";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorByUrl(`/${slug}`);

  if (!author) return { title: "Auteur introuvable" };

  return {
    title: `${author.title} - Mon Blog`,
    description: author.bio || `Articles de ${author.title}`,
  };
}

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({
    slug: author.url?.startsWith("/") ? author.url.slice(1) : author.url,
  }));
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorByUrl(`/${slug}`);

  if (!author) {
    notFound();
  }

  // Récupérer les articles de cet auteur
  const allArticles = await getArticles();
  const authorArticles = allArticles.filter((article) =>
    article.author?.some((a) => a.uid === author.uid)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        href="/auteurs"
        className="text-blue-600 hover:text-blue-800 text-sm font-medium no-underline mb-6 inline-block"
      >
        ← Tous les auteurs
      </Link>

      {/* Profil de l'auteur */}
      <header className="bg-white rounded-xl shadow-md p-8 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {author.photo && (
            <Image
              src={author.photo.url}
              alt={author.title}
              width={160}
              height={160}
              className="rounded-full object-cover w-40 h-40"
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.title}</h1>
            {author.bio && (
              <p className="text-gray-600 text-lg mb-4">{author.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {author.contact?.email && (
                <a
                  href={`mailto:${author.contact.email}`}
                  className="inline-flex items-center gap-2 text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors no-underline"
                >
                  ✉️ {author.contact.email}
                </a>
              )}
              {author.contact?.linkedin && (
                <a
                  href={author.contact.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors no-underline"
                >
                  🔗 LinkedIn
                </a>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {authorArticles.length} article{authorArticles.length !== 1 ? "s" : ""} publié{authorArticles.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      {/* Articles de l'auteur */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Articles de {author.title}
        </h2>
        {authorArticles.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            Aucun article publié pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorArticles.map((article) => (
              <ArticleCard key={article.uid} article={article} showAuthor={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
