import { useEffect, useState } from 'react';
import { useData, User } from '../../lib/DataContext';
import { Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const { fetchAllUsersAdmin, adminDeleteUser, currentUser } = useData();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [fetchAllUsersAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchAllUsersAdmin();
    setUsersList(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, username: string) => {
    if (window.confirm(`Are you sure you want to permanently delete user @${username} and all their content?`)) {
      await adminDeleteUser(id);
      loadUsers(); // Refresh
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-main)' }}>User Management</h1>
      
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>User</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={user.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontWeight: 600 }}>@{user.username}</span>
                </td>
                <td style={{ padding: '1rem' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    backgroundColor: user.isAdmin ? 'rgba(59, 130, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                    color: user.isAdmin ? '#3b82f6' : 'var(--text-muted)'
                  }}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {currentUser?.id !== user.id && (
                    <button 
                      onClick={() => handleDelete(user.id!, user.username)}
                      className="btn btn-ghost" 
                      style={{ color: 'var(--error)', padding: '0.5rem' }}
                      title="Delete User"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {usersList.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
        )}
      </div>
    </div>
  );
}
