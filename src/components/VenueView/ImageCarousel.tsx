import { useEffect, useState, type KeyboardEvent } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { TVenue } from '../../types/venues';
import PlaceholderImage from '../../assets/placeholder.png';

type VenueMediaItem = NonNullable<TVenue['media']>[number];

type ImageCarouselProps = {
  images: VenueMediaItem[];
};

export function ImageCarousel({ images = [] }: ImageCarouselProps) {
  const slides = Array.isArray(images) ? images.filter((i) => !!i?.url) : [];
  const count = slides.length;
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [count]);

  const hasMany = count > 1;
  const next = () => hasMany && setIndex((i) => (i + 1) % count);
  const prev = () => hasMany && setIndex((i) => (i - 1 + count) % count);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!hasMany) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  }

  if (count === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div className="aspect-[21/9] w-full">
          <img
            src={PlaceholderImage}
            alt="No images available"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-xl"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Venue images"
    >
      <div className="relative aspect-[21/9] w-full bg-gray-100">
        {slides.map((img, i) => (
          <img
            key={`${img.url}-${i}`}
            src={img.url}
            alt={img.alt ?? 'Venue image'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out
                        ${i === index ? 'opacity-100' : 'opacity-0'}`}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full
                       bg-white/80 backdrop-blur-sm shadow-md ring-1 ring-black/5 transition
                       hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2
                       opacity-0 group-hover:opacity-100 sm:opacity-100"
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-gray-800" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full
                       bg-white/80 backdrop-blur-sm shadow-md ring-1 ring-black/5 transition
                       hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2
                       opacity-0 group-hover:opacity-100 sm:opacity-100"
            aria-label="Next image"
          >
            <FaChevronRight className="text-gray-800" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/35 px-2 py-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? 'w-6 bg-white'
                    : 'w-2.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
