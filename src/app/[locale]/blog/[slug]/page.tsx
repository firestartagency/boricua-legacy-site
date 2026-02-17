'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import styles from './page.module.css';
import type { BlogPost } from '@/types/database';

export default function BlogPostPage() {
    const supabase = createClientComponentClient();
    const locale = useLocale();
    const t = useTranslations('Blog');
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (!error && data) {
                setPost(data as unknown as BlogPost);
            }
            setIsLoading(false);
        };

        fetchPost();
    }, [supabase, slug]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Simple markdown-like rendering (bold, italic, headers, paragraphs)
    const renderContent = (content: string) => {
        return content.split('\n\n').map((paragraph, i) => {
            // Headers
            if (paragraph.startsWith('# ')) {
                return <h1 key={i} className={styles.h1}>{paragraph.slice(2)}</h1>;
            }
            if (paragraph.startsWith('## ')) {
                return <h2 key={i} className={styles.h2}>{paragraph.slice(3)}</h2>;
            }
            if (paragraph.startsWith('### ')) {
                return <h3 key={i} className={styles.h3}>{paragraph.slice(4)}</h3>;
            }
            // Regular paragraph
            return <p key={i} className={styles.paragraph}>{paragraph}</p>;
        });
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!post) {
        return (
            <div className={styles.notFound}>
                <h1>{t('notFound')}</h1>
                <Link href="/blog" className={styles.backLink}>← {t('backToBlog')}</Link>
            </div>
        );
    }

    const title = locale === 'es' && post.title_es ? post.title_es : post.title;
    const content = locale === 'es' && post.content_es ? post.content_es : post.content;

    return (
        <main className={styles.main}>
            <article className={styles.article}>
                <Link href="/blog" className={styles.backLink}>
                    ← {t('backToBlog')}
                </Link>

                <header className={styles.header}>
                    <div className={styles.meta}>
                        {post.category && (
                            <span className={styles.category}>{post.category}</span>
                        )}
                        <span className={styles.date}>{formatDate(post.published_at)}</span>
                        {post.author && (
                            <span className={styles.author}>by {post.author}</span>
                        )}
                    </div>
                    <h1 className={styles.title}>{title}</h1>
                </header>

                {post.featured_image_url && (
                    <div className={styles.featuredImage}>
                        <img src={post.featured_image_url} alt={title} />
                    </div>
                )}

                <div className={styles.content}>
                    {content && renderContent(content)}
                </div>
            </article>
        </main>
    );
}
