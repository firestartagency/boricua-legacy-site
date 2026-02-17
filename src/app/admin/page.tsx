'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface DashboardStats {
    collections: number;
    books: number;
    heroSlides: number;
    activeHeroSlides: number;
}

export default function AdminDashboardPage() {
    const supabase = createClientComponentClient();
    const [stats, setStats] = useState<DashboardStats>({
        collections: 0,
        books: 0,
        heroSlides: 0,
        activeHeroSlides: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [collectionsRes, booksRes, heroSlidesRes, activeHeroRes] = await Promise.all([
                    supabase.from('collections').select('id', { count: 'exact', head: true }),
                    supabase.from('books').select('id', { count: 'exact', head: true }),
                    supabase.from('hero_slides').select('id', { count: 'exact', head: true }),
                    supabase.from('hero_slides').select('id', { count: 'exact', head: true }).eq('is_active', true)
                ]);

                setStats({
                    collections: collectionsRes.count || 0,
                    books: booksRes.count || 0,
                    heroSlides: heroSlidesRes.count || 0,
                    activeHeroSlides: activeHeroRes.count || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [supabase]);

    if (isLoading) {
        return <div className={styles.loading}>Loading dashboard...</div>;
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Dashboard</h1>
                <p>Welcome to the Boricua Legacy admin portal</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📚</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.collections}</span>
                        <span className={styles.statLabel}>Collections</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📖</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.books}</span>
                        <span className={styles.statLabel}>Books</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🎯</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.heroSlides}</span>
                        <span className={styles.statLabel}>Hero Slides</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>✅</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.activeHeroSlides}</span>
                        <span className={styles.statLabel}>Active Slides</span>
                    </div>
                </div>
            </div>

            <section className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                    <a href="/admin/hero" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🎯</span>
                        <span>Manage Hero Slides</span>
                    </a>
                    <a href="/admin/collections" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📚</span>
                        <span>Manage Collections</span>
                    </a>
                    <a href="/admin/books" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📖</span>
                        <span>Manage Books</span>
                    </a>
                    <a href="/" target="_blank" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🌐</span>
                        <span>View Live Site</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
