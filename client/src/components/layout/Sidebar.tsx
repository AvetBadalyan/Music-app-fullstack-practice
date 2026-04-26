import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/songs">Songs</NavLink>
      <NavLink to="/artists">Artists</NavLink>
      <NavLink to="/albums">Albums</NavLink>
      <NavLink to="/genres">Genres</NavLink>
      <NavLink to="/create">Create</NavLink>
    </nav>
  );
};

export default Sidebar;
