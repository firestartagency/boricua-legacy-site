import styles from './AudienceSection.module.css';
import { useTranslations } from 'next-intl';

const AudienceSection = () => {
    const t = useTranslations('HomePage.audience');

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{t('title')}</h2>
                </div>

                <div className={styles.grid}>
                    {/* Item 1: Families */}
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <h3 className={styles.cardTitle}>{t('cards.families.title')}</h3>
                        <p className={styles.cardText}>{t('cards.families.text')}</p>
                        <button className={styles.learnMoreBtn}>{t('learnMore')}</button>
                    </div>

                    {/* Item 2: Educators */}
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h3 className={styles.cardTitle}>{t('cards.educators.title')}</h3>
                        <p className={styles.cardText}>{t('cards.educators.text')}</p>
                        <button className={styles.learnMoreBtn}>{t('learnMore')}</button>
                    </div>

                    {/* Item 3: Libraries */}
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">local_library</span>
                        </div>
                        <h3 className={styles.cardTitle}>{t('cards.libraries.title')}</h3>
                        <p className={styles.cardText}>{t('cards.libraries.text')}</p>
                        <button className={styles.learnMoreBtn}>{t('learnMore')}</button>
                    </div>

                    {/* Item 4: Readers */}
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <h3 className={styles.cardTitle}>{t('cards.readers.title')}</h3>
                        <p className={styles.cardText}>{t('cards.readers.text')}</p>
                        <button className={styles.learnMoreBtn}>{t('learnMore')}</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AudienceSection;
