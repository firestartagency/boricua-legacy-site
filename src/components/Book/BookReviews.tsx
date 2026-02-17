import styles from './BookReviews.module.css';

const BookReviews = () => {
    return (
        <div className={styles.section}> {/* Not a section tag as it's part of the main grid usually, but we'll treat as component */}
            <h3 className={styles.label}>Critical Acclaim</h3>
            <div className={styles.grid}>

                {/* Review 1 */}
                <div className={styles.card}>
                    <div className={styles.quoteIcon}>
                        <span className="material-symbols-outlined">format_quote</span>
                    </div>
                    <p className={styles.quote}>
                        &quot;A masterpiece of cultural restoration. Every page sings with dignity.&quot;
                    </p>
                    <p className={styles.source}>— The Caribbean Review</p>
                </div>

                {/* Review 2 */}
                <div className={styles.card}>
                    <div className={styles.quoteIcon}>
                        <span className="material-symbols-outlined">format_quote</span>
                    </div>
                    <p className={styles.quote}>
                        &quot;Essential reading for anyone seeking to understand the true spirit of Borikén.&quot;
                    </p>
                    <p className={styles.source}>— Literary San Juan</p>
                </div>

                {/* Review 3 */}
                <div className={styles.card}>
                    <div className={styles.quoteIcon}>
                        <span className="material-symbols-outlined">format_quote</span>
                    </div>
                    <p className={styles.quote}>
                        &quot;Jiménez writes with the precision of a scholar and the heart of a poet.&quot;
                    </p>
                    <p className={styles.source}>— Diaspora Weekly</p>
                </div>

            </div>
        </div>
    );
};

export default BookReviews;
