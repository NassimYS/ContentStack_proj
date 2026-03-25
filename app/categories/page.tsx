import { getCategories } from "@/lib/contentstack";
import CategoryCard from "@/components/CategoryCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catégories - Mon Blog",
  description: "Parcourez nos catégories d'articles",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nos catégories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Aucune catégorie pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.uid} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
