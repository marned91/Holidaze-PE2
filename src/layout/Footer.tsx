import Logo from '../assets/holidaze-logo-transparent.png';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-dark text-white text-sm py-6 flex items-center justify-between px-5">
      <div>
        <img src={Logo} alt="holidaZe" className="h-7 w-auto" />
      </div>
      <div>
        &copy; {new Date().getFullYear()} HolidaZe. All rights reserved.
      </div>
      <div className="flex gap-3">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="bg-white text-dark rounded-full p-2 cursor-pointer group-hover:scale-110 transition-transform">
            <FaFacebookF size={26} />
          </div>
        </a>
        <div className="bg-white text-dark rounded-full p-2 cursor-pointer group-hover:scale-110 transition-transform">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={26} />
          </a>
        </div>
      </div>
    </footer>
  );
}
