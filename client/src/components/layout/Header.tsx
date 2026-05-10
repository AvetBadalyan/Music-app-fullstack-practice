import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import './Header.scss';

const Header = () => {
  return (
    <header className="app-header">
      <Link to="/" className="logo">
        <Music2 size={22} strokeWidth={2.25} />
        <span>Music App</span>
      </Link>
    </header>
  );
};

export default Header;
