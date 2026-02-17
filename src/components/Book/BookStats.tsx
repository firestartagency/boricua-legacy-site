import styles from './BookStats.module.css';

const BookStats = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>

                    <div className={styles.statItem}>
                        <span className={styles.label}>Pages</span>
                        <span className={styles.value}>342</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.label}>Publication</span>
                        <span className={styles.value}>Oct 2024</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.label}>Language</span>
                        <span className={styles.value}>English / Spanish</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.label}>ISBN</span>
                        <span className={styles.value}>978-1-5266</span>
                    </div>

                    <div className={`${styles.statItem} ${styles.audienceItem}`}>
                        <span className={styles.label}>Audience</span>
                        <span className={styles.value}>General / YA</span>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BookStats;
