'use client';

import Link from 'next/link';
import styles from './CollectionHero.module.css';

interface CollectionHeroProps {
    collection: {
        id: string;
        title: string;
        title_es: string | null;
        description: string | null;
        description_es: string | null;
        theme_color: string;
        display_order: number;
        price: number | null;
        original_price: number | null;
        sale_price: number | null;
        is_on_sale: boolean;
        primary_btn_text: string;
        primary_btn_text_es: string | null;
        primary_btn_link: string | null;
        secondary_btn_text: string | null;
        secondary_btn_text_es: string | null;
        secondary_btn_link: string | null;
        books: Array<{
            id: string;
            title: string;
            title_es: string | null;
            cover_image_url: string | null;
        }>;
        collection_items: Array<{
            id: string;
            image_url: string | null;
            grid_size: string;
            is_active: boolean;
            display_order: number;
        }>;
    };
    locale: string;
}

const CollectionHero = ({ collection, locale }: CollectionHeroProps) => {
    const isEs = locale === 'es';
    const title = (isEs && collection.title_es) || collection.title;
    const description = (isEs && collection.description_es) || collection.description;

    // Get hero image: book cover first, then featured item, then first item with an image
    const book = collection.books?.[0];
    const featuredItem = collection.collection_items
        ?.filter(i => i.is_active && i.image_url)
        .sort((a, b) => {
            if (a.grid_size === 'featured' && b.grid_size !== 'featured') return -1;
            if (b.grid_size === 'featured' && a.grid_size !== 'featured') return 1;
            return a.display_order - b.display_order;
        })[0];

    const heroImageUrl = book?.cover_image_url || featuredItem?.image_url;

    // Pricing
    const displayPrice = collection.is_on_sale && collection.sale_price
        ? collection.sale_price
        : collection.price;

    // Button text
    const primaryText = (isEs && collection.primary_btn_text_es) || collection.primary_btn_text || 'Order Now';
    const secondaryText = (isEs && collection.secondary_btn_text_es) || collection.secondary_btn_text;

    return (
        <section
            className={styles.section}
            style={{ '--hero-tint': collection.theme_color } as React.CSSProperties}
        >
            <div className={styles.container}>
                {/* Breadcrumbs */}
                <div className={styles.breadcrumbs}>
                    <Link href={`/${locale}`} className={styles.crumbLink}>
                        {isEs ? 'Inicio' : 'Home'}
                    </Link>
                    <span className={styles.crumbSep}>/</span>
                    <Link href={`/${locale}#collection`} className={styles.crumbLink}>
                        {isEs ? 'Colecciones' : 'Collections'}
                    </Link>
                    <span className={styles.crumbSep}>/</span>
                    <span className={styles.crumbActive}>{title}</span>
                </div>

                <div className={styles.separator} />

                <div className={styles.grid}>
                    {/* Left: Hero Image */}
                    <div className={styles.imageColumn}>
                        {heroImageUrl ? (
                            <div className={styles.imageWrapper}>
                                <img
                                    src={heroImageUrl}
                                    alt={title}
                                    className={styles.heroImage}
                                />
                                <div className={styles.imageGlow} />
                            </div>
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <span>No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className={styles.textColumn}>
                        <span className={styles.collectionLabel}>
                            {isEs ? 'Colección' : 'Collection'} {String(collection.display_order + 1).padStart(2, '0')}
                        </span>

                        <h1 className={styles.title}>{title}</h1>

                        {description && (
                            <p className={styles.description}>{description}</p>
                        )}

                        {/* Pricing */}
                        {displayPrice != null && displayPrice > 0 && (
                            <div className={styles.priceRow}>
                                {collection.is_on_sale && collection.original_price ? (
                                    <>
                                        <span className={styles.originalPrice}>
                                            ${collection.original_price.toFixed(2)}
                                        </span>
                                        <span className={styles.salePrice}>
                                            ${displayPrice.toFixed(2)}
                                        </span>
                                        <span className={styles.saleBadge}>SALE</span>
                                    </>
                                ) : (
                                    <span className={styles.price}>
                                        ${displayPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className={styles.actions}>
                            {collection.primary_btn_link ? (
                                <Link href={collection.primary_btn_link} className={styles.primaryBtn}>
                                    {primaryText}
                                </Link>
                            ) : (
                                <button className={styles.primaryBtn}>{primaryText}</button>
                            )}

                            {secondaryText && (
                                collection.secondary_btn_link ? (
                                    <Link href={collection.secondary_btn_link} className={styles.secondaryBtn}>
                                        {secondaryText}
                                    </Link>
                                ) : (
                                    <button className={styles.secondaryBtn}>{secondaryText}</button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionHero;
