import { createServerClient } from '@/lib/supabase';
import CollectionHero from '@/components/Collection/CollectionHero';
import CollectionItems from '@/components/Collection/CollectionItems';
import CollectionCTA from '@/components/Collection/CollectionCTA';
import styles from './page.module.css';

interface CollectionPageProps {
    params: Promise<{ locale: string; id: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { locale, id } = await params;
    const supabase = createServerClient();

    const { data: collection, error } = await supabase
        .from('collections')
        .select(`
            *,
            books(*),
            collection_items(*)
        `)
        .eq('id', id)
        .single();

    if (error || !collection) {
        return (
            <main className={styles.main}>
                <div className={styles.notFound}>
                    <h1>Collection Not Found</h1>
                    <p>The collection you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </main>
        );
    }

    const typedCollection = collection as any;

    return (
        <main className={styles.main}>
            <CollectionHero collection={typedCollection} locale={locale} />
            <CollectionItems collection={typedCollection} locale={locale} />
            <CollectionCTA collection={typedCollection} locale={locale} />
        </main>
    );
}
