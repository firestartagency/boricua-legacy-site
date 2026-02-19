'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './ExcerptViewer.module.css';

interface ExcerptViewerProps {
    pdfUrl: string;
    bookTitle: string;
    onClose: () => void;
}

const ExcerptViewer = ({ pdfUrl, bookTitle, onClose }: ExcerptViewerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pdfDoc, setPdfDoc] = useState<ReturnType<typeof Object> | null>(null);

    // Load PDF document
    useEffect(() => {
        const loadPdf = async () => {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

            try {
                const doc = await pdfjsLib.getDocument(pdfUrl).promise;
                setPdfDoc(doc);
                setTotalPages(doc.numPages);
                setIsLoading(false);
            } catch {
                setIsLoading(false);
            }
        };

        loadPdf();
    }, [pdfUrl]);

    // Render current page
    const renderPage = useCallback(async () => {
        if (!pdfDoc || !canvasRef.current) return;

        const page = await (pdfDoc as {
            getPage: (n: number) => Promise<{
                getViewport: (opts: { scale: number }) => { width: number; height: number };
                render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> };
            }>
        }).getPage(currentPage);

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Scale to fit the modal nicely
        const containerWidth = canvas.parentElement?.clientWidth || 600;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
            (containerWidth - 40) / baseViewport.width,
            (window.innerHeight * 0.65) / baseViewport.height
        );
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
    }, [pdfDoc, currentPage]);

    useEffect(() => {
        renderPage();
    }, [renderPage]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && currentPage < totalPages) setCurrentPage(p => p + 1);
            if (e.key === 'ArrowLeft' && currentPage > 1) setCurrentPage(p => p - 1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentPage, totalPages, onClose]);

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
                    {isLoading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.spinner}></div>
                            <p>Preparing excerpt...</p>
                        </div>
                    ) : (
                        <div className={styles.pageFrame}>
                            <canvas ref={canvasRef} className={styles.pageCanvas} />
                        </div>
                    )}
                </div>

                {/* Bottom navigation */}
                {totalPages > 0 && (
                    <div className={styles.bottomBar}>
                        <button
                            className={styles.navBtn}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        <div className={styles.pageInfo}>
                            <span className={styles.pageNumber}>{currentPage}</span>
                            <span className={styles.pageDivider}>of</span>
                            <span className={styles.pageNumber}>{totalPages}</span>
                        </div>

                        <button
                            className={styles.navBtn}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
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
