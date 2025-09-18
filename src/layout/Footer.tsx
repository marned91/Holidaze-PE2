import { Link } from 'react-router-dom';
import Logo from '../assets/holidaze-logo-transparent.png';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-6 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">
          <Link to="/" className="shrink-0" aria-label="Holidaze home">
            <img src={Logo} alt="holidaZe" className="h-8 w-auto md:h-7" />
          </Link>
          <p className="order-3 text-center text-xs opacity-90 md:order-none md:text-sm md:justify-self-center">
            &copy; {year} HolidaZe. All rights reserved.
          </p>
          <div className="order-2 flex items-center gap-3 md:order-none">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit us on Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <FaFacebookF className="text-[20px]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit us on Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <FaInstagram className="text-[20px]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
