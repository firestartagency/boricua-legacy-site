import styles from './BookAuthor.module.css';

interface BookAuthorProps {
    name?: string | null;
    title?: string | null;
    quote?: string | null;
    imageUrl?: string | null;
    signatureUrl?: string | null;
}

const BookAuthor = ({ name, title, quote, imageUrl, signatureUrl }: BookAuthorProps) => {
    if (!name) return null;

    return (
        <div className={styles.card}>
            <div className={styles.borderTL}></div>
            <div className={styles.borderTR}></div>
            <div className={styles.borderBL}></div>
            <div className={styles.borderBR}></div>

            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className={styles.authorImage} />
                    ) : (
                        <div className={styles.authorImage}></div>
                    )}
                </div>

                <h4 className={styles.name}>{name}</h4>
                {title && <p className={styles.role}>{title}</p>}
                {quote && (
                    <p className={styles.quote}>
                        &quot;{quote}&quot;
                    </p>
                )}
                {signatureUrl ? (
                    <img src={signatureUrl} alt={`${name}'s signature`} className={styles.signatureImage} />
                ) : (
                    name && <p className={styles.signature}>{name.split(' ')[0]}</p>
                )}
            </div>
        </div>
    );
};

export default BookAuthor;
