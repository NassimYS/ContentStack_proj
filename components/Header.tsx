import Link from "next/link";
import Image from "next/image";
import { Header as HeaderType } from "@/lib/types";

interface HeaderProps {
  header: HeaderType | undefined;
}

export default function Header({ header }: HeaderProps) {
  if (!header) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          {header.logo && (
            <Image
              src={header.logo.url}
              alt={header.title || "Logo"}
              width={40}
              height={40}
              className="rounded"
            />
          )}
          <span className="text-xl font-bold text-gray-900">
            {header.title}
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {header.navigation?.map((item, index) => (
            <Link
              key={index}
              href={item.url.href}
              className="text-gray-600 hover:text-blue-600 no-underline font-medium transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
