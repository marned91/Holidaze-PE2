import Logo from '../assets/holidaze-logo-transparent.png';

export function Footer() {
  return (
    <footer className="bg-dark text-white text-sm py-6">
      <div>
        <img src={Logo} alt="holidaZe" className="h-7 w-auto" />
      </div>
      <div>
        &copy; {new Date().getFullYear()} HolidaZe. All rights reserved.
      </div>
      <div></div>
    </footer>
  );
}
