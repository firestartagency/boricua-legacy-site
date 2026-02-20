import styles from './BookReviews.module.css';
import type { BookReview } from '@/types/database';

interface BookReviewsProps {
    reviews: BookReview[];
}

const BookReviews = ({ reviews }: BookReviewsProps) => {
    if (reviews.length === 0) return null;

    return (
        <div className={styles.section}>
            <h3 className={styles.label}>Critical Acclaim</h3>
            <div className={styles.grid}>
                {reviews.map((review) => (
                    <div key={review.id} className={styles.card}>
                        <div className={styles.quoteIcon}>
                            <span className="material-symbols-outlined">format_quote</span>
                        </div>
                        <p className={styles.quote}>
                            &quot;{review.quote}&quot;
                        </p>
                        <p className={styles.source}>— {review.source_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookReviews;
