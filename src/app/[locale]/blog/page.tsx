'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './page.module.css';
import type { BlogPost } from '@/types/database';

export default function BlogPage() {
    const supabase = createClientComponentClient();
    const locale = useLocale();
    const t = useTranslations('Blog');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (!error && data) {
                setPosts(data as unknown as BlogPost[]);
            }
            setIsLoading(false);
        };

        fetchPosts();
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

            <section className={styles.postsSection}>
                {isLoading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : posts.length === 0 ? (
                    <div className={styles.empty}>
                        <p>{t('empty')}</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {posts.map((post) => {
                            const title = locale === 'es' && post.title_es ? post.title_es : post.title;
                            const excerpt = locale === 'es' && post.excerpt_es ? post.excerpt_es : post.excerpt;

                            return (
                                <article key={post.id} className={styles.card}>
                                    {post.featured_image_url && (
                                        <div className={styles.imageWrapper}>
                                            <img
                                                src={post.featured_image_url}
                                                alt={title}
                                                className={styles.image}
                                            />
                                        </div>
                                    )}
                                    <div className={styles.cardContent}>
                                        <div className={styles.meta}>
                                            {post.category && (
                                                <span className={styles.category}>{post.category}</span>
                                            )}
                                            <span className={styles.date}>
                                                {formatDate(post.published_at)}
                                            </span>
                                        </div>
                                        <h2 className={styles.cardTitle}>{title}</h2>
                                        {excerpt && (
                                            <p className={styles.excerpt}>{excerpt}</p>
                                        )}
                                        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                                            {t('readMore')} →
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
