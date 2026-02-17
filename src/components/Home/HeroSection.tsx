'use client';

import Link from 'next/link';
import styles from './HeroSection.module.css';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const HeroSection = () => {
    const t = useTranslations('HomePage.hero');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const heroSlides = [
        {
            id: 1,
            headline: <>{t('slides.1.headline_1')}<br />{t('slides.1.headline_2')}<br /><span className={styles.highlight}>{t('slides.1.headline_3')}</span></>,
            subtext: t('slides.1.subtext'),
            coverImage: "/design_assets/Boricua Legacy Homepage PNG Image/screen.png",
            spineText: t('slides.1.spine'),
            spineColor: "var(--accent-gold)"
        },
        {
            id: 2,
            headline: <>{t('slides.2.headline_1')}<br />{t('slides.2.headline_2')}<br /><span className={styles.highlight}>{t('slides.2.headline_3')}</span></>,
            subtext: t('slides.2.subtext'),
            coverImage: "/design_assets/Book Product Page/screen.png",
            spineText: t('slides.2.spine'),
            spineColor: "#E94E77" // Example distinct color
        },
        {
            id: 3,
            headline: <>{t('slides.3.headline_1')}<br />{t('slides.3.headline_2')}<br /><span className={styles.highlight}>{t('slides.3.headline_3')}</span></>,
            subtext: t('slides.3.subtext'),
            coverImage: "/design_assets/Book Product Page/screen.png",
            spineText: t('slides.3.spine'),
            spineColor: "#4A90E2" // Example distinct color
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
                setIsExiting(false); // Reset to bring content back into view
            }, 3000); // 3s transition to match CSS
        }, 10000); // Change every 10 seconds

        return () => clearInterval(interval);
    }, [heroSlides.length]);

    const slide = heroSlides[currentSlide];

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
                            {slide.headline}
                        </h1>
                    </div>

                    <p className={styles.subtext}>
                        {slide.subtext}
                    </p>

                    <div className={styles.buttonGroup}>
                        <Link href="/books/boricua-legacy" className={styles.primaryBtn}>{t('buttons.primary')}</Link>
                        <button className={styles.secondaryBtn}>{t('buttons.secondary')}</button>
                    </div>
                </div>

                {/* Right Column: 3D Book Cover */}
                <div className={`${styles.imageColumn} ${isExiting ? styles.exit : ''}`}>
                    <div className={styles.bookWrapper}>
                        <div className={styles.bookCover} style={{ backgroundImage: `url('${slide.coverImage}')` }}>
                            {/* 
                  Using CSS to create the 3D book effect. 
                  Background image mimics the cover.
                */}
                            <div className={styles.bookSpine}>
                                <span className={styles.spineText} style={{ color: slide.spineColor || 'var(--accent-gold)' }}>
                                    {slide.spineText}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative center line */}
            <div className={styles.centerLine}></div>
        </section>
    );
};

export default HeroSection;
