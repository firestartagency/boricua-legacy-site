'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Collection } from '@/types/database';
import styles from './page.module.css';

export default function CollectionsPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        const { data, error } = await supabase
            .from('collections')
            .select('*')
            .order('display_order', { ascending: true });

        if (!error) {
            setCollections((data as unknown as Collection[]) || []);
        }
        setIsLoading(false);
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        const { error } = await supabase
            .from('collections')
            .update({ is_active: !currentState } as never)
            .eq('id', id);

        if (!error) fetchCollections();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this collection? This will also delete associated resources and merch.')) return;

        const { error } = await supabase.from('collections').delete().eq('id', id);
        if (!error) fetchCollections();
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading collections...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Collections</h1>
                    <p>Manage book collections and their contents</p>
                </div>
                <button
                    onClick={() => router.push('/admin/collections/new')}
                    className={styles.addBtn}
                >
                    + Add Collection
                </button>
            </header>

            {collections.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No collections yet. Create your first collection!</p>
                    <button
                        onClick={() => router.push('/admin/collections/new')}
                        className={styles.addBtn}
                    >
                        + Create Collection
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {collections.map((collection) => (
                        <div key={collection.id} className={styles.card}>
                            <div
                                className={styles.colorBar}
                                style={{ backgroundColor: collection.theme_color }}
                            />
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <h3>{collection.title}</h3>
                                    <span className={`${styles.status} ${collection.is_active ? styles.active : styles.inactive}`}>
                                        {collection.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className={styles.description}>
                                    {collection.description || 'No description'}
                                </p>
                                <div className={styles.meta}>
                                    <span>Order: {collection.display_order}</span>
                                </div>
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    onClick={() => handleToggleActive(collection.id, collection.is_active)}
                                    className={styles.toggleBtn}
                                >
                                    {collection.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/collections/${collection.id}`)}
                                    className={styles.editBtn}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(collection.id)}
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
