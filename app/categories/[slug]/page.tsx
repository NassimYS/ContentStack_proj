import { getCategoryByUrl, getCategories, getArticlesByCategory } from "@/lib/contentstack";
import ArticleCard from "@/components/ArticleCard";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryByUrl(`/${slug}`);

  if (!category) return { title: "Catégorie introuvable" };

  return {
    title: `${category.title} - Mon Blog`,
    description: category.description || `Articles sur ${category.title}`,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.url?.startsWith("/") ? cat.url.slice(1) : cat.url,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryByUrl(`/${slug}`);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(category.uid);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* En-tête de la catégorie */}
      <header className="mb-8">
        <Link
          href="/categories"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium no-underline mb-4 inline-block"
        >
          ← Toutes les catégories
        </Link>

        <div className="flex items-center gap-6">
          {category.image && (
            <Image
              src={category.image.url}
              alt={category.title}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.title}</h1>
            {category.description && (
              <p className="text-gray-600 mt-1">{category.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      {/* Articles de la catégorie */}
      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Aucun article dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.uid} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
