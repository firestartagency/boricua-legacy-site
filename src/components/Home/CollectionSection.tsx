import Link from 'next/link';
import styles from './CollectionSection.module.css';
import CollectionScrollContainer from './Collections/CollectionScrollContainer';
import { useTranslations } from 'next-intl';

const CollectionSection = () => {
    const t = useTranslations('HomePage.collections');

    return (
        <section id="collection" className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>{t('title')}</h2>
                        <p className={styles.subtitle}>{t('subtitle')}</p>
                    </div>
                    <div className={styles.separator}></div>
                </div>
            </div>

            {/* Content: Scroll Driven Interaction */}
            {/* Placed outside container to allow full width/height if needed, but styling handles alignment */}
            <CollectionScrollContainer />
        </section>
    );
};

export default CollectionSection;
