import type { Metadata } from "next";
import "./globals.css";
import HeaderComponent from "@/components/Header";
import FooterComponent from "@/components/Footer";
import { getHeader, getFooter } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "Mon Blog",
  description: "Blog dédié au développement web",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [header, footer] = await Promise.all([getHeader(), getFooter()]);

  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <HeaderComponent header={header} />
        <main className="flex-1">{children}</main>
        <FooterComponent footer={footer} />
      </body>
    </html>
  );
}
