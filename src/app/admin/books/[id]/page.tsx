'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Book, BookImage, BookEdition, BookExcerpt } from '@/types/database';
import styles from './form.module.css';

export default function BookFormPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const bookId = isNew ? null : params.id as string;
    const imageInputRef = useRef<HTMLInputElement>(null);
    const excerptInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Book basic info
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        title_es: '',
        author: '',
        description: '',
        description_es: '',
        cover_image_url: '',
        is_active: true
    });

    // Related data
    const [images, setImages] = useState<BookImage[]>([]);
    const [editions, setEditions] = useState<BookEdition[]>([]);
    const [excerpts, setExcerpts] = useState<BookExcerpt[]>([]);

    // New edition form
    const [newEdition, setNewEdition] = useState({
        format_name: 'Hardcover',
        price: 0,
        purchase_link: '',
        is_featured: false
    });

    useEffect(() => {
        if (!isNew && bookId) {
            fetchBook();
        }
    }, [isNew, bookId]);

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
                description: book.description || '',
                description_es: book.description_es || '',
                cover_image_url: book.cover_image_url || '',
                is_active: book.is_active
            });
        }

        // Fetch related data
        const [imagesRes, editionsRes, excerptsRes] = await Promise.all([
            supabase.from('book_images').select('*').eq('book_id', bookId).order('display_order'),
            supabase.from('book_editions').select('*').eq('book_id', bookId).order('display_order'),
            supabase.from('book_excerpts').select('*').eq('book_id', bookId).order('display_order')
        ]);

        setImages((imagesRes.data as unknown as BookImage[]) || []);
        setEditions((editionsRes.data as unknown as BookEdition[]) || []);
        setExcerpts((excerptsRes.data as unknown as BookExcerpt[]) || []);
        setIsLoading(false);
    };

    // --- IMAGE HANDLERS ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !bookId) return;

        setIsUploading(true);
        setError(null);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${bookId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from('book-covers')
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                setError('Failed to upload: ' + uploadError.message);
                continue;
            }

            const { data: urlData } = supabase.storage.from('book-covers').getPublicUrl(data.path);
            const isCover = images.length === 0 && i === 0; // First image is cover by default

            const { data: imgData } = await supabase
                .from('book_images')
                .insert({
                    book_id: bookId,
                    image_url: urlData.publicUrl,
                    alt_text: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
                    display_order: images.length + i,
                    is_cover: isCover
                } as never)
                .select()
                .single();

            if (imgData) {
                setImages(prev => [...prev, imgData as unknown as BookImage]);
                // If this is the cover, update the book's cover_image_url
                if (isCover) {
                    await supabase.from('books').update({ cover_image_url: urlData.publicUrl } as never).eq('id', bookId);
                    setFormData(prev => ({ ...prev, cover_image_url: urlData.publicUrl }));
                }
            }
        }

        setIsUploading(false);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const setAsCover = async (imageId: string, imageUrl: string) => {
        if (!bookId) return;
        // Unset all covers
        await supabase.from('book_images').update({ is_cover: false } as never).eq('book_id', bookId);
        // Set this one
        await supabase.from('book_images').update({ is_cover: true } as never).eq('id', imageId);
        // Update book cover_image_url
        await supabase.from('books').update({ cover_image_url: imageUrl } as never).eq('id', bookId);

        setImages(prev => prev.map(img => ({ ...img, is_cover: img.id === imageId })));
        setFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
    };

    const deleteImage = async (imageId: string) => {
        await supabase.from('book_images').delete().eq('id', imageId);
        setImages(prev => prev.filter(img => img.id !== imageId));
    };

    // --- EDITION HANDLERS ---
    const addEdition = async () => {
        if (!bookId || !newEdition.format_name) return;

        const { data } = await supabase
            .from('book_editions')
            .insert({
                book_id: bookId,
                format_name: newEdition.format_name,
                price: newEdition.price,
                purchase_link: newEdition.purchase_link || null,
                is_featured: newEdition.is_featured,
                display_order: editions.length
            } as never)
            .select()
            .single();

        if (data) {
            setEditions(prev => [...prev, data as unknown as BookEdition]);
            setNewEdition({ format_name: 'Hardcover', price: 0, purchase_link: '', is_featured: false });
        }
    };

    const deleteEdition = async (editionId: string) => {
        await supabase.from('book_editions').delete().eq('id', editionId);
        setEditions(prev => prev.filter(e => e.id !== editionId));
    };

    // --- EXCERPT HANDLERS ---
    const handleExcerptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !bookId) return;

        setIsUploading(true);
        setError(null);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${bookId}/excerpts/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from('book-covers')
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                setError('Failed to upload excerpt: ' + uploadError.message);
                continue;
            }

            const { data: urlData } = supabase.storage.from('book-covers').getPublicUrl(data.path);

            const { data: excerptData } = await supabase
                .from('book_excerpts')
                .insert({
                    book_id: bookId,
                    image_url: urlData.publicUrl,
                    page_label: `Page ${excerpts.length + i + 1}`,
                    display_order: excerpts.length + i
                } as never)
                .select()
                .single();

            if (excerptData) {
                setExcerpts(prev => [...prev, excerptData as unknown as BookExcerpt]);
            }
        }

        setIsUploading(false);
        if (excerptInputRef.current) excerptInputRef.current.value = '';
    };

    const deleteExcerpt = async (excerptId: string) => {
        await supabase.from('book_excerpts').delete().eq('id', excerptId);
        setExcerpts(prev => prev.filter(e => e.id !== excerptId));
    };

    // --- BOOK FORM HANDLERS ---
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

        const payload = { ...formData };

        if (isNew) {
            const { data: newBook, error: insertErr } = await supabase
                .from('books')
                .insert([payload] as never[])
                .select()
                .single();

            if (insertErr) {
                setError(insertErr.message);
                setIsSaving(false);
                return;
            }
            if (newBook) {
                router.push(`/admin/books/${(newBook as unknown as Book).id}`);
                return;
            }
        } else if (bookId) {
            const { error: updateErr } = await supabase
                .from('books')
                .update(payload as never)
                .eq('id', bookId);

            if (updateErr) {
                setError(updateErr.message);
            }
        }
        setIsSaving(false);
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
                <button onClick={() => router.push('/admin/books')} className={styles.backBtn}>
                    ← Back to Books
                </button>
                <h1>{isNew ? 'Add New Book' : `Edit: ${formData.title}`}</h1>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                {/* Basic Info Section */}
                <section className={styles.section}>
                    <h2>📝 Basic Info</h2>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Title (English) *</label>
                            <input name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Title (Spanish)</label>
                            <input name="title_es" value={formData.title_es} onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Slug *</label>
                            <div className={styles.slugField}>
                                <input name="slug" value={formData.slug} onChange={handleChange} required />
                                <button type="button" onClick={generateSlug}>Generate</button>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>Author</label>
                            <input name="author" value={formData.author} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* Description Section */}
                <section className={styles.section}>
                    <h2>📄 Description</h2>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Description (English)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
                        </div>
                        <div className={styles.field}>
                            <label>Description (Spanish)</label>
                            <textarea name="description_es" value={formData.description_es} onChange={handleChange} rows={4} />
                        </div>
                    </div>
                </section>

                {/* Active Toggle */}
                <section className={styles.section}>
                    <div className={styles.checkboxField}>
                        <label>
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                            Active (visible on website)
                        </label>
                    </div>
                </section>

                {/* Save Book Button */}
                <div className={styles.actions}>
                    <button type="button" onClick={() => router.push('/admin/books')} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                        {isSaving ? 'Saving...' : (isNew ? 'Create Book' : 'Save Changes')}
                    </button>
                </div>
            </form>

            {/* === SECTIONS BELOW ONLY SHOW AFTER BOOK IS SAVED === */}
            {!isNew && bookId && (
                <>
                    {/* Images Gallery Section */}
                    <section className={styles.section} style={{ marginTop: '2rem' }}>
                        <h2>🖼️ Book Images</h2>
                        <p className={styles.hint}>Upload multiple images. The first image (or one marked ★) becomes the cover.</p>

                        <div className={styles.imageGrid}>
                            {images.map(img => (
                                <div key={img.id} className={`${styles.imageCard} ${img.is_cover ? styles.coverCard : ''}`}>
                                    <img src={img.image_url} alt={img.alt_text || 'Book image'} className={styles.imageThumb} />
                                    <div className={styles.imageActions}>
                                        {!img.is_cover && (
                                            <button
                                                type="button"
                                                onClick={() => setAsCover(img.id, img.image_url)}
                                                className={styles.setCoverBtn}
                                                title="Set as cover"
                                            >★</button>
                                        )}
                                        {img.is_cover && <span className={styles.coverBadge}>Cover</span>}
                                        <button
                                            type="button"
                                            onClick={() => deleteImage(img.id)}
                                            className={styles.deleteSmBtn}
                                            title="Delete"
                                        >✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <input
                            type="file"
                            ref={imageInputRef}
                            onChange={handleImageUpload}
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            hidden
                        />
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className={styles.uploadBtn}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : '+ Upload Images'}
                        </button>
                    </section>

                    {/* Editions / Pricing Section */}
                    <section className={styles.section} style={{ marginTop: '1.5rem' }}>
                        <h2>💰 Editions & Pricing</h2>
                        <p className={styles.hint}>Add different formats (Hardcover, eBook, Paperback) with prices and purchase links.</p>

                        {editions.length > 0 && (
                            <div className={styles.editionsList}>
                                {editions.map(ed => (
                                    <div key={ed.id} className={styles.editionRow}>
                                        <span className={styles.editionFormat}>
                                            {ed.format_name}
                                            {ed.is_featured && <span className={styles.featuredBadge}>Featured</span>}
                                        </span>
                                        <span className={styles.editionPrice}>${Number(ed.price).toFixed(2)}</span>
                                        {ed.purchase_link && (
                                            <a href={ed.purchase_link} target="_blank" rel="noopener noreferrer" className={styles.editionLink}>
                                                Link ↗
                                            </a>
                                        )}
                                        <button type="button" onClick={() => deleteEdition(ed.id)} className={styles.deleteSmBtn}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.addEditionForm}>
                            <select
                                value={newEdition.format_name}
                                onChange={e => setNewEdition(prev => ({ ...prev, format_name: e.target.value }))}
                            >
                                <option value="Hardcover">Hardcover</option>
                                <option value="Paperback">Paperback</option>
                                <option value="eBook">eBook</option>
                                <option value="Audiobook">Audiobook</option>
                                <option value="Special Edition">Special Edition</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Price"
                                value={newEdition.price || ''}
                                onChange={e => setNewEdition(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                step="0.01"
                                min="0"
                            />
                            <input
                                type="url"
                                placeholder="Purchase link (URL)"
                                value={newEdition.purchase_link}
                                onChange={e => setNewEdition(prev => ({ ...prev, purchase_link: e.target.value }))}
                            />
                            <label className={styles.inlineCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={newEdition.is_featured}
                                    onChange={e => setNewEdition(prev => ({ ...prev, is_featured: e.target.checked }))}
                                />
                                Featured
                            </label>
                            <button type="button" onClick={addEdition} className={styles.addBtn}>
                                + Add
                            </button>
                        </div>
                    </section>

                    {/* Excerpt Pages Section */}
                    <section className={styles.section} style={{ marginTop: '1.5rem', marginBottom: '3rem' }}>
                        <h2>📖 Excerpt Pages</h2>
                        <p className={styles.hint}>Upload images of excerpt pages. Viewers will see these in a popup carousel.</p>

                        <div className={styles.imageGrid}>
                            {excerpts.map((ex, idx) => (
                                <div key={ex.id} className={styles.imageCard}>
                                    <img src={ex.image_url} alt={ex.page_label} className={styles.imageThumb} />
                                    <div className={styles.imageActions}>
                                        <span className={styles.pageLabel}>Page {idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => deleteExcerpt(ex.id)}
                                            className={styles.deleteSmBtn}
                                            title="Delete"
                                        >✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <input
                            type="file"
                            ref={excerptInputRef}
                            onChange={handleExcerptUpload}
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            hidden
                        />
                        <button
                            type="button"
                            onClick={() => excerptInputRef.current?.click()}
                            className={styles.uploadBtn}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : '+ Upload Excerpt Pages'}
                        </button>
                    </section>
                </>
            )}

            {isNew && (
                <div className={styles.section} style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
                    <p>💡 Save the book first to unlock image uploads, editions, and excerpt pages.</p>
                </div>
            )}
        </div>
    );
}
