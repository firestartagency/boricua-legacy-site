import styles from './MissionSection.module.css';
import { useTranslations } from 'next-intl';

const MissionSection = () => {
    const t = useTranslations('HomePage.mission');

    return (
        <section id="mission" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Quote Column */}
                    <div className={styles.quoteColumn}>
                        <span className={styles.quoteMark}>“</span>
                        <blockquote className={styles.quote}>
                            {t('quote')}
                        </blockquote>
                        <div className={styles.missionLabelWrapper}>
                            <div className={styles.separator}></div>
                            <span className={styles.missionLabel}>{t('label')}</span>
                        </div>
                    </div>

                    {/* Pillars Column */}
                    <div className={styles.pillarsColumn}>

                        {/* Pillar 1 */}
                        <div className={styles.pillarCard}>
                            <div className={styles.iconBox}>
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <div className={styles.pillarContent}>
                                <h3 className={styles.pillarTitle}>{t('pillars.preservation.title')}</h3>
                                <p className={styles.pillarText}>
                                    {t('pillars.preservation.text')}
                                </p>
                            </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className={styles.pillarCard}>
                            <div className={styles.iconBox}>
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <div className={styles.pillarContent}>
                                <h3 className={styles.pillarTitle}>{t('pillars.education.title')}</h3>
                                <p className={styles.pillarText}>
                                    {t('pillars.education.text')}
                                </p>
                            </div>
                        </div>

                        {/* Pillar 3 */}
                        <div className={styles.pillarCard}>
                            <div className={styles.iconBox}>
                                <span className="material-symbols-outlined">auto_awesome</span>
                            </div>
                            <div className={styles.pillarContent}>
                                <h3 className={styles.pillarTitle}>{t('pillars.inspiration.title')}</h3>
                                <p className={styles.pillarText}>
                                    {t('pillars.inspiration.text')}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
