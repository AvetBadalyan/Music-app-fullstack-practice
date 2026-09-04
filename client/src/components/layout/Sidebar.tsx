import { NavLink } from 'react-router-dom';
import { Disc3, Home, Mic2, Music, Tags } from 'lucide-react';
import './Sidebar.scss';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  // `end` only for Home: without it "/" would match every route.
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/songs', label: 'Songs', Icon: Music },
  { to: '/artists', label: 'Artists', Icon: Mic2 },
  { to: '/albums', label: 'Albums', Icon: Disc3 },
  { to: '/genres', label: 'Genres', Icon: Tags },
];

const Sidebar = ({ open, onClose }: SidebarProps) => (
  <>
    {/* Mobile only: catches a tap outside the open drawer. */}
    <div
      className={`sidebar-backdrop${open ? ' is-visible' : ''}`}
      onClick={onClose}
      aria-hidden="true"
    />
    <nav className={`sidebar${open ? ' is-open' : ''}`} aria-label="Primary">
      {NAV_ITEMS.map(({ to, label, Icon, end }) => (
        // onClose closes the mobile drawer on navigation; on desktop the
        // drawer is never open, so it is a no-op.
        <NavLink key={to} to={to} end={end} onClick={onClose}>
          <Icon size={18} strokeWidth={2} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  </>
);

export default Sidebar;
