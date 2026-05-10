import { NavLink } from 'react-router-dom';
import { Home, Music, Mic2, Disc3, Tags, PlusCircle } from 'lucide-react';
import './Sidebar.scss';

const NAV_ITEMS = [
  { to: '/',        label: 'Home',    Icon: Home,       end: true  },
  { to: '/songs',   label: 'Songs',   Icon: Music,      end: false },
  { to: '/artists', label: 'Artists', Icon: Mic2,       end: false },
  { to: '/albums',  label: 'Albums',  Icon: Disc3,      end: false },
  { to: '/genres',  label: 'Genres',  Icon: Tags,       end: false },
  { to: '/create',  label: 'Create',  Icon: PlusCircle, end: false },
];

const Sidebar = () => (
  <nav className="sidebar">
    {NAV_ITEMS.map(({ to, label, Icon, end }) => (
      <NavLink key={to} to={to} end={end}>
        <Icon size={18} strokeWidth={2} aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default Sidebar;
