'use client';

import styles from './CollectionCard.module.css';
import { useTranslations, useLocale } from 'next-intl';

interface CollectionWithRelations {
    id: string;
    title: string;
    title_es: string | null;
    description: string | null;
    description_es: string | null;
    theme_color: string;
    display_order: number;
    price: number | null;
    is_active: boolean;
    books: Array<{
        id: string;
        title: string;
        title_es: string | null;
        cover_image_url: string | null;
        price: number | null;
    }>;
    collection_resources: Array<{
        id: string;
        name: string;
        name_es: string | null;
        type: string;
        image_url: string | null;
    }>;
    collection_merch: Array<{
        id: string;
        name: string;
        name_es: string | null;
        price: number | null;
        image_url: string | null;
    }>;
    collection_images: Array<{
        id: string;
        image_url: string;
        alt_text: string | null;
        display_order: number;
    }>;
}

interface Props {
    collection: CollectionWithRelations;
}

const CollectionCard = ({ collection }: Props) => {
    const t = useTranslations('HomePage.collections');
    const locale = useLocale();
    const isSpanish = locale === 'es';

    // Safety check
    if (!collection) return null;

    // Get localized text
    const title = isSpanish && collection.title_es ? collection.title_es : collection.title;
    const description = isSpanish && collection.description_es ? collection.description_es : collection.description;

    // Get the first book for the collection
    const mainBook = collection.books?.[0];
    const bookTitle = mainBook ? (isSpanish && mainBook.title_es ? mainBook.title_es : mainBook.title) : null;

    // Aggregate all displayable items for the image grid
    const gridItems = [
        // Main book cover
        mainBook?.cover_image_url ? { id: 'book', type: 'book', image: mainBook.cover_image_url, label: t('card.book') } : null,
        // Collection images
        ...(collection.collection_images || []).map(img => ({
            id: img.id,
            type: 'collection-image',
            image: img.image_url,
            label: img.alt_text || 'Collection image'
        })),
        // Resources with images
        ...(collection.collection_resources || []).map(r => ({
            id: r.id,
            type: r.type,
            image: r.image_url,
            label: isSpanish && r.name_es ? r.name_es : r.name
        })),
        // Merch with images
        ...(collection.collection_merch || []).map(m => ({
            id: m.id,
            type: 'merch',
            image: m.image_url,
            label: isSpanish && m.name_es ? m.name_es : m.name
        }))
    ].filter(item => item && item.image);

    // Take top 4 items to fit grid nicely
    const displayItems = gridItems.slice(0, 4);

    // CSS variables for main container theme
    const cardStyle = {
        '--theme-color-bg': `${collection.theme_color}15`,
    } as React.CSSProperties;

    const firstMerch = collection.collection_merch?.[0];

    return (
        <div className={styles.card} style={cardStyle}>
            <div className={styles.visualSide}>
                <div className={styles.gridContainer}>
                    {displayItems.map((item, idx) => {
                        if (!item) return null;
                        const isFeatured = item.type === 'book';
                        return (
                            <div
                                key={item.id || idx}
                                className={`${styles.gridItem} ${isFeatured ? styles.itemFeatured : ''}`}
                            >
                                <div
                                    className={styles.gridImage}
                                    style={{ backgroundImage: `url('${item.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    role="img"
                                    aria-label={item.label}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.infoSide}>
                <span className={styles.collectionLabel}>{t('card.label')} 0{collection.display_order + 1}</span>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>

                {/* Collection Price */}
                {collection.price && (
                    <div className={styles.priceSection}>
                        <span className={styles.priceLabel}>{t('card.price') || 'Collection Price'}</span>
                        <span className={styles.priceValue}>${collection.price.toFixed(2)}</span>
                    </div>
                )}

                <div className={styles.includesList}>
                    <div className={styles.includesHeader}>{t('card.included')}</div>
                    <div className={styles.includesGrid}>
                        {mainBook && (
                            <div className={styles.includeItem}>
                                <span className={styles.checkIcon}>✓</span>
                                {bookTitle} ({t('card.book')})
                            </div>
                        )}
                        {(collection.collection_resources || []).map(res => (
                            <div key={res.id} className={styles.includeItem}>
                                <span className={styles.checkIcon}>✓</span>
                                {isSpanish && res.name_es ? res.name_es : res.name}
                            </div>
                        ))}
                    </div>
                </div>

                {firstMerch && (
                    <div className={styles.merchSection}>
                        <div className={styles.merchPreview}>
                            {firstMerch.image_url && (
                                <div
                                    className={styles.merchThumb}
                                    style={{ backgroundImage: `url('${firstMerch.image_url}')` }}
                                ></div>
                            )}
                            <div className={styles.merchInfo}>
                                <span className={styles.merchName}>
                                    {isSpanish && firstMerch.name_es ? firstMerch.name_es : firstMerch.name}
                                </span>
                                {firstMerch.price && (
                                    <span className={styles.merchPrice}>+${firstMerch.price}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Always show View Collection button */}
                <button className={styles.ctaButton}>{t('card.viewBtn')}</button>
            </div>
        </div>
    );
};

export default CollectionCard;
