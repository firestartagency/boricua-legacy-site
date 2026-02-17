'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { HeroSlide, Book } from '@/types/database';
import styles from './page.module.css';

interface HeroSlideWithBook extends HeroSlide {
    books?: Book;
}

export default function HeroSlidesPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [slides, setSlides] = useState<HeroSlideWithBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*, books(*)')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching slides:', error);
        } else {
            setSlides((data as unknown as HeroSlideWithBook[]) || []);
        }
        setIsLoading(false);
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        const { error } = await supabase
            .from('hero_slides')
            .update({ is_active: !currentState } as never)
            .eq('id', id);

        if (!error) {
            fetchSlides();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;

        const { error } = await supabase
            .from('hero_slides')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchSlides();
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading hero slides...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Hero Slides</h1>
                    <p>Manage the homepage carousel slides</p>
                </div>
                <button
                    onClick={() => router.push('/admin/hero/new')}
                    className={styles.addBtn}
                >
                    + Add New Slide
                </button>
            </header>

            {slides.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No hero slides yet. Create your first slide!</p>
                    <button
                        onClick={() => router.push('/admin/hero/new')}
                        className={styles.addBtn}
                    >
                        + Create Hero Slide
                    </button>
                </div>
            ) : (
                <div className={styles.slidesList}>
                    {slides.map((slide, index) => (
                        <div key={slide.id} className={styles.slideCard}>
                            <div className={styles.slideOrder}>
                                #{index + 1}
                            </div>
                            <div className={styles.slideContent}>
                                <div className={styles.slideHeader}>
                                    <h3>{slide.headline_1} {slide.headline_2} <em>{slide.headline_3}</em></h3>
                                    <span className={`${styles.status} ${slide.is_active ? styles.active : styles.inactive}`}>
                                        {slide.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className={styles.subtext}>{slide.subtext}</p>
                                <div className={styles.buttons}>
                                    <span className={styles.buttonPreview}>
                                        🔴 {slide.button_primary_text || 'Order Now'}
                                    </span>
                                    <span className={styles.buttonPreview}>
                                        🟢 {slide.button_secondary_text || 'Read an Excerpt'}
                                    </span>
                                </div>
                                {slide.books && (
                                    <p className={styles.bookLink}>
                                        📖 Linked to: <strong>{slide.books.title}</strong>
                                    </p>
                                )}
                            </div>
                            <div className={styles.slideActions}>
                                <button
                                    onClick={() => handleToggleActive(slide.id, slide.is_active)}
                                    className={styles.toggleBtn}
                                >
                                    {slide.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/hero/${slide.id}`)}
                                    className={styles.editBtn}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(slide.id)}
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
