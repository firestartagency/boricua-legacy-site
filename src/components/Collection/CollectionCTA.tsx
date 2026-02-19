'use client';

import Link from 'next/link';
import styles from './CollectionCTA.module.css';

interface CollectionCTAProps {
    collection: {
        price: number | null;
        original_price: number | null;
        sale_price: number | null;
        is_on_sale: boolean;
        primary_btn_text: string;
        primary_btn_text_es: string | null;
        primary_btn_link: string | null;
        collection_items: Array<{
            is_included: boolean;
            is_active: boolean;
            name: string;
            name_es: string | null;
            display_order: number;
        }>;
    };
    locale: string;
}

const CollectionCTA = ({ collection, locale }: CollectionCTAProps) => {
    const isEs = locale === 'es';

    const displayPrice = collection.is_on_sale && collection.sale_price
        ? collection.sale_price
        : collection.price;

    const primaryText = (isEs && collection.primary_btn_text_es) || collection.primary_btn_text || 'Order Now';

    // Included items checklist
    const includedItems = (collection.collection_items || [])
        .filter(item => item.is_included && item.is_active)
        .sort((a, b) => a.display_order - b.display_order);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.inner}>
                    <span className={styles.eyebrow}>
                        {isEs ? '¿Listo para ordenar?' : 'Ready to Order?'}
                    </span>

                    <h2 className={styles.heading}>
                        {isEs
                            ? 'Lleva la colección completa a casa'
                            : 'Take the Full Collection Home'}
                    </h2>

                    {/* Included checklist */}
                    {includedItems.length > 0 && (
                        <div className={styles.checklist}>
                            {includedItems.map(item => {
                                const name = (isEs && item.name_es) || item.name;
                                return (
                                    <div key={item.name} className={styles.checkItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span>{name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Price + Button */}
                    <div className={styles.priceBlock}>
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
                                    </>
                                ) : (
                                    <span className={styles.price}>
                                        ${displayPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        )}

                        {collection.primary_btn_link ? (
                            <Link href={collection.primary_btn_link} className={styles.orderBtn}>
                                {primaryText}
                            </Link>
                        ) : (
                            <button className={styles.orderBtn}>{primaryText}</button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionCTA;
