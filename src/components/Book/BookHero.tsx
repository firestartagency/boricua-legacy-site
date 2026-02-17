import Link from 'next/link';
import styles from './BookHero.module.css';

const BookHero = () => {
    return (
        <section className={styles.section}>
            {/* Breadcrumbs */}
            <div className={styles.breadcrumbsContainer}>
                <div className={styles.breadcrumbs}>
                    <Link href="/books" className={styles.crumbLink}>Books</Link>
                    <span className={styles.crumbSeparator}>/</span>
                    <Link href="/collection" className={styles.crumbLink}>Collection</Link>
                    <span className={styles.crumbSeparator}>/</span>
                    <span className={styles.crumbActive}>Boricua Legacy</span>
                </div>
                <div className={styles.separator}></div>
            </div>

            <div className={styles.grid}>
                {/* Left Column: 3D Book Cover */}
                <div className={styles.imageColumn}>
                    <div className={styles.bookWrapper}>
                        <div className={styles.book3dContainer}>
                            <div className={styles.bookCover}>
                                <div className={styles.spine}></div>
                                <div className={styles.sheen}></div>
                                <div className={styles.shadow}></div>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className={styles.thumbnails}>
                        <button title="View Front Cover" className={`${styles.thumb} ${styles.thumbActive}`}>
                            <div className={styles.thumbImage}></div>
                        </button>
                        <button className={styles.thumb}>
                            <span className="material-symbols-outlined">menu_book</span>
                        </button>
                        <button className={styles.thumb}>
                            <span className="material-symbols-outlined">format_quote</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className={styles.textColumn}>
                    <div className={styles.stockStatus}>
                        <span className={styles.stockDot}></span>
                        <span className={styles.stockText}>In Stock</span>
                    </div>

                    <h1 className={styles.title}>
                        Boricua Legacy: <br />
                        <span className={styles.subtitle}>The Women Who Made History</span>
                    </h1>

                    <p className={styles.author}>By Jacqueline Jiménez</p>

                    <blockquote className={styles.pullQuote}>
                        &quot;A monumental tribute that reclaims the narrative, honoring the forgotten queens and warriors who forged a nation&apos;s soul.&quot;
                    </blockquote>

                    {/* Format Selection */}
                    <div className={styles.formatSelection}>
                        <label className={styles.radioLabel}>
                            <input type="radio" name="format" defaultChecked className={styles.radioInput} />
                            <div className={`${styles.formatCard} ${styles.formatCardActive}`}>
                                <span className={styles.formatName}>Hardcover</span>
                                <span className={styles.formatPrice}>$34.99</span>
                            </div>
                            <div className={styles.bestSellerBadge}>Best Seller</div>
                        </label>

                        <label className={styles.radioLabel}>
                            <input type="radio" name="format" className={styles.radioInput} />
                            <div className={styles.formatCard}>
                                <span className={styles.formatName}>eBook</span>
                                <span className={styles.formatPrice}>$14.99</span>
                            </div>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button className={styles.buyBtn}>
                            Buy Now
                            <span className="material-symbols-outlined">shopping_bag</span>
                        </button>
                        <button className={styles.updateBtn}>
                            Get Updates
                        </button>
                    </div>

                    <Link href="#" className={styles.bulkLink}>
                        Ordering for a school or library? Bulk Orders
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default BookHero;
