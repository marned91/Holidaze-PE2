import HeroImage from '../assets/holidaze_home.png';

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden h-[260px] sm:h-[360px] md:h-[420px]">
      <img
        src={HeroImage}
        alt="Landscape image of a beautiful Norwegian beach with turquoise water and mountains"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-center gap-6 px-6 pl-5 md:pl-20">
        <h1 className="font-large bg-black/60 text-white text-xl md:text-3xl font-medium px-8 py-3 rounded-sm shadow">
          Experience Norway
        </h1>
        <h1 className="font-large bg-black/60 text-white text-xl md:text-3xl font-medium px-8 py-3 rounded-sm shadow">
          Discover Unique Venues
        </h1>
      </div>
    </section>
  );
}
