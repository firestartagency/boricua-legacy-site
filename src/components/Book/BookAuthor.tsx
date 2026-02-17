import styles from './BookAuthor.module.css';

const BookAuthor = () => {
    return (
        <div className={styles.card}>
            <div className={styles.borderTL}></div>
            <div className={styles.borderTR}></div>
            <div className={styles.borderBL}></div>
            <div className={styles.borderBR}></div>

            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    {/* Placeholder for author image */}
                    <div className={styles.authorImage}></div>
                </div>

                <h4 className={styles.name}>Jacqueline Jiménez</h4>
                <p className={styles.role}>Author &amp; Historian</p>
                <p className={styles.quote}>
                    &quot;History is not what happened. It is what we choose to remember.&quot;
                </p>
                <p className={styles.signature}>Jacqueline</p>
            </div>
        </div>
    );
};

export default BookAuthor;
