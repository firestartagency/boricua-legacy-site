'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Collection, CollectionItem } from '@/types/database';
import styles from './form.module.css';

const ITEM_TYPES = [
    { value: 'book', label: '📚 Book' },
    { value: 'merch', label: '🛍️ Merch' },
    { value: 'resource', label: '📄 Resource' },
    { value: 'digital', label: '💾 Digital' },
    { value: 'other', label: '📦 Other' },
];

const GRID_SIZES = [
    { value: 'featured', label: 'Featured (large)' },
    { value: 'standard', label: 'Standard' },
    { value: 'hidden', label: 'Hidden' },
];

const emptyItem = {
    name: '',
    name_es: '',
    type: 'other' as const,
    description: '',
    description_es: '',
    image_url: '',
    price: 0,
    purchase_url: '',
    is_included: true,
    grid_size: 'standard' as const,
    display_order: 0,
    is_active: true,
};

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
    const [items, setItems] = useState<CollectionItem[]>([]);
    const [editingItem, setEditingItem] = useState<Partial<CollectionItem> | null>(null);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [uploadTarget, setUploadTarget] = useState<'item' | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        title_es: '',
        description: '',
        description_es: '',
        theme_color: '#d4af37',
        display_order: 0,
        price: 0,
        original_price: 0,
        sale_price: 0,
        is_on_sale: false,
        primary_btn_text: 'Purchase Collection',
        primary_btn_text_es: '',
        primary_btn_link: '',
        secondary_btn_text: '',
        secondary_btn_text_es: '',
        secondary_btn_link: '',
        is_active: true
    });

    useEffect(() => {
        if (!isNew && collectionId) {
            fetchCollection();
            fetchItems();
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
                original_price: col.original_price || 0,
                sale_price: col.sale_price || 0,
                is_on_sale: col.is_on_sale || false,
                primary_btn_text: col.primary_btn_text || 'Purchase Collection',
                primary_btn_text_es: col.primary_btn_text_es || '',
                primary_btn_link: col.primary_btn_link || '',
                secondary_btn_text: col.secondary_btn_text || '',
                secondary_btn_text_es: col.secondary_btn_text_es || '',
                secondary_btn_link: col.secondary_btn_link || '',
                is_active: col.is_active
            });
        }
        setIsLoading(false);
    };

    const fetchItems = async () => {
        if (!collectionId) return;
        const { data } = await supabase
            .from('collection_items')
            .select('*')
            .eq('collection_id', collectionId)
            .order('display_order', { ascending: true });

        if (data) {
            setItems(data as unknown as CollectionItem[]);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const fileExt = file.name.split('.').pop();
        const fileName = `${collectionId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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

        if (uploadTarget === 'item' && editingItem) {
            // Auto-populate item name from filename if name is empty
            const cleanName = file.name
                .replace(/\.[^.]+$/, '')        // remove extension
                .replace(/[-_]/g, ' ')           // replace dashes/underscores with spaces
                .replace(/\b\w/g, c => c.toUpperCase()); // title case
            setEditingItem(prev => ({
                ...prev,
                image_url: urlData.publicUrl,
                ...(prev?.name ? {} : { name: cleanName }),
            }));
        }

        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSaveItem = async () => {
        if (!editingItem || !collectionId) return;
        if (!editingItem.name?.trim()) {
            setError('Item name is required');
            return;
        }

        setIsSaving(true);
        setError(null);

        const itemData = {
            collection_id: collectionId,
            name: editingItem.name,
            name_es: editingItem.name_es || null,
            type: editingItem.type || 'other',
            description: editingItem.description || null,
            description_es: editingItem.description_es || null,
            image_url: editingItem.image_url || null,
            price: editingItem.price || null,
            purchase_url: editingItem.purchase_url || null,
            is_included: editingItem.is_included ?? true,
            grid_size: editingItem.grid_size || 'standard',
            display_order: editingItem.display_order || items.length,
            is_active: editingItem.is_active ?? true,
        };

        let result;
        if (editingItemId) {
            result = await supabase
                .from('collection_items')
                .update(itemData as never)
                .eq('id', editingItemId);
        } else {
            result = await supabase
                .from('collection_items')
                .insert([itemData] as never[]);
        }

        if (result.error) {
            setError(result.error.message);
        } else {
            setEditingItem(null);
            setEditingItemId(null);
            fetchItems();
        }
        setIsSaving(false);
    };

    const handleDeleteItem = async (id: string, imageUrl: string | null) => {
        if (!confirm('Delete this item?')) return;

        if (imageUrl) {
            const path = imageUrl.split('/resources/')[1];
            if (path) {
                await supabase.storage.from('resources').remove([path]);
            }
        }

        const { error } = await supabase
            .from('collection_items')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchItems();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const submitData = {
            ...formData,
            price: formData.price || null,
            original_price: formData.original_price || null,
            sale_price: formData.sale_price || null,
            primary_btn_text_es: formData.primary_btn_text_es || null,
            primary_btn_link: formData.primary_btn_link || null,
            secondary_btn_text: formData.secondary_btn_text || null,
            secondary_btn_text_es: formData.secondary_btn_text_es || null,
            secondary_btn_link: formData.secondary_btn_link || null,
        };

        let result;
        if (isNew) {
            result = await supabase.from('collections').insert([submitData] as never[]).select();
        } else if (collectionId) {
            result = await supabase.from('collections').update(submitData as never).eq('id', collectionId);
        } else {
            setError('Invalid collection ID');
            setIsSaving(false);
            return;
        }

        if (result.error) {
            setError(result.error.message);
            setIsSaving(false);
        } else {
            const createdData = result.data as Array<{ id: string }> | null;
            if (isNew && createdData && createdData[0]) {
                router.push(`/admin/collections/${createdData[0].id}`);
            } else {
                router.push('/admin/collections');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? (parseFloat(value) || 0) : value
        }));
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setEditingItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? (parseFloat(value) || 0) : value
        }));
    };

    const startEditItem = (item: CollectionItem) => {
        setEditingItemId(item.id);
        setEditingItem({ ...item });
    };

    const startAddItem = () => {
        setEditingItemId(null);
        setEditingItem({ ...emptyItem, display_order: items.length });
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

                {/* ── Collection Details ── */}
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

                {/* ── Pricing ── */}
                <section className={styles.section}>
                    <h2>💰 Pricing</h2>

                    <div className={styles.row}>
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
                        <div className={styles.field}>
                            <label>Original Price ($) <span className={styles.hint}>shown with strikethrough on sale</span></label>
                            <input
                                type="number"
                                name="original_price"
                                value={formData.original_price}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                placeholder="59.99"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Sale Price ($)</label>
                            <input
                                type="number"
                                name="sale_price"
                                value={formData.sale_price}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                placeholder="39.99"
                            />
                        </div>
                    </div>
                    <div className={styles.checkboxField}>
                        <label>
                            <input
                                type="checkbox"
                                name="is_on_sale"
                                checked={formData.is_on_sale}
                                onChange={handleChange}
                            />
                            🏷️ On Sale — shows strikethrough original price + sale price
                        </label>
                    </div>
                </section>

                {/* ── Buttons ── */}
                <section className={styles.section}>
                    <h2>🔘 Call-to-Action Buttons</h2>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Primary Button Text (EN)</label>
                            <input
                                name="primary_btn_text"
                                value={formData.primary_btn_text}
                                onChange={handleChange}
                                placeholder="View Collection"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Primary Button Text (ES)</label>
                            <input
                                name="primary_btn_text_es"
                                value={formData.primary_btn_text_es}
                                onChange={handleChange}
                                placeholder="Ver Colección"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Primary Button Link</label>
                            <input
                                name="primary_btn_link"
                                value={formData.primary_btn_link}
                                onChange={handleChange}
                                placeholder="/collections/legacy"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Secondary Button Text (EN)</label>
                            <input
                                name="secondary_btn_text"
                                value={formData.secondary_btn_text}
                                onChange={handleChange}
                                placeholder="Learn More"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Secondary Button Text (ES)</label>
                            <input
                                name="secondary_btn_text_es"
                                value={formData.secondary_btn_text_es}
                                onChange={handleChange}
                                placeholder="Saber Más"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Secondary Button Link</label>
                            <input
                                name="secondary_btn_link"
                                value={formData.secondary_btn_link}
                                onChange={handleChange}
                                placeholder="/books/boricua-legacy"
                            />
                        </div>
                    </div>
                </section>

                {/* ── Collection Items ── */}
                <section className={styles.section}>
                    <h2>📦 Collection Items</h2>
                    {isNew ? (
                        <p className={styles.helperText}>
                            Save the collection first to add items.
                        </p>
                    ) : (
                        <>
                            {/* Existing items list */}
                            <div className={styles.itemsList}>
                                {items.map((item) => (
                                    <div key={item.id} className={styles.itemCard}>
                                        {item.image_url && (
                                            <div
                                                className={styles.itemThumb}
                                                style={{ backgroundImage: `url('${item.image_url}')` }}
                                            />
                                        )}
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemTop}>
                                                <span className={styles.itemName}>{item.name}</span>
                                                <span className={`${styles.typeBadge} ${styles[`type_${item.type}`]}`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <div className={styles.itemMeta}>
                                                {item.price ? `$${item.price}` : 'No price'}
                                                {' · '}
                                                {item.is_included ? 'Included' : 'Add-on'}
                                                {' · '}
                                                Grid: {item.grid_size}
                                            </div>
                                        </div>
                                        <div className={styles.itemActions}>
                                            <button
                                                type="button"
                                                onClick={() => startEditItem(item)}
                                                className={styles.editBtn}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItem(item.id, item.image_url)}
                                                className={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add / Edit item form */}
                            {editingItem ? (
                                <div className={styles.itemForm}>
                                    <h3>{editingItemId ? 'Edit Item' : 'Add New Item'}</h3>
                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label>Item Name (EN) *</label>
                                            <input
                                                name="name"
                                                value={editingItem.name || ''}
                                                onChange={handleItemChange}
                                                placeholder="Legacy Sticker Pack"
                                                required
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Item Name (ES)</label>
                                            <input
                                                name="name_es"
                                                value={editingItem.name_es || ''}
                                                onChange={handleItemChange}
                                                placeholder="Pack de Stickers"
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Type</label>
                                            <select
                                                name="type"
                                                value={editingItem.type || 'other'}
                                                onChange={handleItemChange}
                                            >
                                                {ITEM_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label>Description (EN)</label>
                                            <textarea
                                                name="description"
                                                value={editingItem.description || ''}
                                                onChange={handleItemChange}
                                                rows={2}
                                                placeholder="A set of premium vinyl stickers..."
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Description (ES)</label>
                                            <textarea
                                                name="description_es"
                                                value={editingItem.description_es || ''}
                                                onChange={handleItemChange}
                                                rows={2}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label>Price ($)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={editingItem.price || 0}
                                                onChange={handleItemChange}
                                                min={0}
                                                step="0.01"
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Purchase URL</label>
                                            <input
                                                name="purchase_url"
                                                value={editingItem.purchase_url || ''}
                                                onChange={handleItemChange}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Grid Size</label>
                                            <select
                                                name="grid_size"
                                                value={editingItem.grid_size || 'standard'}
                                                onChange={handleItemChange}
                                            >
                                                {GRID_SIZES.map(g => (
                                                    <option key={g.value} value={g.value}>{g.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label>Display Order</label>
                                            <input
                                                type="number"
                                                name="display_order"
                                                value={editingItem.display_order || 0}
                                                onChange={handleItemChange}
                                                min={0}
                                            />
                                        </div>
                                        <div className={styles.checkboxField}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="is_included"
                                                    checked={editingItem.is_included ?? true}
                                                    onChange={handleItemChange}
                                                />
                                                Included in collection (bundled)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxField}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="is_active"
                                                    checked={editingItem.is_active ?? true}
                                                    onChange={handleItemChange}
                                                />
                                                Active
                                            </label>
                                        </div>
                                    </div>

                                    {/* Image upload for item */}
                                    <div className={styles.itemImageSection}>
                                        {editingItem.image_url && (
                                            <img
                                                src={editingItem.image_url}
                                                alt="Item preview"
                                                className={styles.itemPreviewImg}
                                            />
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
                                            onClick={() => {
                                                setUploadTarget('item');
                                                fileInputRef.current?.click();
                                            }}
                                            className={styles.uploadBtn}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? 'Uploading...' : (editingItem.image_url ? 'Change Image' : '+ Upload Image')}
                                        </button>
                                    </div>

                                    <div className={styles.itemFormActions}>
                                        <button
                                            type="button"
                                            onClick={handleSaveItem}
                                            className={styles.saveBtn}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Saving...' : 'Save Item'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setEditingItem(null); setEditingItemId(null); }}
                                            className={styles.cancelBtn}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={startAddItem}
                                    className={styles.uploadBtn}
                                >
                                    + Add Item
                                </button>
                            )}
                        </>
                    )}
                </section>

                {/* ── Appearance ── */}
                <section className={styles.section}>
                    <h2>🎨 Appearance</h2>
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
