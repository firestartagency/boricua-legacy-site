'use client';

import BookHero from '@/components/Book/BookHero';
import BookStats from '@/components/Book/BookStats';
import BookAbout from '@/components/Book/BookAbout';
import BookReviews from '@/components/Book/BookReviews';
import BookAuthor from '@/components/Book/BookAuthor';
import RelatedBooks from '@/components/Book/RelatedBooks';
import styles from './page.module.css';
import { use, useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Book, BookEdition, BookReview, CollectionItem } from '@/types/database';

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const supabase = createClientComponentClient();

    const [book, setBook] = useState<Book | null>(null);
    const [editions, setEditions] = useState<BookEdition[]>([]);
    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
    const [collectionTitle, setCollectionTitle] = useState<string>('');
    const [selectedEditionId, setSelectedEditionId] = useState<string | null>(null);

    const fetchBookData = useCallback(async () => {
        // Fetch book by slug
        const { data: bookData } = await supabase
            .from('books')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (!bookData) return;
        const bookRecord = bookData as unknown as Book;
        setBook(bookRecord);

        // Fetch editions, reviews, and collection items in parallel
        const [editionsRes, reviewsRes, collItemsRes] = await Promise.all([
            supabase.from('book_editions').select('*').eq('book_id', bookRecord.id).order('display_order'),
            supabase.from('book_reviews').select('*').eq('book_id', bookRecord.id).order('display_order'),
            supabase.from('collection_items').select('*, collections(title)').eq('book_id', bookRecord.id).limit(1)
        ]);

        const editionData = (editionsRes.data as unknown as BookEdition[]) || [];
        setEditions(editionData);
        if (editionData.length > 0) {
            const featured = editionData.find(e => e.is_featured);
            setSelectedEditionId(featured?.id || editionData[0].id);
        }

        setReviews((reviewsRes.data as unknown as BookReview[]) || []);

        // If this book belongs to a collection, fetch all items in that collection
        const collItemData = collItemsRes.data as unknown as (CollectionItem & { collections?: { title: string } })[];
        if (collItemData && collItemData.length > 0) {
            const collectionId = collItemData[0].collection_id;
            setCollectionTitle(collItemData[0].collections?.title || '');

            // Fetch all items in the same collection (excluding current book)
            const { data: allItems } = await supabase
                .from('collection_items')
                .select('*')
                .eq('collection_id', collectionId)
                .neq('book_id', bookRecord.id)
                .eq('is_active', true)
                .order('display_order');

            setCollectionItems((allItems as unknown as CollectionItem[]) || []);
        }
    }, [slug, supabase]);

    useEffect(() => {
        fetchBookData();
    }, [fetchBookData]);

    return (
        <main className={styles.main}>
            <BookHero slug={slug} onEditionChange={setSelectedEditionId} />
            <BookStats
                pageCount={book?.page_count}
                publicationDate={book?.publication_date}
                language={book?.language}
                audience={book?.audience}
                editions={editions}
                selectedEditionId={selectedEditionId}
            />
            <BookAbout aboutText={book?.about_text} bookTitle={book?.title} />

            {/* Author and Reviews Section */}
            {(book?.author || reviews.length > 0) && (
                <section className={styles.authorReviewsSection}>
                    <div className={styles.container}>
                        <div className={styles.grid}>
                            <div className={styles.authorCol}>
                                <BookAuthor
                                    name={book?.author}
                                    title={book?.author_title}
                                    quote={book?.author_quote}
                                    imageUrl={book?.author_image_url}
                                    signatureUrl={book?.author_signature_url}
                                />
                            </div>
                            <div className={styles.reviewsCol}>
                                <BookReviews reviews={reviews} />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <RelatedBooks collectionItems={collectionItems} collectionTitle={collectionTitle} />
        </main>
    );
}
