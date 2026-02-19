'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { HeroSlide, Book } from '@/types/database';
import styles from './form.module.css';

export default function HeroSlideFormPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const slideId = isNew ? null : params.id as string;

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        book_id: '',
        headline_1: '',
        headline_1_es: '',
        headline_2: '',
        headline_2_es: '',
        headline_3: '',
        headline_3_es: '',
        subtext: '',
        subtext_es: '',
        button_primary_text: 'Order Now',
        button_primary_text_es: 'Ordenar Ahora',
        button_primary_link: '/books',
        button_secondary_text: 'Read an Excerpt',
        button_secondary_text_es: 'Leer un Extracto',
        button_secondary_link: '',
        display_order: 0,
        show_spine: false,
        is_active: true
    });

    useEffect(() => {
        fetchBooks();
        if (!isNew && slideId) {
            fetchSlide();
        }
    }, [isNew, slideId]);

    const fetchBooks = async () => {
        const { data } = await supabase
            .from('books')
            .select('*')
            .eq('is_active', true)
            .order('title');
        setBooks((data as unknown as Book[]) || []);
    };

    const fetchSlide = async () => {
        if (!slideId) return;
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .eq('id', slideId)
            .single();

        if (error) {
            setError('Slide not found');
        } else if (data) {
            const slide = data as unknown as HeroSlide;
            setFormData({
                book_id: slide.book_id || '',
                headline_1: slide.headline_1 || '',
                headline_1_es: slide.headline_1_es || '',
                headline_2: slide.headline_2 || '',
                headline_2_es: slide.headline_2_es || '',
                headline_3: slide.headline_3 || '',
                headline_3_es: slide.headline_3_es || '',
                subtext: slide.subtext || '',
                subtext_es: slide.subtext_es || '',
                button_primary_text: slide.button_primary_text || 'Order Now',
                button_primary_text_es: slide.button_primary_text_es || 'Ordenar Ahora',
                button_primary_link: slide.button_primary_link || '/books',
                button_secondary_text: slide.button_secondary_text || 'Read an Excerpt',
                button_secondary_text_es: slide.button_secondary_text_es || 'Leer un Extracto',
                button_secondary_link: slide.button_secondary_link || '',
                display_order: slide.display_order || 0,
                show_spine: slide.show_spine || false,
                is_active: slide.is_active
            });
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const payload = {
            ...formData,
            book_id: formData.book_id || null
        };

        let result;
        if (isNew) {
            result = await supabase.from('hero_slides').insert([payload] as never[]);
        } else if (slideId) {
            result = await supabase.from('hero_slides').update(payload as never).eq('id', slideId);
        } else {
            setError('Invalid slide ID');
            setIsSaving(false);
            return;
        }

        if (result.error) {
            setError(result.error.message);
            setIsSaving(false);
        } else {
            router.push('/admin/hero');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    // When a book is selected, auto-fill the primary button link with its slug
    const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bookId = e.target.value;
        const selectedBook = books.find(b => b.id === bookId);
        setFormData(prev => ({
            ...prev,
            book_id: bookId,
            button_primary_link: selectedBook ? `/books/${selectedBook.slug}` : prev.button_primary_link
        }));
    };

    const selectedBook = books.find(b => b.id === formData.book_id);

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    ← Back
                </button>
                <h1>{isNew ? 'Create Hero Slide' : 'Edit Hero Slide'}</h1>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                {/* Headline Section */}
                <section className={styles.section}>
                    <h2>📝 Headline</h2>
                    <p className={styles.hint}>The main title displayed on the hero slide</p>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Headline Line 1 (English)</label>
                            <input
                                name="headline_1"
                                value={formData.headline_1}
                                onChange={handleChange}
                                placeholder="Voices of"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Headline Line 1 (Spanish)</label>
                            <input
                                name="headline_1_es"
                                value={formData.headline_1_es}
                                onChange={handleChange}
                                placeholder="Voces de la"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Headline Line 2 (English)</label>
                            <input
                                name="headline_2"
                                value={formData.headline_2}
                                onChange={handleChange}
                                placeholder="The Diaspora."
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Headline Line 2 (Spanish)</label>
                            <input
                                name="headline_2_es"
                                value={formData.headline_2_es}
                                onChange={handleChange}
                                placeholder="Diáspora."
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Headline Line 3 - Italic (English)</label>
                            <input
                                name="headline_3"
                                value={formData.headline_3}
                                onChange={handleChange}
                                placeholder="Volume II."
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Headline Line 3 - Italic (Spanish)</label>
                            <input
                                name="headline_3_es"
                                value={formData.headline_3_es}
                                onChange={handleChange}
                                placeholder="Volumen II."
                            />
                        </div>
                    </div>
                </section>

                {/* Subtext Section */}
                <section className={styles.section}>
                    <h2>📄 Subtext</h2>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Subtext (English)</label>
                            <textarea
                                name="subtext"
                                value={formData.subtext}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Exploring the journeys, struggles, and triumphs..."
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Subtext (Spanish)</label>
                            <textarea
                                name="subtext_es"
                                value={formData.subtext_es}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Explorando los viajes, luchas y triunfos..."
                            />
                        </div>
                    </div>
                </section>

                {/* Buttons Section */}
                <section className={styles.section}>
                    <h2>🔘 Buttons</h2>

                    <div className={styles.buttonGroup}>
                        <h3>🔴 Primary Button (Order Now)</h3>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Button Text (English)</label>
                                <input
                                    name="button_primary_text"
                                    value={formData.button_primary_text}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Button Text (Spanish)</label>
                                <input
                                    name="button_primary_text_es"
                                    value={formData.button_primary_text_es}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Button Link</label>
                                <input
                                    name="button_primary_link"
                                    value={formData.button_primary_link}
                                    onChange={handleChange}
                                    placeholder="/books/slug"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <h3>🟢 Secondary Button (Read Excerpt)</h3>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Button Text (English)</label>
                                <input
                                    name="button_secondary_text"
                                    value={formData.button_secondary_text}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Button Text (Spanish)</label>
                                <input
                                    name="button_secondary_text_es"
                                    value={formData.button_secondary_text_es}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Button Link</label>
                                <input
                                    name="button_secondary_link"
                                    value={formData.button_secondary_link}
                                    onChange={handleChange}
                                    placeholder="/excerpt/slug"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Book Selection */}
                <section className={styles.section}>
                    <h2>📖 Linked Book</h2>
                    <p className={styles.hint}>Select a book — its cover image will be shown and the button link will auto-fill</p>

                    <div className={styles.field}>
                        <label>Select Book</label>
                        <select
                            name="book_id"
                            value={formData.book_id}
                            onChange={handleBookChange}
                        >
                            <option value="">-- No book linked --</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title} → /books/{book.slug}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedBook && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(212,175,55,0.08)', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {selectedBook.cover_image_url && (
                                <img
                                    src={selectedBook.cover_image_url}
                                    alt={selectedBook.title}
                                    style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            )}
                            <div>
                                <strong>{selectedBook.title}</strong><br />
                                <code style={{ fontSize: '0.85rem', color: '#888' }}>/books/{selectedBook.slug}</code><br />
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Button link auto-set to this URL</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Settings */}
                <section className={styles.section}>
                    <h2>⚙️ Settings</h2>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Display Order</label>
                            <input
                                type="number"
                                name="display_order"
                                value={formData.display_order}
                                onChange={handleChange}
                                min={0}
                            />
                        </div>
                        <div className={styles.checkboxField}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="show_spine"
                                    checked={formData.show_spine}
                                    onChange={handleChange}
                                />
                                Show 3D Spine Effect (for flat cover images — leave off for transparent renders)
                            </label>
                        </div>
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
                    </div>
                </section>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={styles.cancelBtn}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.saveBtn}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : (isNew ? 'Create Slide' : 'Save Changes')}
                    </button>
                </div>
            </form>
        </div>
    );
}
