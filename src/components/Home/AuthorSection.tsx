import Link from 'next/link';
import styles from './AuthorSection.module.css';
import { useTranslations } from 'next-intl';

const AuthorSection = () => {
    const t = useTranslations('HomePage.author');

    return (
        <section id="author" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>

                    {/* Image Column */}
                    <div className={styles.imageColumn}>
                        <div className={styles.imageDecor}></div>
                        <div className={styles.imageWrapper}>
                            <img
                                src="https://i.ibb.co/xSkXFkHg/Jacky-2.jpg"
                                alt="Jacqueline Jimenez"
                                className={styles.authorImage}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div className={styles.authorBadge}>
                            <p className={styles.badgeLabel}>{t('badge_label')}</p>
                            <p className={styles.badgeName}>Jacqueline Jimenez</p>
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className={styles.textColumn}>
                        <h2 className={styles.eyebrow}>{t('eyebrow')}</h2>
                        <h3 className={styles.title}>{t('title')}</h3>

                        <div className={styles.bio}>
                            <p>
                                {t('bio_p1')}
                            </p>
                            <p>
                                {t('bio_p2_pre')}<Link href="/books/boricua-legacy"><strong>{t('bio_p2_link')}</strong></Link>{t('bio_p2_post')}
                            </p>
                        </div>

                        <div className={styles.signatureWrapper}>
                            <span className={styles.signature}>Jacqueline</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AuthorSection;
