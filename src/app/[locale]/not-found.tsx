import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">Return Home</Link>
        </div>
    );
}
