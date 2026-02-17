import BookHero from '@/components/Book/BookHero';
import BookStats from '@/components/Book/BookStats';
import BookAbout from '@/components/Book/BookAbout';
import BookReviews from '@/components/Book/BookReviews';
import BookAuthor from '@/components/Book/BookAuthor';
import RelatedBooks from '@/components/Book/RelatedBooks';
import styles from './page.module.css';

export default function BookPage({ params }: { params: { slug: string } }) {
    return (
        <main className={styles.main}>
            <BookHero />
            <BookStats />
            <BookAbout />

            {/* Author and Reviews Section */}
            <section className={styles.authorReviewsSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.authorCol}>
                            <BookAuthor />
                        </div>
                        <div className={styles.reviewsCol}>
                            <BookReviews />
                        </div>
                    </div>
                </div>
            </section>

            <RelatedBooks />
        </main>
    );
}
