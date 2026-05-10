import { NavLink } from 'react-router-dom';
import { Disc3, Home, Mic2, Music, PlusCircle, Tags } from 'lucide-react';
import './Sidebar.scss';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { to: '/',        label: 'Home',    Icon: Home,       end: true  },
  { to: '/songs',   label: 'Songs',   Icon: Music,      end: false },
  { to: '/artists', label: 'Artists', Icon: Mic2,       end: false },
  { to: '/albums',  label: 'Albums',  Icon: Disc3,      end: false },
  { to: '/genres',  label: 'Genres',  Icon: Tags,       end: false },
  { to: '/create',  label: 'Create',  Icon: PlusCircle, end: false },
];

const Sidebar = ({ open, onClose }: SidebarProps) => (
  <>
    <div
      className={`sidebar-backdrop ${open ? 'is-visible' : ''}`}
      onClick={onClose}
      aria-hidden="true"
    />
    <nav className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Primary">
      {NAV_ITEMS.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={onClose}>
          <Icon size={18} strokeWidth={2} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  </>
);

export default Sidebar;
