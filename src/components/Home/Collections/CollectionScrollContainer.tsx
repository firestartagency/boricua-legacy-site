'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CollectionScrollContainer.module.css';
import CollectionCard from './CollectionCard';
import { createClientComponentClient } from '@/lib/supabase';

interface CollectionWithRelations {
    id: string;
    title: string;
    title_es: string | null;
    description: string | null;
    description_es: string | null;
    theme_color: string;
    display_order: number;
    price: number | null;
    original_price: number | null;
    sale_price: number | null;
    is_on_sale: boolean;
    primary_btn_text: string;
    primary_btn_text_es: string | null;
    primary_btn_link: string | null;
    secondary_btn_text: string | null;
    secondary_btn_text_es: string | null;
    secondary_btn_link: string | null;
    is_active: boolean;
    books: Array<{
        id: string;
        title: string;
        title_es: string | null;
        cover_image_url: string | null;
        price: number | null;
    }>;
    collection_items: Array<{
        id: string;
        name: string;
        name_es: string | null;
        type: string;
        description: string | null;
        description_es: string | null;
        image_url: string | null;
        price: number | null;
        purchase_url: string | null;
        is_included: boolean;
        grid_size: string;
        display_order: number;
        is_active: boolean;
    }>;
}

const CollectionScrollContainer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [collections, setCollections] = useState<CollectionWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClientComponentClient();

    // Fetch collections from Supabase
    useEffect(() => {
        const fetchCollections = async () => {
            const { data, error } = await supabase
                .from('collections')
                .select(`
                    *,
                    books(*),
                    collection_items(*)
                `)
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (!error && data) {
                setCollections(data as unknown as CollectionWithRelations[]);
            }
            setIsLoading(false);
        };

        fetchCollections();
    }, [supabase]);

    // Handle scroll-based index change
    useEffect(() => {
        if (isLoading || collections.length === 0 || !containerRef.current) return;

        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / containerHeight));

            const length = collections.length;
            const step = 1 / length;
            const newIndex = Math.min(
                Math.max(Math.floor(progress / step), 0),
                length - 1
            );

            setActiveIndex(newIndex);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, collections.length]);

    if (isLoading) {
        return (
            <div className={styles.scrollSection}>
                <div className={styles.stickyWrapper}>
                    <div className={styles.loadingState}>Loading collections...</div>
                </div>
            </div>
        );
    }

    if (collections.length === 0) {
        return (
            <div className={styles.scrollSection}>
                <div className={styles.stickyWrapper}>
                    <div className={styles.emptyState}>No collections available yet.</div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={styles.scrollSection}>
            <div className={styles.stickyWrapper}>
                <div className={styles.cardContainer}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ y: 20, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0, scale: 0.98 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.32, 0.72, 0, 1]
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <CollectionCard collection={collections[activeIndex]} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Vertical Progress Dots */}
                <div className={styles.progressBar}>
                    {collections.map((_, idx) => (
                        <div
                            key={idx}
                            className={`${styles.progressDot} ${idx === activeIndex ? styles.progressDotActive : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionScrollContainer;
