import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  return (
    <header className="app-header">
      <Link to="/" className="logo">🎵 Music App</Link>
    </header>
  );
};

export default Header;
