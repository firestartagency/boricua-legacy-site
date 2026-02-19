'use client';

import Link from 'next/link';
import styles from './HeroSection.module.css';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { createClientComponentClient } from '@/lib/supabase';
import type { HeroSlide } from '@/types/database';

interface HeroSlideWithBook extends HeroSlide {
    books?: { title: string; slug: string; cover_image_url: string | null } | null;
}

const HeroSection = () => {
    const locale = useLocale();
    const isEs = locale === 'es';
    const supabase = createClientComponentClient();

    const [slides, setSlides] = useState<HeroSlideWithBook[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            const { data } = await supabase
                .from('hero_slides')
                .select('*, books(title, slug, cover_image_url)')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data && data.length > 0) {
                setSlides(data as unknown as HeroSlideWithBook[]);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setIsExiting(false);
            }, 3000);
        }, 10000);

        return () => clearInterval(interval);
    }, [slides.length]);

    if (slides.length === 0) return null;

    const slide = slides[currentSlide];

    // Use localized text or fall back to English
    const headline1 = (isEs && slide.headline_1_es) || slide.headline_1 || '';
    const headline2 = (isEs && slide.headline_2_es) || slide.headline_2 || '';
    const headline3 = (isEs && slide.headline_3_es) || slide.headline_3 || '';
    const subtext = (isEs && slide.subtext_es) || slide.subtext || '';

    // Admin-configurable button text with sensible defaults
    const primaryBtnText = (isEs && slide.button_primary_text_es) || slide.button_primary_text || 'Order Now';
    const primaryBtnLink = slide.button_primary_link || (slide.books?.slug ? `/books/${slide.books.slug}` : '#');
    const secondaryBtnText = (isEs && slide.button_secondary_text_es) || slide.button_secondary_text || '';
    const secondaryBtnLink = slide.button_secondary_link || '#';

    // Cover image: use book cover if linked, otherwise a default
    const coverImage = slide.books?.cover_image_url || "/design_assets/Boricua Legacy Homepage PNG Image/screen.png";

    return (
        <section className={styles.section}>
            <div className={styles.textureOverlay}></div>
            <div className={styles.container}>
                {/* Left Column: Text Content */}
                <div className={`${styles.textColumn} ${isExiting ? styles.exit : ''}`}>
                    <div className={styles.borderBox}>
                        <div className={`${styles.corner} ${styles.topLeft}`}></div>
                        <div className={`${styles.corner} ${styles.topRight}`}></div>
                        <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
                        <div className={`${styles.corner} ${styles.bottomRight}`}></div>

                        <h1 className={styles.headline}>
                            {headline1}<br />{headline2}<br />
                            <span className={styles.highlight}>{headline3}</span>
                        </h1>
                    </div>

                    <p className={styles.subtext}>
                        {subtext}
                    </p>

                    <div className={styles.buttonGroup}>
                        <Link href={primaryBtnLink} className={styles.primaryBtn}>
                            {primaryBtnText}
                        </Link>
                        {secondaryBtnText && (
                            secondaryBtnLink !== '#' ? (
                                <Link href={secondaryBtnLink} className={styles.secondaryBtn}>
                                    {secondaryBtnText}
                                </Link>
                            ) : (
                                <button className={styles.secondaryBtn}>{secondaryBtnText}</button>
                            )
                        )}
                    </div>
                </div>

                {/* Right Column: Book Cover Image */}
                <div className={`${styles.imageColumn} ${isExiting ? styles.exit : ''}`}>
                    {slide.show_spine ? (
                        /* 3D Book with CSS Spine */
                        <div className={styles.bookWrapper3d}>
                            <div className={styles.bookCover} style={{ backgroundImage: `url('${coverImage}')` }}>
                                <div className={styles.bookSpine}>
                                    <span className={styles.spineText}>
                                        {slide.books?.title || 'BORICUA LEGACY'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Clean Image (for transparent renders) */
                        <div className={styles.bookWrapper}>
                            <img
                                src={coverImage}
                                alt={slide.books?.title || 'Book Cover'}
                                className={styles.bookImage}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative center line */}
            <div className={styles.centerLine}></div>
        </section>
    );
};

export default HeroSection;
