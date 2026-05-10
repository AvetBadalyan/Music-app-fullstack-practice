import { Link } from 'react-router-dom';
import { Menu, Music2, X } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
}

const Header = ({ menuOpen, onMenuToggle }: HeaderProps) => {
  return (
    <header className="app-header">
      <button
        type="button"
        className="menu-btn"
        onClick={onMenuToggle}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <Link to="/" className="logo">
        <Music2 size={22} strokeWidth={2.25} />
        <span>Music App</span>
      </Link>
    </header>
  );
};

export default Header;
