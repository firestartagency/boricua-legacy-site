'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import styles from './layout.module.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ email?: string } | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            } else if (session) {
                setUser(session.user);
            }
            setIsLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/admin/login');
            } else if (session) {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router, pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    // Show login page without admin layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h1>Boricua Admin</h1>
                </div>
                <nav className={styles.nav}>
                    <Link
                        href="/admin"
                        className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        href="/admin/hero"
                        className={`${styles.navLink} ${pathname.startsWith('/admin/hero') ? styles.active : ''}`}
                    >
                        🎯 Hero Slides
                    </Link>
                    <Link
                        href="/admin/collections"
                        className={`${styles.navLink} ${pathname.startsWith('/admin/collections') ? styles.active : ''}`}
                    >
                        📚 Collections
                    </Link>
                    <Link
                        href="/admin/books"
                        className={`${styles.navLink} ${pathname.startsWith('/admin/books') ? styles.active : ''}`}
                    >
                        📖 Books
                    </Link>
                    <Link
                        href="/admin/blog"
                        className={`${styles.navLink} ${pathname.startsWith('/admin/blog') ? styles.active : ''}`}
                    >
                        📝 Blog
                    </Link>
                </nav>
                <div className={styles.userSection}>
                    <span className={styles.userEmail}>{user?.email}</span>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
