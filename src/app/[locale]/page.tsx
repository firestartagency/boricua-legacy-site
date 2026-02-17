import HeroSection from '@/components/Home/HeroSection';
import CollectionSection from '@/components/Home/CollectionSection';
import AudienceSection from '@/components/Home/AudienceSection';
import MissionSection from '@/components/Home/MissionSection';
import AuthorSection from '@/components/Home/AuthorSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CollectionSection />
      <AudienceSection />
      <MissionSection />
      <AuthorSection />
    </main>
  );
}
