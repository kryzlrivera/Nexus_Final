import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../lib/DataContext';

interface ProfilePopupProps {
  user: User;
  children: React.ReactNode;
}

export default function ProfilePopup({ user, children }: ProfilePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          width: '240px',
          padding: '1rem',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img src={user.avatar} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@{user.username}</div>
            </div>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.9rem' }}>{user.bio || 'No bio yet.'}</p>
          <Link to={`/profile/${user.username}`} className="btn btn-link" style={{ marginTop: '0.75rem', display: 'inline-flex', padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}>
            View profile
          </Link>
        </div>
      )}
    </div>
  );
}
