'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Collection, CollectionImage } from '@/types/database';
import styles from './form.module.css';

export default function CollectionFormPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const collectionId = isNew ? null : params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<CollectionImage[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        title_es: '',
        description: '',
        description_es: '',
        theme_color: '#d4af37',
        display_order: 0,
        price: 0,
        is_active: true
    });

    useEffect(() => {
        if (!isNew && collectionId) {
            fetchCollection();
            fetchImages();
        }
    }, [isNew, collectionId]);

    const fetchCollection = async () => {
        if (!collectionId) return;
        const { data, error } = await supabase
            .from('collections')
            .select('*')
            .eq('id', collectionId)
            .single();

        if (error) {
            setError('Collection not found');
        } else if (data) {
            const col = data as unknown as Collection;
            setFormData({
                title: col.title || '',
                title_es: col.title_es || '',
                description: col.description || '',
                description_es: col.description_es || '',
                theme_color: col.theme_color || '#d4af37',
                display_order: col.display_order || 0,
                price: col.price || 0,
                is_active: col.is_active
            });
        }
        setIsLoading(false);
    };

    const fetchImages = async () => {
        if (!collectionId) return;
        const { data } = await supabase
            .from('collection_images')
            .select('*')
            .eq('collection_id', collectionId)
            .order('display_order', { ascending: true });

        if (data) {
            setImages(data as unknown as CollectionImage[]);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !collectionId) {
            if (!collectionId) {
                setError('Please save the collection first before adding images.');
            }
            return;
        }

        setIsUploading(true);
        setError(null);

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${collectionId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resources')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            setError('Failed to upload image: ' + uploadError.message);
            setIsUploading(false);
            return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('resources')
            .getPublicUrl(uploadData.path);

        // Save to collection_images table
        const { error: insertError } = await supabase
            .from('collection_images')
            .insert([{
                collection_id: collectionId,
                image_url: urlData.publicUrl,
                alt_text: file.name,
                display_order: images.length
            }] as never[]);

        if (insertError) {
            setError('Failed to save image: ' + insertError.message);
        } else {
            fetchImages();
        }

        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteImage = async (imageId: string, imageUrl: string) => {
        if (!confirm('Delete this image?')) return;

        // Delete from storage
        const path = imageUrl.split('/resources/')[1];
        if (path) {
            await supabase.storage.from('resources').remove([path]);
        }

        // Delete from database
        const { error } = await supabase
            .from('collection_images')
            .delete()
            .eq('id', imageId);

        if (!error) {
            fetchImages();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        let result;
        if (isNew) {
            result = await supabase.from('collections').insert([formData] as never[]).select();
        } else if (collectionId) {
            result = await supabase.from('collections').update(formData as never).eq('id', collectionId);
        } else {
            setError('Invalid collection ID');
            setIsSaving(false);
            return;
        }

        if (result.error) {
            setError(result.error.message);
            setIsSaving(false);
        } else {
            // If new collection was created, redirect to edit page to add images
            const createdData = result.data as Array<{ id: string }> | null;
            if (isNew && createdData && createdData[0]) {
                router.push(`/admin/collections/${createdData[0].id}`);
            } else {
                router.push('/admin/collections');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? (name === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0) : value
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
                <h1>{isNew ? 'Create Collection' : 'Edit Collection'}</h1>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <section className={styles.section}>
                    <h2>📚 Collection Details</h2>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Collection Name (English) *</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="The Legacy Collection"
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Collection Name (Spanish)</label>
                            <input
                                name="title_es"
                                value={formData.title_es}
                                onChange={handleChange}
                                placeholder="La Colección Legado"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Description (English)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Immerse yourself in the stories that shaped a nation..."
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Description (Spanish)</label>
                            <textarea
                                name="description_es"
                                value={formData.description_es}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Sumérgete en las historias que dieron forma a una nación..."
                            />
                        </div>
                    </div>
                </section>

                {/* Collection Images Section */}
                <section className={styles.section}>
                    <h2>🖼️ Collection Images</h2>
                    {isNew ? (
                        <p className={styles.helperText}>
                            Save the collection first to add images.
                        </p>
                    ) : (
                        <>
                            <div className={styles.imageGrid}>
                                {images.map((img) => (
                                    <div key={img.id} className={styles.imageCard}>
                                        <img src={img.image_url} alt={img.alt_text || 'Collection image'} />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(img.id, img.image_url)}
                                            className={styles.deleteImageBtn}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                                {isUploading ? 'Uploading...' : '+ Add Image'}
                            </button>
                        </>
                    )}
                </section>

                <section className={styles.section}>
                    <h2>🎨 Appearance & Pricing</h2>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Theme Color</label>
                            <div className={styles.colorPicker}>
                                <input
                                    type="color"
                                    name="theme_color"
                                    value={formData.theme_color}
                                    onChange={handleChange}
                                />
                                <span>{formData.theme_color}</span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>Collection Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                placeholder="49.99"
                            />
                        </div>
                    </div>
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

                <div className={styles.actions}>
                    <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                        {isSaving ? 'Saving...' : (isNew ? 'Create Collection' : 'Save Changes')}
                    </button>
                </div>
            </form>
        </div>
    );
}
