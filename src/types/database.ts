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
    collection_id: string | null;
    slug: string;
    title: string;
    title_es: string | null;
    author: string | null;
    price: number | null;
    description: string | null;
    description_es: string | null;
    cover_image_url: string | null;
    spine_text: string | null;
    spine_color: string;
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
    is_active: boolean;
    created_at: string;
}

export type HeroSlideInsert = Omit<HeroSlide, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type HeroSlideUpdate = Partial<HeroSlideInsert>;

// ============================================
// Collection Resources
// ============================================
export interface CollectionResource {
    id: string;
    collection_id: string;
    name: string;
    name_es: string | null;
    type: 'journal' | 'bookmark' | 'poster' | 'other';
    description: string | null;
    description_es: string | null;
    image_url: string | null;
    display_order: number;
    created_at: string;
}

export type CollectionResourceInsert = Omit<CollectionResource, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type CollectionResourceUpdate = Partial<CollectionResourceInsert>;

// ============================================
// Collection Merch
// ============================================
export interface CollectionMerch {
    id: string;
    collection_id: string;
    name: string;
    name_es: string | null;
    price: number | null;
    image_url: string | null;
    purchase_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export type CollectionMerchInsert = Omit<CollectionMerch, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type CollectionMerchUpdate = Partial<CollectionMerchInsert>;

// ============================================
// Collection Images (preview thumbnails)
// ============================================
export interface CollectionImage {
    id: string;
    collection_id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
    created_at: string;
}

export type CollectionImageInsert = Omit<CollectionImage, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type CollectionImageUpdate = Partial<CollectionImageInsert>;

// ============================================
// Extended types with relations (for queries with joins)
// ============================================
export interface CollectionWithRelations extends Collection {
    books?: Book[];
    collection_resources?: CollectionResource[];
    collection_merch?: CollectionMerch[];
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
            collection_resources: {
                Row: CollectionResource;
                Insert: CollectionResourceInsert;
                Update: CollectionResourceUpdate;
            };
            collection_merch: {
                Row: CollectionMerch;
                Insert: CollectionMerchInsert;
                Update: CollectionMerchUpdate;
            };
            collection_images: {
                Row: CollectionImage;
                Insert: CollectionImageInsert;
                Update: CollectionImageUpdate;
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
