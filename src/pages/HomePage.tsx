import { HeroSection } from '../components/HeroSection';
import { VenuesList } from '../components/VenuesHome/VenuesList';
import { useAuthStatus } from '../hooks/useAuthStatus';

export function HomePage() {
  const { isLoggedIn } = useAuthStatus();

  return (
    <div>
      {!isLoggedIn && <HeroSection />}
      <VenuesList />
    </div>
  );
}
