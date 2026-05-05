import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react';
import { useData } from '../lib/DataContext';

export default function BottomNav() {
  const { currentUser } = useData();
  const location = useLocation();

  if (!currentUser) return null;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-icon ${location.pathname === '/' ? 'active' : ''}`}>
        <Home size={24} />
      </Link>
      <Link to="/search" className={`nav-icon ${location.pathname === '/search' ? 'active' : ''}`}>
        <Search size={24} />
      </Link>
      <button className="nav-icon">
        <PlusSquare size={24} />
      </button>
      <Link to="/messages" className={`nav-icon ${location.pathname.startsWith('/messages') ? 'active' : ''}`}>
        <MessageCircle size={24} />
      </Link>

      <Link to={`/profile/${currentUser.username}`} className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
      </Link>
    </nav>
  );
}
