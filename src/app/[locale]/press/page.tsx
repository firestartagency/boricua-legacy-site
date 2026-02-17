'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { useLocale, useTranslations } from 'next-intl';
import styles from './page.module.css';
import type { PressMention } from '@/types/database';

export default function PressPage() {
    const supabase = createClientComponentClient();
    const locale = useLocale();
    const t = useTranslations('Press');
    const [mentions, setMentions] = useState<PressMention[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMentions = async () => {
            const { data, error } = await supabase
                .from('press_mentions')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (!error && data) {
                setMentions(data as unknown as PressMention[]);
            }
            setIsLoading(false);
        };

        fetchMentions();
    }, [supabase]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
            </section>

            <section className={styles.content}>
                {/* Press Kit Section */}
                <div className={styles.pressKit}>
                    <h2>{t('pressKit.title')}</h2>
                    <p>{t('pressKit.description')}</p>
                    <div className={styles.pressKitActions}>
                        <a href="/press-kit.pdf" className={styles.downloadBtn} download>
                            📄 {t('pressKit.download')}
                        </a>
                        <a href="mailto:press@boricualegacy.com" className={styles.contactBtn}>
                            ✉️ {t('pressKit.contact')}
                        </a>
                    </div>
                </div>

                {/* Media Coverage */}
                <div className={styles.coverage}>
                    <h2>{t('coverage.title')}</h2>

                    {isLoading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : mentions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>{t('coverage.empty')}</p>
                        </div>
                    ) : (
                        <div className={styles.mentionsList}>
                            {mentions.map((mention) => {
                                const headline = locale === 'es' && mention.headline_es
                                    ? mention.headline_es
                                    : mention.headline;
                                const quote = locale === 'es' && mention.quote_es
                                    ? mention.quote_es
                                    : mention.quote;

                                return (
                                    <article key={mention.id} className={styles.mentionCard}>
                                        <div className={styles.outletInfo}>
                                            {mention.outlet_logo_url && (
                                                <img
                                                    src={mention.outlet_logo_url}
                                                    alt={mention.outlet_name}
                                                    className={styles.outletLogo}
                                                />
                                            )}
                                            <span className={styles.outletName}>{mention.outlet_name}</span>
                                        </div>
                                        <h3 className={styles.headline}>{headline}</h3>
                                        {quote && (
                                            <blockquote className={styles.quote}>
                                                "{quote}"
                                            </blockquote>
                                        )}
                                        <div className={styles.mentionMeta}>
                                            {mention.published_date && (
                                                <span className={styles.date}>
                                                    {formatDate(mention.published_date)}
                                                </span>
                                            )}
                                            {mention.article_url && (
                                                <a
                                                    href={mention.article_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.articleLink}
                                                >
                                                    {t('coverage.readArticle')} →
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
