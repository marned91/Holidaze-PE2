import { useId } from 'react';
import HeroImage from '../assets/holidaze_home.png';

/**
 * Full-width hero with background image and two headline lines.
 *
 * @remarks
 * - Section is labeled via `aria-labelledby` referencing the first headline.
 * - Note: There are two `h1` elements; consider demoting the second to `h2` for improved semantics (not changed here).
 */
export function HeroSection() {
  const headingId = useId();

  return (
    <section
      className="relative w-full overflow-hidden h-[260px] sm:h-[360px] md:h-[420px]"
      aria-labelledby={headingId}
    >
      <img
        src={HeroImage}
        alt="Landscape image of a beautiful Norwegian beach with turquoise water and mountains"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-center gap-6 px-6 pl-5 md:pl-20">
        <h1
          id={headingId}
          className="font-large bg-black/60 text-white text-xl md:text-3xl font-medium px-8 py-3 rounded-sm shadow"
        >
          Experience Norway
        </h1>
        <h1 className="font-large bg-black/60 text-white text-xl md:text-3xl font-medium px-8 py-3 rounded-sm shadow">
          Discover Unique Venues
        </h1>
      </div>
    </section>
  );
}
