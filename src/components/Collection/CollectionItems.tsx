'use client';

import styles from './CollectionItems.module.css';

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

interface CollectionItemsProps {
    collection: {
        collection_items: CollectionItemType[];
    };
    locale: string;
}

const TYPE_LABELS: Record<string, string> = {
    book: 'Book',
    merch: 'Merch',
    resource: 'Resource',
    digital: 'Digital',
    other: 'Item',
};

const CollectionItems = ({ collection, locale }: CollectionItemsProps) => {
    const isEs = locale === 'es';

    const activeItems = (collection.collection_items || [])
        .filter(item => item.is_active && item.grid_size !== 'hidden')
        .sort((a, b) => a.display_order - b.display_order);

    if (activeItems.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <span className={styles.eyebrow}>
                        {isEs ? 'Lo que incluye' : 'What\'s Inside'}
                    </span>
                    <h2 className={styles.heading}>
                        {isEs ? 'Todo en esta Colección' : 'Everything in this Collection'}
                    </h2>
                    <div className={styles.divider} />
                </div>

                <div className={styles.grid}>
                    {activeItems.map(item => {
                        const name = (isEs && item.name_es) || item.name;
                        const desc = (isEs && item.description_es) || item.description;
                        const typeLabel = TYPE_LABELS[item.type] || 'Item';

                        return (
                            <article key={item.id} className={styles.card}>
                                {/* Image */}
                                {item.image_url ? (
                                    <div className={styles.cardImageWrap}>
                                        <img
                                            src={item.image_url}
                                            alt={name}
                                            className={styles.cardImage}
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.cardImagePlaceholder}>
                                        <span>{typeLabel}</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className={styles.cardBody}>
                                    <div className={styles.cardMeta}>
                                        <span className={`${styles.typeBadge} ${styles[`type_${item.type}`] || ''}`}>
                                            {typeLabel}
                                        </span>
                                        {item.is_included && (
                                            <span className={styles.includedTag}>
                                                ✓ {isEs ? 'Incluido' : 'Included'}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className={styles.cardTitle}>{name}</h3>

                                    {desc && (
                                        <p className={styles.cardDesc}>{desc}</p>
                                    )}

                                    <div className={styles.cardFooter}>
                                        {item.price != null && item.price > 0 && (
                                            <span className={styles.cardPrice}>
                                                ${item.price.toFixed(2)}
                                            </span>
                                        )}

                                        {item.purchase_url && (
                                            <a
                                                href={item.purchase_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.buyLink}
                                            >
                                                {isEs ? 'Comprar' : 'Buy'}
                                                <span>→</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CollectionItems;
