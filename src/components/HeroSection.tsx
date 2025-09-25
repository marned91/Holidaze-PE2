import { useId } from 'react';
import HeroImage from '../assets/holidaze_home.png';

/**
 * Full-width hero section with a background image and two headline lines.
 *
 * Behavior:
 * - Labels the section via `aria-labelledby` (first headline).
 * - Renders a responsive background image with overlayed headlines.
 *
 * Accessibility note:
 * - The component uses two <h1> elements. Consider changing the second to <h2>
 *   for better document outline semantics (kept as-is here).
 *
 * @returns A responsive hero banner with image and headings.
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
          className="font-large bg-black/60 text-white text-xl md:text-3xl font-medium px-5 md:px-10 py-3 rounded-sm shadow ml-1 2xl:ml-30"
        >
          Experience Norway
        </h1>
        <h1 className="font-large bg-black/60 text-white text-xl md:text-3xl font-medium px-5 md:px-10 py-3 rounded-sm shadow ml-2 2xl:ml-35">
          Discover Unique Venues
        </h1>
      </div>
    </section>
  );
}
