import Link from "next/link";
import Image from "next/image";
import { Footer as FooterType } from "@/lib/types";

interface FooterProps {
  footer: FooterType | undefined;
}

export default function Footer({ footer }: FooterProps) {
  if (!footer) return null;

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Description du site */}
          <div>
            <h3 className="text-lg font-bold mb-3">À propos</h3>
            {footer.description && (
              <p className="text-gray-400 text-sm leading-relaxed">
                {footer.description}
              </p>
            )}
          </div>

          {/* Liens catégories */}
          <div>
            <h3 className="text-lg font-bold mb-3">Catégories</h3>
            <ul className="space-y-2">
              {footer.categories_link?.map((cat) => (
                <li key={cat.uid}>
                  <Link
                    href={`/categories${cat.url}`}
                    className="text-gray-400 hover:text-white no-underline text-sm transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-lg font-bold mb-3">Suivez-nous</h3>
            <div className="flex gap-4">
              {footer.social_links && (
                <a
                  href={footer.social_links.url.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {footer.social_links.icon ? (
                    <Image
                      src={footer.social_links.icon.url}
                      alt={footer.social_links.url.title || "Social"}
                      width={24}
                      height={24}
                      className="invert"
                    />
                  ) : (
                    <span className="text-sm">🔗</span>
                  )}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} {footer.title}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
