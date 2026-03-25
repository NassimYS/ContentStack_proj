export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  description?: string;
  dimension?: {
    height: number;
    width: number;
  };
  publish_details: PublishDetails;
}

export interface Link {
  title: string;
  href: string;
}

export interface SystemFields {
  uid?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  _content_type_uid?: string;
  tags?: string[];
  ACL?: any[];
  _version?: number;
  _in_progress?: boolean;
  locale?: string;
  publish_details?: PublishDetails;
  title?: string;
}

// ─── Category ───
export interface Category extends SystemFields {
  uid: string;
  title: string;
  url: string;
  description?: string;
  image?: File | null;
}

// ─── Author ───
export interface AuthorContact {
  email?: string;
  linkedin?: Link;
}

export interface Author extends SystemFields {
  uid: string;
  title: string;
  url: string;
  bio?: string;
  photo?: File | null;
  display_mode?: string;
  contact?: AuthorContact;
}

// ─── Article ───
export interface ArticleSEO {
  meta_title?: string;
  meta_description?: string;
}

export interface Article extends SystemFields {
  uid: string;
  title: string;
  url: string;
  summary?: string;
  content?: string;
  image?: File | null;
  author?: Author[];
  category?: Category[];
  published_date?: string;
  reading_time?: number;
  seo?: ArticleSEO;
}

// ─── Header ───
export interface NavigationItem {
  title: string;
  url: Link;
  _metadata?: { uid: string };
}

export interface Header extends SystemFields {
  uid: string;
  title: string;
  logo?: File | null;
  navigation?: NavigationItem[];
}

// ─── Footer ───
export interface SocialLink {
  icon?: File | null;
  url: Link;
}

export interface Footer extends SystemFields {
  uid: string;
  title: string;
  description?: string;
  categories_link?: Category[];
  social_links?: SocialLink;
}

// ─── Homepage ───
export interface FeaturedArticleSection {
  article?: Article[];
  highlight_text?: string;
  background_color?: string;
}

export interface RecentArticlesSection {
  section_title?: string;
  category_filter?: Category[];
  show_author?: boolean;
  show_date?: boolean;
}

export interface CategoriesSection {
  section_title?: string;
  display_type?: string;
  button_label?: string;
}

export interface Homepage extends SystemFields {
  uid: string;
  title: string;
  featured_article?: FeaturedArticleSection;
  recent_articles?: RecentArticlesSection;
  categories_section?: CategoriesSection;
}

// ─── Legacy Page type (kept for compatibility) ───
export interface CSLPAttribute {
  "data-cslp"?: string;
  "data-cslp-parent-field"?: string;
}
export type CSLPFieldMapping = CSLPAttribute;

export interface Block {
  _version?: number;
  title?: string;
  copy?: string;
  image?: File | null;
  layout?: ("image_left" | "image_right") | null;
  _metadata?: { uid: string };
}

export interface Blocks extends SystemFields {
  block: Block;
}

export interface Page extends SystemFields {
  uid: string;
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  rich_text?: string;
  blocks?: Blocks[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    rich_text?: CSLPFieldMapping;
    blocks?: CSLPFieldMapping;
    [key: string]: CSLPFieldMapping | undefined;
  };
}
