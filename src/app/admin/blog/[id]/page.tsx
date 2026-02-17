'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { BlogPost } from '@/types/database';
import styles from '../../collections/[id]/form.module.css';

export default function BlogFormPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const postId = isNew ? null : params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        title_es: '',
        slug: '',
        excerpt: '',
        excerpt_es: '',
        content: '',
        content_es: '',
        featured_image_url: '',
        author: '',
        category: '',
        is_published: false
    });

    useEffect(() => {
        if (!isNew && postId) {
            fetchPost();
        }
    }, [isNew, postId]);

    const fetchPost = async () => {
        if (!postId) return;
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            setError('Post not found');
        } else if (data) {
            const post = data as unknown as BlogPost;
            setFormData({
                title: post.title || '',
                title_es: post.title_es || '',
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                excerpt_es: post.excerpt_es || '',
                content: post.content || '',
                content_es: post.content_es || '',
                featured_image_url: post.featured_image_url || '',
                author: post.author || '',
                category: post.category || '',
                is_published: post.is_published
            });
        }
        setIsLoading(false);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: isNew ? generateSlug(title) : prev.slug
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const fileExt = file.name.split('.').pop();
        const fileName = `blog/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resources')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            setError('Failed to upload image: ' + uploadError.message);
            setIsUploading(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from('resources')
            .getPublicUrl(uploadData.path);

        setFormData(prev => ({ ...prev, featured_image_url: urlData.publicUrl }));
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        if (!formData.slug) {
            setError('Slug is required');
            setIsSaving(false);
            return;
        }

        const postData = {
            ...formData,
            published_at: formData.is_published ? new Date().toISOString() : null
        };

        let result;
        if (isNew) {
            result = await supabase.from('blog_posts').insert([postData] as never[]).select();
        } else if (postId) {
            result = await supabase.from('blog_posts').update(postData as never).eq('id', postId);
        } else {
            setError('Invalid post ID');
            setIsSaving(false);
            return;
        }

        if (result.error) {
            setError(result.error.message);
            setIsSaving(false);
        } else {
            router.push('/admin/blog');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    ← Back
                </button>
                <h1>{isNew ? 'Create Blog Post' : 'Edit Blog Post'}</h1>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <section className={styles.section}>
                    <h2>📝 Post Details</h2>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Title (English) *</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="The History of Puerto Rican Literature"
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Title (Spanish)</label>
                            <input
                                name="title_es"
                                value={formData.title_es}
                                onChange={handleChange}
                                placeholder="La Historia de la Literatura Puertorriqueña"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>URL Slug *</label>
                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="history-of-puerto-rican-literature"
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="">Select category...</option>
                                <option value="culture">Culture</option>
                                <option value="history">History</option>
                                <option value="books">Books</option>
                                <option value="events">Events</option>
                                <option value="news">News</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Author</label>
                            <input
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Jacqueline Rosado"
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>🖼️ Featured Image</h2>
                    {formData.featured_image_url && (
                        <div style={{ marginBottom: '1rem' }}>
                            <img
                                src={formData.featured_image_url}
                                alt="Featured"
                                style={{ maxWidth: '300px', borderRadius: '8px' }}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={styles.uploadBtn}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : formData.featured_image_url ? 'Change Image' : '+ Add Image'}
                    </button>
                </section>

                <section className={styles.section}>
                    <h2>📄 Excerpt (Short Summary)</h2>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Excerpt (English)</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                placeholder="A brief introduction to the post..."
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Excerpt (Spanish)</label>
                            <textarea
                                name="excerpt_es"
                                value={formData.excerpt_es}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Una breve introducción al artículo..."
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>📖 Content (Supports Markdown)</h2>
                    <div className={styles.field}>
                        <label>Content (English)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={12}
                            placeholder="Write your blog post content here. You can use Markdown for formatting..."
                            style={{ fontFamily: 'monospace' }}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Content (Spanish)</label>
                        <textarea
                            name="content_es"
                            value={formData.content_es}
                            onChange={handleChange}
                            rows={12}
                            placeholder="Escribe el contenido del artículo aquí. Puedes usar Markdown..."
                            style={{ fontFamily: 'monospace' }}
                        />
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.checkboxField}>
                        <label>
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={formData.is_published}
                                onChange={handleChange}
                            />
                            Publish this post (visible on the blog)
                        </label>
                    </div>
                </section>

                <div className={styles.actions}>
                    <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                        {isSaving ? 'Saving...' : (isNew ? 'Create Post' : 'Save Changes')}
                    </button>
                </div>
            </form>
        </div>
    );
}
