'use client';

import { useEffect, useState } from 'react';
import styles from './ExcerptViewer.module.css';

interface ExcerptViewerProps {
    pages: { file_url: string; label: string }[];
    bookTitle: string;
    onClose: () => void;
}

const ExcerptViewer = ({ pages, bookTitle, onClose }: ExcerptViewerProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && currentPage < pages.length - 1) setCurrentPage(p => p + 1);
            if (e.key === 'ArrowLeft' && currentPage > 0) setCurrentPage(p => p - 1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentPage, pages.length, onClose]);

    if (pages.length === 0) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {/* Top ornamental bar */}
                <div className={styles.topBar}>
                    <div className={styles.ornamentLeft}></div>
                    <div className={styles.headerContent}>
                        <span className={styles.headerLabel}>Excerpt</span>
                        <h3 className={styles.headerTitle}>{bookTitle}</h3>
                    </div>
                    <div className={styles.ornamentRight}></div>
                    <button className={styles.closeBtn} onClick={onClose} title="Close">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Page display */}
                <div className={styles.pageContainer}>
                    <div className={styles.pageFrame}>
                        <img
                            src={pages[currentPage].file_url}
                            alt={pages[currentPage].label}
                            className={styles.pageImage}
                        />
                    </div>
                </div>

                {/* Bottom navigation */}
                {pages.length > 1 && (
                    <div className={styles.bottomBar}>
                        <button
                            className={styles.navBtn}
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage <= 0}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        <div className={styles.pageInfo}>
                            <span className={styles.pageNumber}>{currentPage + 1}</span>
                            <span className={styles.pageDivider}>of</span>
                            <span className={styles.pageNumber}>{pages.length}</span>
                        </div>

                        <button
                            className={styles.navBtn}
                            onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                            disabled={currentPage >= pages.length - 1}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}

                {/* Bottom ornamental border */}
                <div className={styles.bottomBorder}></div>
            </div>
        </div>
    );
};

export default ExcerptViewer;
