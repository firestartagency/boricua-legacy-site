'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/types/database';
import styles from '../collections/page.module.css';

export default function BlogPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) {
            setPosts((data as unknown as BlogPost[]) || []);
        }
        setIsLoading(false);
    };

    const handleTogglePublished = async (id: string, currentState: boolean) => {
        const updates: Record<string, unknown> = { is_published: !currentState };
        if (!currentState) {
            updates.published_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from('blog_posts')
            .update(updates as never)
            .eq('id', id);

        if (!error) fetchPosts();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this blog post permanently?')) return;

        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (!error) fetchPosts();
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Not set';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading blog posts...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>📝 Blog Posts</h1>
                    <p>Create and manage blog content</p>
                </div>
                <button
                    onClick={() => router.push('/admin/blog/new')}
                    className={styles.addBtn}
                >
                    + New Post
                </button>
            </header>

            {posts.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No blog posts yet. Create your first post!</p>
                    <button
                        onClick={() => router.push('/admin/blog/new')}
                        className={styles.addBtn}
                    >
                        + Create Post
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.card}>
                            <div
                                className={styles.colorBar}
                                style={{ backgroundColor: post.is_published ? '#10b981' : '#f59e0b' }}
                            />
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <h3>{post.title}</h3>
                                    <span className={`${styles.status} ${post.is_published ? styles.active : styles.inactive}`}>
                                        {post.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p className={styles.description}>
                                    {post.excerpt || 'No excerpt'}
                                </p>
                                <div className={styles.meta}>
                                    <span>By: {post.author || 'Unknown'}</span>
                                    <span>•</span>
                                    <span>{formatDate(post.published_at || post.created_at)}</span>
                                    {post.category && (
                                        <>
                                            <span>•</span>
                                            <span>{post.category}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    onClick={() => handleTogglePublished(post.id, post.is_published)}
                                    className={styles.toggleBtn}
                                >
                                    {post.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/blog/${post.id}`)}
                                    className={styles.editBtn}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className={styles.deleteBtn}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
