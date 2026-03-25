import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";
import { Page, Article, Category, Author, Header, Footer, Homepage } from "./types";
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

export const isPreview = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true";

const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as string);
const endpoints = getContentstackEndpoints(region, true);

export const stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
  region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,
  live_preview: {
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
  }
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false,
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints && endpoints.application
    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"]
    },
  });
}

// ─── Page (legacy) ───
export async function getPage(url: string) {
  const result = await stack
    .contentType("page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0];
    if (isPreview) {
      contentstack.Utils.addEditableTags(entry, 'page', true);
    }
    return entry;
  }
}

// ─── Header ───
export async function getHeader(): Promise<Header | undefined> {
  const result = await stack
    .contentType("header")
    .entry()
    .query()
    .find<Header>();

  if (result.entries && result.entries.length > 0) {
    return result.entries[0];
  }
}

// ─── Footer ───
export async function getFooter(): Promise<Footer | undefined> {
  const result = await stack
    .contentType("footer")
    .entry()
    .includeReference(["categories_link"])
    .query()
    .find<Footer>();

  if (result.entries && result.entries.length > 0) {
    return result.entries[0];
  }
}

// ─── Homepage ───
export async function getHomepage(): Promise<Homepage | undefined> {
  const result = await stack
    .contentType("home_paeg")
    .entry()
    .includeReference(["featured_article.article"])
    .query()
    .find<Homepage>();

  if (result.entries && result.entries.length > 0) {
    return result.entries[0];
  }
}

// ─── Articles ───
export async function getArticles(): Promise<Article[]> {
  const result = await stack
    .contentType("article")
    .entry()
    .includeReference(["author", "category"])
    .query()
    .find<Article>();

  return result.entries || [];
}

export async function getArticleByUrl(url: string): Promise<Article | undefined> {
  const result = await stack
    .contentType("article")
    .entry()
    .includeReference(["author", "category"])
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Article>();

  if (result.entries && result.entries.length > 0) {
    return result.entries[0];
  }
}

export async function getArticlesByCategory(categoryUid: string): Promise<Article[]> {
  const result = await stack
    .contentType("article")
    .entry()
    .includeReference(["author", "category"])
    .query()
    .find<Article>();

  if (!result.entries) return [];

  return result.entries.filter((article) => {
    if (!article.category) return false;
    return article.category.some((cat) => cat.uid === categoryUid);
  });
}

// ─── Categories ───
export async function getCategories(): Promise<Category[]> {
  const result = await stack
    .contentType("category")
    .entry()
    .query()
    .find<Category>();

  return result.entries || [];
}

export async function getCategoryByUrl(url: string): Promise<Category | undefined> {
  const result = await stack
    .contentType("category")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Category>();

  if (result.entries && result.entries.length > 0) {
    return result.entries[0];
  }
}

// ─── Authors ───
export async function getAuthors(): Promise<Author[]> {
  const result = await stack
    .contentType("author")
    .entry()
    .query()
    .find<Author>();

  return result.entries || [];
}

export async function getAuthorByUrl(url: string): Promise<Author | undefined> {
  const result = await stack
    .contentType("author")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Author>();

  if (result.entries && result.entries.length > 0) {
    return result.entries[0];
  }
}