import {
  useEffect,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { TVenue } from '../../types/venueTypes';
import PlaceholderImage from '../../assets/placeholder.png';

type VenueMediaItem = NonNullable<TVenue['media']>[number];

type ImageCarouselProps = {
  images: VenueMediaItem[];
};

/**
 * Image carousel for a venue, supporting keyboard navigation (Left/Right) and dot indicators.
 */
export function ImageCarousel({ images = [] }: ImageCarouselProps) {
  const slides = Array.isArray(images)
    ? images.filter((item) => Boolean(item?.url))
    : [];

  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const hasMultiple = slideCount > 1;

  useEffect(() => setActiveIndex(0), [slideCount]);

  function goToNext() {
    if (!hasMultiple) return;
    setActiveIndex((c) => (c + 1) % slideCount);
  }

  function goToPrevious() {
    if (!hasMultiple) return;
    setActiveIndex((c) => (c - 1 + slideCount) % slideCount);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMultiple) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    }
  }

  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    if (!hasMultiple) return;
    setTouchStartX(e.touches[0]?.clientX ?? null);
  }
  function onTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (!hasMultiple || touchStartX == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    const THRESHOLD = 40;
    if (dx <= -THRESHOLD) goToNext();
    else if (dx >= THRESHOLD) goToPrevious();
    setTouchStartX(null);
  }

  if (slideCount === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div className="aspect-[21/9] w-full">
          <img
            src={PlaceholderImage}
            alt="No images available (placeholder)"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-xl"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Venue images"
    >
      <div className="relative aspect-[21/9] w-full bg-gray-100">
        {slides.map((imageItem, indexNumber) => (
          <img
            key={`${imageItem.url}-${indexNumber}`}
            src={imageItem.url as string}
            alt={imageItem.alt ?? 'Venue image'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              indexNumber === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 md:h-11 md:w-11 place-items-center rounded-full
             bg-white/85 backdrop-blur-sm shadow-md ring-1 ring-black/5 transition
             hover:bg-white 
             opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Previous image"
          >
            <FaChevronLeft
              className="text-gray-800"
              size={16}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 md:h-11 md:w-11 place-items-center rounded-full
             bg-white/85 backdrop-blur-sm shadow-md ring-1 ring-black/5 transition
             hover:bg-white 
             opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Next image"
          >
            <FaChevronRight
              className="text-gray-800"
              size={16}
              aria-hidden="true"
            />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/35 px-2 py-1">
            {slides.map((_, indexNumber) => (
              <button
                key={indexNumber}
                type="button"
                onClick={() => setActiveIndex(indexNumber)}
                aria-label={`Go to image ${indexNumber + 1}`}
                className={`h-2 rounded-full transition-all ${
                  indexNumber === activeIndex
                    ? 'w-7 bg-white'
                    : 'w-3.5 bg-white/70 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
