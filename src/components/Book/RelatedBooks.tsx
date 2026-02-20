import Link from 'next/link';
import styles from './RelatedBooks.module.css';
import type { CollectionItem } from '@/types/database';

interface RelatedBooksProps {
    collectionItems: CollectionItem[];
    collectionTitle?: string;
}

const RelatedBooks = ({ collectionItems, collectionTitle }: RelatedBooksProps) => {
    if (collectionItems.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.heading}>More From This Collection</h2>
                    <Link href="/collections" className={styles.viewAllLink}>
                        {collectionTitle ? `View ${collectionTitle}` : 'View Full Series'}
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {collectionItems.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.bookThumb}>
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className={styles.thumbImage}
                                    />
                                ) : (
                                    <div className={styles.bookIcon}>
                                        <span className="material-symbols-outlined">
                                            {item.type === 'book' ? 'book_2' : item.type === 'merch' ? 'shopping_bag' : 'inventory_2'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h3 className={styles.bookTitle}>{item.name}</h3>
                            {item.price != null && (
                                <p className={styles.releaseDate}>${item.price.toFixed(2)}</p>
                            )}
                            {item.purchase_url && (
                                <a href={item.purchase_url} target="_blank" rel="noopener noreferrer" className={styles.viewAllLink}>
                                    View →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedBooks;
