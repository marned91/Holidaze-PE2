import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { TVenue } from '../../types/venues';
import PlaceholderImage from '../../assets/placeholder.png';

type VenueMediaItem = NonNullable<TVenue['media']>[number];

type ImageCarouselProps = {
  images: VenueMediaItem[];
  className?: string;
};

export function ImageCarousel({ images = [], className }: ImageCarouselProps) {
  const normalizedImages = Array.isArray(images) ? images : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [normalizedImages.length]);

  const hasMultipleImages = normalizedImages.length > 1;

  function showPreviousImage() {
    setCurrentIndex(
      (previousIndex) =>
        (previousIndex - 1 + normalizedImages.length) % normalizedImages.length
    );
  }

  function showNextImage() {
    setCurrentIndex(
      (previousIndex) => (previousIndex + 1) % normalizedImages.length
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMultipleImages) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPreviousImage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNextImage();
    }
  }

  if (normalizedImages.length === 0) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg ${className ?? ''}`}
        aria-label="No images available"
      >
        <div className="aspect-[21/9] w-full">
          <img
            src={PlaceholderImage}
            alt="Placeholder image. No images available"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="rounded-lg bg-black/60 px-3 py-1 text-lg text-white font-text">
            No Images Available
          </span>
        </div>
      </div>
    );
  }

  const currentImage = normalizedImages[currentIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className ?? ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Venue images"
    >
      <div className="aspect-[21/9] w-full bg-gray-100">
        <img
          src={currentImage.url}
          alt={currentImage.alt ?? 'Venue image'}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={showPreviousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center
             w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-md
             ring-1 ring-black/5 hover:bg-white hover:shadow-lg
             focus:outline-none focus:ring-2 focus:ring-highlight transition"
            aria-label="Previous image"
            title="Previous image"
          >
            <FaChevronLeft className="text-gray-800" />
          </button>

          <button
            type="button"
            onClick={showNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center
             w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-md
             ring-1 ring-black/5 hover:bg-white hover:shadow-lg
             focus:outline-none focus:ring-2 focus:ring-highlight transition"
            aria-label="Next image"
            title="Next image"
          >
            <FaChevronRight className="text-gray-800" />
          </button>

          <div
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white"
            aria-live="polite"
          >
            {currentIndex + 1} / {normalizedImages.length}
          </div>
        </>
      )}
    </div>
  );
}
