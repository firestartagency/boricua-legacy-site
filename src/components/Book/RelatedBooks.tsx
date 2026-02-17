import Link from 'next/link';
import styles from './RelatedBooks.module.css';

const RelatedBooks = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.heading}>More From This Collection</h2>
                    <Link href="/collection" className={styles.viewAllLink}>
                        View Full Series
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>

                <div className={styles.grid}>

                    {/* Item 1 */}
                    <div className={styles.card}>
                        <div className={styles.bookThumb}>
                            <div className={styles.cornerTag}></div>
                            <div className={styles.bookIcon}>
                                <span className="material-symbols-outlined">book_2</span>
                            </div>
                            <div className={styles.overlay}>
                                <span className={styles.volLabel}>VOL. II</span>
                            </div>
                        </div>
                        <h3 className={styles.bookTitle}>Voices of the Diaspora</h3>
                        <p className={styles.releaseDate}>Coming Spring 2025</p>
                    </div>

                    {/* Item 2 */}
                    <div className={styles.card}>
                        <div className={styles.bookThumb}>
                            <div className={styles.bookIcon}>
                                <span className="material-symbols-outlined">book_2</span>
                            </div>
                            <div className={styles.overlay}>
                                <span className={styles.volLabel}>VOL. III</span>
                            </div>
                        </div>
                        <h3 className={styles.bookTitle}>Legends of Borikén</h3>
                        <p className={styles.releaseDate}>Coming Fall 2025</p>
                    </div>

                    {/* Item 3 */}
                    <div className={styles.card}>
                        <div className={styles.bookThumb}>
                            <div className={styles.bookIcon}>
                                <span className="material-symbols-outlined">book_2</span>
                            </div>
                            <div className={styles.overlay}>
                                <span className={styles.volLabel}>VOL. IV</span>
                            </div>
                        </div>
                        <h3 className={styles.bookTitle}>Arts &amp; Resistance</h3>
                        <p className={styles.releaseDate}>Coming 2026</p>
                    </div>

                    {/* Item 4 (Sold Out) */}
                    <div className={styles.card}>
                        <div className={`${styles.bookThumb} ${styles.soldOutThumb}`}>
                            <div className={styles.soldOutBadge}>
                                Sold Out
                            </div>
                            <div className={styles.bookIcon}>
                                <span className="material-symbols-outlined">book_2</span>
                            </div>
                        </div>
                        <h3 className={`${styles.bookTitle} ${styles.textMuted}`}>The First Colony</h3>
                        <p className={`${styles.releaseDate} ${styles.textMuted}`}>Legacy Edition</p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default RelatedBooks;
