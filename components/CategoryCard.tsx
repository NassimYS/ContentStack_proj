import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const slug = category.url?.startsWith("/") ? category.url.slice(1) : category.url;

  return (
    <Link
      href={`/categories/${slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow no-underline"
    >
      {category.image && (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={category.image.url}
            alt={category.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {category.title}
        </h3>
        {category.description && (
          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
        )}
      </div>
    </Link>
  );
}
