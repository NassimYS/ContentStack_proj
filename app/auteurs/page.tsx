import { getAuthors } from "@/lib/contentstack";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auteurs - Mon Blog",
  description: "Découvrez nos auteurs",
};

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nos auteurs</h1>

      {authors.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Aucun auteur pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => {
            const slug = author.url?.startsWith("/") ? author.url.slice(1) : author.url;
            return (
              <Link
                key={author.uid}
                href={`/auteurs/${slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow no-underline group"
              >
                <div className="flex flex-col items-center p-6">
                  {author.photo && (
                    <Image
                      src={author.photo.url}
                      alt={author.title}
                      width={120}
                      height={120}
                      className="rounded-full object-cover w-28 h-28 mb-4"
                    />
                  )}
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {author.title}
                  </h2>
                  {author.bio && (
                    <p className="text-gray-600 text-sm mt-2 text-center line-clamp-2">
                      {author.bio}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
