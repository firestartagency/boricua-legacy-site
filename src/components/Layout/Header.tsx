"use client";

import { useState, useEffect, useTransition, useCallback } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const t = useTranslations('HomePage.header.links');
    const tWaitlist = useTranslations('HomePage.header');

    const handleLocaleChange = (newLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    };

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Close menu on resize past breakpoint
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const sections = ['collection', 'author', 'mission', 'press'];
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => {
            sections.forEach((id) => {
                const element = document.getElementById(id);
                if (element) observer.unobserve(element);
            });
        };
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logoWrapper}>
                    <Link href="/" className={styles.logoLink}>
                        <Image
                            src="/Jacky-Logo.png"
                            alt="Boricua Legacy Logo"
                            width={28}
                            height={28}
                            className={styles.logoImage}
                        />
                        <h1 className={styles.logoText}>Boricua Legacy</h1>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className={styles.nav}>
                    <a href="#collection" className={`${styles.navLink} ${activeSection === 'collection' ? styles.activeLink : ''}`}>{t('collection')}</a>
                    <a href="#author" className={`${styles.navLink} ${activeSection === 'author' ? styles.activeLink : ''}`}>{t('author')}</a>
                    <a href="#mission" className={`${styles.navLink} ${activeSection === 'mission' ? styles.activeLink : ''}`}>{t('mission')}</a>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                    <Link href="/press" className={styles.navLink}>Press</Link>
                </nav>

                {/* Desktop Actions */}
                <div className={styles.actions}>
                    <div className={styles.langToggle}>
                        <button
                            onClick={() => handleLocaleChange('en')}
                            className={`${styles.langBtn} ${locale === 'en' ? styles.activeLang : ''}`}
                            disabled={isPending}
                        >
                            EN
                        </button>
                        <span className={styles.langDivider}>|</span>
                        <button
                            onClick={() => handleLocaleChange('es')}
                            className={`${styles.langBtn} ${locale === 'es' ? styles.activeLang : ''}`}
                            disabled={isPending}
                        >
                            ES
                        </button>
                    </div>
                    <button className={styles.waitlistBtn}>
                        {tWaitlist('waitlist')}
                    </button>
                </div>

                {/* Hamburger / Close Toggle (mobile only) */}
                <button
                    className={`${styles.mobileMenuBtn} ${isMenuOpen ? styles.menuOpen : ''}`}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                >
                    <span className={styles.hamburgerLine} />
                    <span className={styles.hamburgerLine} />
                    <span className={styles.hamburgerLine} />
                </button>
            </div>

            {/* Mobile Overlay */}
            <div
                className={`${styles.mobileOverlay} ${isMenuOpen ? styles.overlayVisible : ''}`}
                onClick={closeMenu}
                aria-hidden={!isMenuOpen}
            />

            {/* Mobile Navigation Panel */}
            <nav
                className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}
                aria-hidden={!isMenuOpen}
            >
                <a href="#collection" className={`${styles.mobileNavLink} ${activeSection === 'collection' ? styles.activeMobileLink : ''}`} onClick={closeMenu}>{t('collection')}</a>
                <a href="#author" className={`${styles.mobileNavLink} ${activeSection === 'author' ? styles.activeMobileLink : ''}`} onClick={closeMenu}>{t('author')}</a>
                <a href="#mission" className={`${styles.mobileNavLink} ${activeSection === 'mission' ? styles.activeMobileLink : ''}`} onClick={closeMenu}>{t('mission')}</a>
                <Link href="/blog" className={styles.mobileNavLink} onClick={closeMenu}>Blog</Link>
                <Link href="/press" className={styles.mobileNavLink} onClick={closeMenu}>Press</Link>

                <div className={styles.mobileDivider} />

                {/* Language Toggle in Mobile */}
                <div className={styles.mobileLangToggle}>
                    <button
                        onClick={() => { handleLocaleChange('en'); closeMenu(); }}
                        className={`${styles.mobileLangBtn} ${locale === 'en' ? styles.activeLang : ''}`}
                        disabled={isPending}
                    >
                        English
                    </button>
                    <button
                        onClick={() => { handleLocaleChange('es'); closeMenu(); }}
                        className={`${styles.mobileLangBtn} ${locale === 'es' ? styles.activeLang : ''}`}
                        disabled={isPending}
                    >
                        Español
                    </button>
                </div>

                <button className={styles.mobileWaitlistBtn} onClick={closeMenu}>
                    {tWaitlist('waitlist')}
                </button>
            </nav>
        </header>
    );
};

export default Header;
