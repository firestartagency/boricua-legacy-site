export interface Book {
    id: string;
    slug: string;
    title: string;
    author: string;
    price: number;
    description: string;
    coverImage: string;
}

export interface Book {
    id: string;
    slug: string;
    title: string;
    author: string;
    price: number;
    description: string;
    coverImage: string;
}

export interface CollectionResource {
    id: string;
    name: string;
    type: 'journal' | 'bookmark' | 'poster' | 'other';
    image?: string;
    description?: string;
}

export interface CollectionMerch {
    id: string;
    name: string;
    price: number;
    image: string;
    url: string;
}

export interface Collection {
    id: string;
    title: string;
    description: string;
    book: Book;
    resources: CollectionResource[];
    merch: CollectionMerch[];
    themeColor: string; // Hex code for background accents
}

export const collections: Collection[] = [
    {
        id: 'c1',
        title: 'The Legacy Collection',
        description: 'Immerse yourself in the stories that shaped a nation, accompanied by tools to document your own journey.',
        themeColor: '#d4af37', // Gold
        book: {
            id: '1',
            slug: 'boricua-legacy',
            title: 'Boricua Legacy: The Women Who Made History',
            author: 'Unknown', // Placeholder based on UI
            price: 29.99,
            description: 'From Taino cacicas to modern activists, explore the untold stories of resilience that shaped a nation.',
            coverImage: '/design_assets/Book Product Page/screen.png',
        },
        resources: [
            { id: 'r1', name: 'Legacy Journal', type: 'journal', description: 'A leather-bound journal for your thoughts.', image: '/design_assets/Book Product Page/screen.png' },
            { id: 'r2', name: 'Gold-Foil Bookmark', type: 'bookmark', description: 'Never lose your place in history.', image: '/design_assets/Book Product Page/screen.png' }
        ],
        merch: [
            { id: 'm1', name: 'Legacy Tote Bag', price: 15.00, image: '/design_assets/Book Product Page/screen.png', url: '#' }
        ]
    },
    {
        id: 'c2',
        title: 'The Diaspora Collection',
        description: 'Voices from across the sea, bringing the island spirit to every corner of the world.',
        themeColor: '#3b82f6', // Blue
        book: {
            id: '2',
            slug: 'echoes-of-san-juan',
            title: 'Echoes of San Juan',
            author: 'Marcus Rivera',
            price: 19.99,
            description: 'A historical mystery set in the cobblestone streets of Old San Juan.',
            coverImage: '/design_assets/Book Product Page/screen.png',
        },
        resources: [
            { id: 'r3', name: 'Map of Old San Juan', type: 'poster', description: 'Interactive map of the story locations.', image: '/design_assets/Book Product Page/screen.png' },
            { id: 'r4', name: 'Coquí Sticker Pack', type: 'other', description: 'Decorate your world.', image: '/design_assets/Book Product Page/screen.png' }
        ],
        merch: [
            { id: 'm2', name: 'Cobblestone Mug', price: 12.00, image: '/design_assets/Book Product Page/screen.png', url: '#' }
        ]
    },
    {
        id: 'c3',
        title: 'The Future Collection',
        description: 'Technological marvels and ancient traditions collide in this forward-looking set.',
        themeColor: '#10b981', // Emerald
        book: {
            id: '3',
            slug: 'digital-coqui',
            title: 'Digital Coquí',
            author: 'Sofia Ortiz',
            price: 29.99,
            description: 'Sci-fi thriller about an AI assuming the form of a cultural icon.',
            coverImage: '/design_assets/Book Product Page/screen.png',
        },
        resources: [
            { id: 'r5', name: 'Digital Access Key', type: 'other', description: 'Exclusive online content.', image: '/design_assets/Book Product Page/screen.png' },
            { id: 'r6', name: 'Neon Bookmark', type: 'bookmark', description: 'Glow in the dark reading companion.', image: '/design_assets/Book Product Page/screen.png' }
        ],
        merch: [
            { id: 'm3', name: 'Glitch T-Shirt', price: 25.00, image: '/design_assets/Book Product Page/screen.png', url: '#' }
        ]
    },
];

// Keep 'books' export for compatibility if needed elsewhere, mapped from collections
export const books: Book[] = collections.map(c => c.book);
