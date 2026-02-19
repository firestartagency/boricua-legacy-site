'use client';

import Link from 'next/link';
import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Book, BookImage, BookEdition, BookExcerpt } from '@/types/database';
import styles from './BookHero.module.css';

const ExcerptViewer = lazy(() => import('./ExcerptViewer'));

interface BookHeroProps {
    slug: string;
}

const BookHero = ({ slug }: BookHeroProps) => {
    const supabase = createClientComponentClient();
    const searchParams = useSearchParams();
    const [book, setBook] = useState<Book | null>(null);
    const [images, setImages] = useState<BookImage[]>([]);
    const [editions, setEditions] = useState<BookEdition[]>([]);
    const [excerpts, setExcerpts] = useState<BookExcerpt[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedEdition, setSelectedEdition] = useState(0);
    const [showExcerpt, setShowExcerpt] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBookData();
    }, [slug]);

    const fetchBookData = async () => {
        // Fetch book by slug
        const { data: bookData } = await supabase
            .from('books')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (!bookData) {
            setIsLoading(false);
            return;
        }

        const book = bookData as unknown as Book;
        setBook(book);

        // Fetch related data in parallel
        const [imagesRes, editionsRes, excerptsRes] = await Promise.all([
            supabase.from('book_images').select('*').eq('book_id', book.id).order('display_order'),
            supabase.from('book_editions').select('*').eq('book_id', book.id).order('display_order'),
            supabase.from('book_excerpts').select('*').eq('book_id', book.id).order('display_order')
        ]);

        setImages((imagesRes.data as unknown as BookImage[]) || []);
        setEditions((editionsRes.data as unknown as BookEdition[]) || []);
        const excerptData = (excerptsRes.data as unknown as BookExcerpt[]) || [];
        setExcerpts(excerptData);

        // Auto-open excerpt modal if ?excerpt=true in URL
        if (searchParams.get('excerpt') === 'true' && excerptData.length > 0) {
            setShowExcerpt(true);
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return <section className={styles.section}><div className={styles.loading}>Loading...</div></section>;
    }

    if (!book) {
        return <section className={styles.section}><div className={styles.loading}>Book not found</div></section>;
    }

    const coverImage = images.find(img => img.is_cover) || images[0];
    const currentImage = images[selectedImage] || coverImage;
    const currentEdition = editions[selectedEdition];

    return (
        <section className={styles.section}>
            {/* Breadcrumbs */}
            <div className={styles.breadcrumbsContainer}>
                <div className={styles.breadcrumbs}>
                    <Link href="/#collections" className={styles.crumbLink}>Books</Link>
                    <span className={styles.crumbSeparator}>/</span>
                    <span className={styles.crumbActive}>{book.title}</span>
                </div>
                <div className={styles.separator}></div>
            </div>

            <div className={styles.grid}>
                {/* Left Column: Book Cover */}
                <div className={styles.imageColumn}>
                    <div className={styles.bookWrapper}>
                        <div className={styles.book3dContainer}>
                            <div
                                className={styles.bookCover}
                                style={currentImage ? {
                                    backgroundImage: `url(${currentImage.image_url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                } : undefined}
                            >
                                <div className={styles.spine}></div>
                                <div className={styles.sheen}></div>
                                <div className={styles.shadow}></div>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className={styles.thumbnails}>
                        {images.map((img, idx) => (
                            <button
                                key={img.id}
                                title={img.alt_text || `View image ${idx + 1}`}
                                className={`${styles.thumb} ${selectedImage === idx ? styles.thumbActive : ''}`}
                                onClick={() => setSelectedImage(idx)}
                            >
                                <img
                                    src={img.image_url}
                                    alt={img.alt_text || `Image ${idx + 1}`}
                                    className={styles.thumbImg}
                                />
                            </button>
                        ))}
                        {excerpts.length > 0 && (
                            <button
                                className={styles.thumb}
                                title="Read Excerpt"
                                onClick={() => setShowExcerpt(true)}
                            >
                                <span className="material-symbols-outlined">menu_book</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className={styles.textColumn}>
                    <div className={styles.stockStatus}>
                        <span className={styles.stockDot}></span>
                        <span className={styles.stockText}>In Stock</span>
                    </div>

                    <h1 className={styles.title}>
                        {book.title}
                    </h1>

                    {book.author && (
                        <p className={styles.author}>By {book.author}</p>
                    )}

                    {book.description && (
                        <blockquote className={styles.pullQuote}>
                            {book.description}
                        </blockquote>
                    )}

                    {/* Format Selection */}
                    {editions.length > 0 && (
                        <div className={styles.formatSelection}>
                            {editions.map((ed, idx) => (
                                <label key={ed.id} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="format"
                                        checked={selectedEdition === idx}
                                        onChange={() => setSelectedEdition(idx)}
                                        className={styles.radioInput}
                                    />
                                    <div className={`${styles.formatCard} ${selectedEdition === idx ? styles.formatCardActive : ''}`}>
                                        <span className={styles.formatName}>{ed.format_name}</span>
                                        <span className={styles.formatPrice}>${Number(ed.price).toFixed(2)}</span>
                                    </div>
                                    {ed.is_featured && (
                                        <div className={styles.bestSellerBadge}>Featured</div>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.actions}>
                        {currentEdition?.purchase_link ? (
                            <a href={currentEdition.purchase_link} target="_blank" rel="noopener noreferrer" className={styles.buyBtn}>
                                Buy Now
                                <span className="material-symbols-outlined">shopping_bag</span>
                            </a>
                        ) : (
                            <button className={styles.buyBtn}>
                                Buy Now
                                <span className="material-symbols-outlined">shopping_bag</span>
                            </button>
                        )}
                        {excerpts.length > 0 ? (
                            <button className={styles.updateBtn} onClick={() => setShowExcerpt(true)}>
                                Read Excerpt
                            </button>
                        ) : (
                            <button className={styles.updateBtn}>
                                Get Updates
                            </button>
                        )}
                    </div>

                    <Link href="#" className={styles.bulkLink}>
                        Ordering for a school or library? Bulk Orders
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Excerpt Viewer */}
            {showExcerpt && excerpts.length > 0 && (
                <Suspense fallback={null}>
                    <ExcerptViewer
                        pdfUrl={excerpts[0].file_url}
                        bookTitle={book.title}
                        onClose={() => setShowExcerpt(false)}
                    />
                </Suspense>
            )}
        </section>
    );
};

export default BookHero;
