import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../lib/DataContext';
import { LayoutDashboard, Users, FileText, ArrowLeft, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { currentUser, logout } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/posts', icon: <FileText size={20} />, label: 'Posts' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Admin Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            N
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>Nexus Admin</span>
        </div>

        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)', textDecoration: 'none',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--text-main)' }}>
            <ArrowLeft size={20} />
            <span>Back to App</span>
          </Link>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--error)' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
