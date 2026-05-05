import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, User, PlusCircle, MessageCircle } from 'lucide-react';
import { useData } from '../lib/DataContext';

function Navbar() {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="hide-on-mobile" style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4rem'
      }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'cursive', letterSpacing: '-0.025em' }}>
          Nexus
        </Link>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" className="btn btn-ghost" title="Home">
              <Home size={24} />
            </Link>

            <Link to="/messages" className="btn btn-ghost" title="Messages">
              <MessageCircle size={24} />
            </Link>

            <Link to={`/profile/${currentUser.username}`} className="btn btn-ghost" title="Profile">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={currentUser.avatar} alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
              </div>
            </Link>

            <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 0.5rem' }}></div>

            <button onClick={handleLogout} className="btn btn-ghost" title="Logout" style={{ color: 'var(--error)' }}>
              <LogOut size={24} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
