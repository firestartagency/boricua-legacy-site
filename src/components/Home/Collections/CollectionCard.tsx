'use client';

import styles from './CollectionCard.module.css';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface CollectionItemType {
    id: string;
    name: string;
    name_es: string | null;
    type: string;
    description: string | null;
    description_es: string | null;
    image_url: string | null;
    price: number | null;
    purchase_url: string | null;
    is_included: boolean;
    grid_size: string;
    display_order: number;
    is_active: boolean;
}

interface CollectionCardProps {
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
        collection_items: CollectionItemType[];
    };
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
    const locale = useLocale();
    const isEs = locale === 'es';

    const title = (isEs && collection.title_es) || collection.title;
    const description = (isEs && collection.description_es) || collection.description;

    // Build grid items: book cover first, then active items with images that aren't hidden
    const gridItems: Array<{ id: string; name: string; imageUrl: string; type: string; isFeatured: boolean }> = [];

    // Add book cover as first featured item
    const book = collection.books?.[0];
    if (book?.cover_image_url) {
        gridItems.push({
            id: `book-${book.id}`,
            name: (isEs && book.title_es) || book.title,
            imageUrl: book.cover_image_url,
            type: 'book',
            isFeatured: true,
        });
    }

    // Add collection items (active, with images, not hidden)
    const activeItems = (collection.collection_items || [])
        .filter(item => item.is_active && item.image_url && item.grid_size !== 'hidden')
        .sort((a, b) => a.display_order - b.display_order);

    activeItems.forEach(item => {
        gridItems.push({
            id: item.id,
            name: (isEs && item.name_es) || item.name,
            imageUrl: item.image_url!,
            type: item.type,
            isFeatured: item.grid_size === 'featured',
        });
    });

    // Determine grid class based on visible item count
    const visibleCount = gridItems.length;
    const extraCount = visibleCount > 4 ? visibleCount - 4 : 0;
    const displayItems = gridItems.slice(0, 4);

    const getGridClass = () => {
        if (visibleCount <= 0) return '';
        if (visibleCount === 1) return styles.gridCount1;
        if (visibleCount === 2) return styles.gridCount2;
        if (visibleCount === 3) return styles.gridCount3;
        return styles.gridCount4;
    };

    // Build included items list
    const includedItems = (collection.collection_items || [])
        .filter(item => item.is_included && item.is_active)
        .sort((a, b) => a.display_order - b.display_order);

    // Pricing
    const displayPrice = collection.is_on_sale && collection.sale_price
        ? collection.sale_price
        : collection.price;

    // Button text (localized)
    const primaryText = (isEs && collection.primary_btn_text_es) || collection.primary_btn_text || 'View Collection';
    const secondaryText = (isEs && collection.secondary_btn_text_es) || collection.secondary_btn_text;

    return (
        <article className={styles.card} style={{ '--theme-color-bg': collection.theme_color + '20' } as React.CSSProperties}>
            {/* Visual Side */}
            <div className={styles.visualSide}>
                {visibleCount > 0 ? (
                    <div className={`${styles.gridContainer} ${getGridClass()}`}>
                        {displayItems.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`${styles.gridItem} ${item.isFeatured ? styles.itemFeatured : ''}`}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className={styles.gridImage}
                                    loading="lazy"
                                />
                                <span className={styles.gridLabel}>{item.name}</span>
                                {/* "+N more" overlay on last item */}
                                {idx === displayItems.length - 1 && extraCount > 0 && (
                                    <div className={styles.moreOverlay}>
                                        +{extraCount} more
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyGrid}>
                        <span>No images yet</span>
                    </div>
                )}
            </div>

            {/* Info Side */}
            <div className={styles.infoSide}>
                <span className={styles.collectionLabel}>
                    Collection {String(collection.display_order + 1).padStart(2, '0')}
                </span>

                <h3 className={styles.title}>{title}</h3>

                {description && (
                    <p className={styles.description}>{description}</p>
                )}

                {/* Compact Pricing */}
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

                {/* Included items */}
                {includedItems.length > 0 && (
                    <div className={styles.includesList}>
                        <span className={styles.includesHeader}>What&apos;s Included:</span>
                        <div className={styles.includesGrid}>
                            {includedItems.map(item => {
                                const itemName = (isEs && item.name_es) || item.name;
                                return (
                                    <div key={item.id} className={styles.includeItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span>{itemName}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className={styles.buttonGroup}>
                    <Link
                        href={collection.primary_btn_link || `/${locale}/collections/${collection.id}`}
                        className={styles.ctaButton}
                    >
                        {primaryText}
                    </Link>

                    {secondaryText && (
                        collection.secondary_btn_link ? (
                            <Link href={collection.secondary_btn_link} className={styles.secondaryButton}>
                                {secondaryText}
                            </Link>
                        ) : (
                            <button className={styles.secondaryButton}>{secondaryText}</button>
                        )
                    )}
                </div>
            </div>
        </article>
    );
};

export default CollectionCard;
