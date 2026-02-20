import styles from './BookStats.module.css';
import type { BookEdition } from '@/types/database';

interface BookStatsProps {
    pageCount?: number | null;
    publicationDate?: string | null;
    language?: string | null;
    audience?: string | null;
    editions: BookEdition[];
    selectedEditionId?: string | null;
}

const BookStats = ({ pageCount, publicationDate, language, audience, editions, selectedEditionId }: BookStatsProps) => {
    // Find ISBN for the selected edition, or fall back to first edition with an ISBN
    const selectedEdition = editions.find(e => e.id === selectedEditionId);
    const isbn = selectedEdition?.isbn
        || editions.find(e => e.isbn)?.isbn
        || '—';

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Pages</span>
                        <span className={styles.value}>{pageCount || '—'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Publication</span>
                        <span className={styles.value}>{publicationDate || '—'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Language</span>
                        <span className={styles.value}>{language || 'English'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.label}>ISBN</span>
                        <span className={styles.value}>{isbn}</span>
                    </div>
                    <div className={`${styles.statItem} ${styles.audienceItem}`}>
                        <span className={styles.label}>Audience</span>
                        <span className={styles.value}>{audience || '—'}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookStats;
