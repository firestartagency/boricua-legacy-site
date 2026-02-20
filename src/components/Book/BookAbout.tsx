import styles from './BookAbout.module.css';

interface BookAboutProps {
    aboutText?: string | null;
    bookTitle?: string;
}

const BookAbout = ({ aboutText, bookTitle }: BookAboutProps) => {
    if (!aboutText) return null;

    // Split text into paragraphs on double newlines
    const paragraphs = aboutText.split(/\n\n+/).filter(p => p.trim());

    return (
        <section className={styles.section}>
            <div className={styles.texture}></div>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left: About Text */}
                    <div className={styles.textColumn}>
                        <h2 className={styles.heading}>About This Book</h2>
                        <div className={styles.prose}>
                            {paragraphs.map((paragraph, i) => (
                                <p key={i}>
                                    {i === 0 && bookTitle ? (
                                        <>
                                            <span className={styles.highlight}>{bookTitle}</span>{' '}
                                            {paragraph.replace(new RegExp(`^${bookTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '')}
                                        </>
                                    ) : (
                                        paragraph
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Right: Look Inside Preview */}
                    <div className={styles.previewColumn}>
                        <div className={styles.previewHeader}>
                            <h3 className={styles.previewTitle}>Look Inside</h3>
                            <span className={styles.pageCount}>01 / 06</span>
                        </div>

                        <div className={styles.previewCard}>
                            <div className={styles.cardHeaderGold}></div>
                            <div className={styles.cardHeaderGray}></div>
                            <div className={styles.previewImageWrapper}>
                                <div className={styles.previewImage}></div>
                                <div className={styles.overlay}>
                                    <div className={styles.zoomBtn}>
                                        <span className="material-symbols-outlined">zoom_in</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.previewActions}>
                            <button className={styles.chapterBtn}>
                                Get the First Chapter Free
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookAbout;
