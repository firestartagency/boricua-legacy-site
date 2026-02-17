'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Collection } from '@/types/database';
import styles from './page.module.css';

interface BookWithCollection extends Book {
    collections?: Collection;
}

export default function BooksPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [books, setBooks] = useState<BookWithCollection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const { data, error } = await supabase
            .from('books')
            .select('*, collections(*)')
            .order('title', { ascending: true });

        if (!error) {
            setBooks((data as unknown as BookWithCollection[]) || []);
        }
        setIsLoading(false);
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        const { error } = await supabase
            .from('books')
            .update({ is_active: !currentState } as never)
            .eq('id', id);

        if (!error) fetchBooks();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this book?')) return;

        const { error } = await supabase.from('books').delete().eq('id', id);
        if (!error) fetchBooks();
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading books...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Books</h1>
                    <p>Manage books and their cover images</p>
                </div>
                <button
                    onClick={() => router.push('/admin/books/new')}
                    className={styles.addBtn}
                >
                    + Add Book
                </button>
            </header>

            {books.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No books yet. Create your first book!</p>
                    <button
                        onClick={() => router.push('/admin/books/new')}
                        className={styles.addBtn}
                    >
                        + Create Book
                    </button>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Collection</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td>
                                        <div className={styles.coverThumb}>
                                            {book.cover_image_url ? (
                                                <img src={book.cover_image_url} alt={book.title} />
                                            ) : (
                                                <span>📖</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{book.title}</strong>
                                        <br />
                                        <span className={styles.slug}>/{book.slug}</span>
                                    </td>
                                    <td>{book.author || '—'}</td>
                                    <td>{book.collections?.title || '—'}</td>
                                    <td>${book.price?.toFixed(2) || '—'}</td>
                                    <td>
                                        <span className={`${styles.status} ${book.is_active ? styles.active : styles.inactive}`}>
                                            {book.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleToggleActive(book.id, book.is_active)}
                                                className={styles.toggleBtn}
                                            >
                                                {book.is_active ? 'Hide' : 'Show'}
                                            </button>
                                            <button
                                                onClick={() => router.push(`/admin/books/${book.id}`)}
                                                className={styles.editBtn}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.id)}
                                                className={styles.deleteBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
