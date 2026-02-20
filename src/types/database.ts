/**
 * Database types for Supabase tables
 * These match the schema defined in the implementation plan
 */

// ============================================
// Collections
// ============================================
export interface Collection {
    id: string;
    title: string;
    title_es: string | null;
    description: string | null;
    description_es: string | null;
    theme_color: string;
    display_order: number;
    price: number | null;
    original_price: number | null;
    sale_price: number | null;
    is_on_sale: boolean;
    primary_btn_text: string;
    primary_btn_text_es: string | null;
    primary_btn_link: string | null;
    secondary_btn_text: string | null;
    secondary_btn_text_es: string | null;
    secondary_btn_link: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type CollectionInsert = Omit<Collection, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
};

export type CollectionUpdate = Partial<CollectionInsert>;

// ============================================
// Books
// ============================================
export interface Book {
    id: string;
    slug: string;
    title: string;
    title_es: string | null;
    author: string | null;
    description: string | null;
    description_es: string | null;
    cover_image_url: string | null;
    page_count: number | null;
    publication_date: string | null;
    language: string | null;
    audience: string | null;
    about_text: string | null;
    author_title: string | null;
    author_bio: string | null;
    author_quote: string | null;
    author_image_url: string | null;
    author_signature_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type BookInsert = Omit<Book, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
};

export type BookUpdate = Partial<BookInsert>;

// ============================================
// Book Images (gallery)
// ============================================
export interface BookImage {
    id: string;
    book_id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
    is_cover: boolean;
    created_at: string;
}

// ============================================
// Book Excerpts (uploaded excerpt pages)
// ============================================
export interface BookExcerpt {
    id: string;
    book_id: string;
    file_url: string;
    file_name: string | null;
    label: string;
    display_order: number;
    created_at: string;
}

// ============================================
// Book Editions (format/pricing)
// ============================================
export interface BookEdition {
    id: string;
    book_id: string;
    format_name: string;
    price: number;
    purchase_link: string | null;
    isbn: string | null;
    is_featured: boolean;
    display_order: number;
    created_at: string;
}

// ============================================
// Hero Slides
// ============================================
export interface HeroSlide {
    id: string;
    book_id: string | null;
    headline_1: string | null;
    headline_1_es: string | null;
    headline_2: string | null;
    headline_2_es: string | null;
    headline_3: string | null;
    headline_3_es: string | null;
    subtext: string | null;
    subtext_es: string | null;
    button_primary_text: string;
    button_primary_text_es: string | null;
    button_primary_link: string | null;
    button_secondary_text: string | null;
    button_secondary_text_es: string | null;
    button_secondary_link: string | null;
    display_order: number;
    show_spine: boolean;
    is_active: boolean;
    created_at: string;
}

export type HeroSlideInsert = Omit<HeroSlide, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type HeroSlideUpdate = Partial<HeroSlideInsert>;

// ============================================
// Collection Items (unified: merch, resources, images)
// ============================================
export interface CollectionItem {
    id: string;
    collection_id: string;
    book_id: string | null;
    name: string;
    name_es: string | null;
    type: 'book' | 'merch' | 'resource' | 'digital' | 'other';
    description: string | null;
    description_es: string | null;
    image_url: string | null;
    price: number | null;
    purchase_url: string | null;
    is_included: boolean;
    grid_size: 'featured' | 'standard' | 'hidden';
    display_order: number;
    is_active: boolean;
    created_at: string;
}

// ============================================
// Book Reviews
// ============================================
export interface BookReview {
    id: string;
    book_id: string;
    quote: string;
    source_name: string;
    display_order: number;
    created_at: string;
}

export type CollectionItemInsert = Omit<CollectionItem, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type CollectionItemUpdate = Partial<CollectionItemInsert>;

// ============================================
// Extended types with relations (for queries with joins)
// ============================================
export interface CollectionWithRelations extends Collection {
    books?: Book[];
    collection_items?: CollectionItem[];
}

export interface HeroSlideWithBook extends HeroSlide {
    books?: Book;
}

// ============================================
// Database interface (must be at end after all types are defined)
// ============================================
export interface Database {
    public: {
        Tables: {
            collections: {
                Row: Collection;
                Insert: CollectionInsert;
                Update: CollectionUpdate;
            };
            books: {
                Row: Book;
                Insert: BookInsert;
                Update: BookUpdate;
            };
            hero_slides: {
                Row: HeroSlide;
                Insert: HeroSlideInsert;
                Update: HeroSlideUpdate;
            };
            collection_items: {
                Row: CollectionItem;
                Insert: CollectionItemInsert;
                Update: CollectionItemUpdate;
            };
            blog_posts: {
                Row: BlogPost;
                Insert: BlogPostInsert;
                Update: BlogPostUpdate;
            };
            press_mentions: {
                Row: PressMention;
                Insert: PressMentionInsert;
                Update: PressMentionUpdate;
            };
        };
    };
}

// ============================================
// Blog Posts
// ============================================
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    title_es: string | null;
    excerpt: string | null;
    excerpt_es: string | null;
    content: string | null;
    content_es: string | null;
    featured_image_url: string | null;
    author: string | null;
    category: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
};

export type BlogPostUpdate = Partial<BlogPostInsert>;

// ============================================
// Press Mentions
// ============================================
export interface PressMention {
    id: string;
    outlet_name: string;
    outlet_logo_url: string | null;
    headline: string;
    headline_es: string | null;
    quote: string | null;
    quote_es: string | null;
    article_url: string | null;
    published_date: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export type PressMentionInsert = Omit<PressMention, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type PressMentionUpdate = Partial<PressMentionInsert>;
