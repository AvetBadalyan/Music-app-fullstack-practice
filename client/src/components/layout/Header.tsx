import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, Menu, Music2, ShieldCheck, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../app/hooks';
import HeaderSearch from './HeaderSearch';
import './Header.scss';

interface HeaderProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
}

const Header = ({ menuOpen, onMenuToggle }: HeaderProps) => {
  const { email, isAdmin } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      const { supabase } = await import('../../services/supabaseClient');
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Signed out');
    } catch (error) {
      console.error('Failed to sign out:', error);
      toast.error('Unable to sign out. Please try again.');
    }
  };

  return (
    <header className={`app-header${isScrolled ? ' is-scrolled' : ''}`}>
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
        <span>MusicAvet</span>
      </Link>

      {/* Inline search — expands on focus, shows dropdown results */}
      <HeaderSearch />

      <div className="auth-actions">
        {email ? (
          <>
            <span
              className={isAdmin ? 'admin-badge' : 'user-badge'}
              title={email}
            >
              <ShieldCheck size={15} strokeWidth={2.25} aria-hidden="true" />
              <span>{isAdmin ? 'Admin' : 'Signed in'}</span>
            </span>
            <button
              type="button"
              className="auth-button"
              onClick={handleSignOut}
            >
              <LogOut size={15} strokeWidth={2.25} aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="auth-button">
            <LogIn size={15} strokeWidth={2.25} aria-hidden="true" />
            <span>Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
