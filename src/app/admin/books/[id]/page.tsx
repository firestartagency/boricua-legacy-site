'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Book, Collection } from '@/types/database';
import styles from './form.module.css';

export default function BookFormPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const bookId = isNew ? null : params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        title_es: '',
        author: '',
        price: 0,
        description: '',
        description_es: '',
        cover_image_url: '',
        spine_text: '',
        spine_color: '#d4af37',
        collection_id: '',
        is_active: true
    });

    useEffect(() => {
        fetchCollections();
        if (!isNew && bookId) {
            fetchBook();
        }
    }, [isNew, bookId]);

    const fetchCollections = async () => {
        const { data } = await supabase.from('collections').select('*').order('title');
        setCollections(data || []);
    };

    const fetchBook = async () => {
        if (!bookId) return;
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', bookId)
            .single();

        if (error) {
            setError('Book not found');
        } else if (data) {
            const book = data as unknown as Book;
            setFormData({
                slug: book.slug || '',
                title: book.title || '',
                title_es: book.title_es || '',
                author: book.author || '',
                price: book.price || 0,
                description: book.description || '',
                description_es: book.description_es || '',
                cover_image_url: book.cover_image_url || '',
                spine_text: book.spine_text || '',
                spine_color: book.spine_color || '#d4af37',
                collection_id: book.collection_id || '',
                is_active: book.is_active
            });
        }
        setIsLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('book-covers')
            .upload(fileName, file, { upsert: true });

        if (error) {
            setError('Failed to upload image: ' + error.message);
        } else {
            // Get public URL
            const { data: urlData } = supabase.storage
                .from('book-covers')
                .getPublicUrl(data.path);

            setFormData(prev => ({
                ...prev,
                cover_image_url: urlData.publicUrl
            }));
        }
        setIsUploading(false);
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const payload = {
            ...formData,
            collection_id: formData.collection_id || null,
            price: formData.price || null
        };

        let result;
        if (isNew) {
            result = await supabase.from('books').insert([payload] as never[]);
        } else if (bookId) {
            result = await supabase.from('books').update(payload as never).eq('id', bookId);
        } else {
            setError('Invalid book ID');
            setIsSaving(false);
            return;
        }

        if (result.error) {
            setError(result.error.message);
            setIsSaving(false);
        } else {
            router.push('/admin/books');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value
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
                <h1>{isNew ? 'Add New Book' : 'Edit Book'}</h1>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.columns}>
                    {/* Left Column - Cover Image */}
                    <div className={styles.imageSection}>
                        <h2>📚 Cover Image</h2>
                        <div className={styles.imageUpload}>
                            {formData.cover_image_url ? (
                                <img
                                    src={formData.cover_image_url}
                                    alt="Book cover preview"
                                    className={styles.coverPreview}
                                />
                            ) : (
                                <div className={styles.coverPlaceholder}>
                                    <span>📖</span>
                                    <p>No cover image</p>
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
                                {isUploading ? 'Uploading...' : 'Upload Cover Image'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className={styles.detailsSection}>
                        <section className={styles.section}>
                            <h2>📝 Basic Info</h2>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Title (English) *</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Title (Spanish)</label>
                                    <input
                                        name="title_es"
                                        value={formData.title_es}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Slug *</label>
                                    <div className={styles.slugField}>
                                        <input
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button type="button" onClick={generateSlug}>Generate</button>
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label>Author</label>
                                    <input
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Collection</label>
                                    <select
                                        name="collection_id"
                                        value={formData.collection_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- No collection --</option>
                                        {collections.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>📄 Description</h2>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Description (English)</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Description (Spanish)</label>
                                    <textarea
                                        name="description_es"
                                        value={formData.description_es}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>🎨 Spine Styling</h2>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Spine Text</label>
                                    <input
                                        name="spine_text"
                                        value={formData.spine_text}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Spine Color</label>
                                    <input
                                        type="color"
                                        name="spine_color"
                                        value={formData.spine_color}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <div className={styles.checkboxField}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                    />
                                    Active (visible on website)
                                </label>
                            </div>
                        </section>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                        {isSaving ? 'Saving...' : (isNew ? 'Create Book' : 'Save Changes')}
                    </button>
                </div>
            </form>
        </div>
    );
}
