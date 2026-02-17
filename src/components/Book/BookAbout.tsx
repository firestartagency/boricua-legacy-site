import styles from './BookAbout.module.css';

const BookAbout = () => {
    return (
        <section className={styles.section}>
            <div className={styles.texture}></div>
            <div className={styles.container}>
                <div className={styles.grid}>

                    {/* Left: About Text */}
                    <div className={styles.textColumn}>
                        <h2 className={styles.heading}>About This Book</h2>
                        <div className={styles.prose}>
                            <p>
                                <span className={styles.highlight}>Boricua Legacy</span> isn&apos;t just a history book; it is an artifact of remembrance. Born from over two decades of research in archives from San Juan to Seville, this volume meticulously reconstructs the lives of women who were often relegated to footnotes.
                            </p>
                            <p>
                                From the Taíno cacicas who led early resistance against colonization to the 20th-century labor organizers who revolutionized the Caribbean workforce, these stories are told with narrative flair and historical rigor.
                            </p>
                            <p>
                                Designed as a heirloom object, the book features gold-foiled typography, premium linen binding, and original illustrations that serve as a mirror for our daughters and a map for our sons.
                            </p>
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
                                <div className={styles.previewImage}></div> {/* Placeholder bg */}
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
