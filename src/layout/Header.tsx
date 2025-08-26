import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/holidaze-logo-transparent.png';

export function Header() {
  return (
    <header>
      <div>
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-20 lg:h-25" />
        </Link>
        <nav>
          <ul>
            <li>
              <NavLink to="SIGN UP" />
            </li>
            <li>
              <NavLink to="LOG IN" />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
