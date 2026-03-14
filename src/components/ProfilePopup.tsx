import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData, User } from '../lib/DataContext';
import { UserPlus, UserMinus } from 'lucide-react';

interface ProfilePopupProps {
  user: User;
  children: React.ReactNode;
}

export default function ProfilePopup({ user, children }: ProfilePopupProps) {
  const { posts, currentUser, addFriend, removeFriend } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userPosts = posts.filter(p => p.authorUsername === user.username);
  const isSelf = currentUser?.username === user.username;
  const isFriend = currentUser?.friends.includes(user.username);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), 400); // 400ms delay before showing
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300); // 300ms delay before hiding to allow moving mouse into popup
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Use a portal or simple absolute positioning based on container.
  // For simplicity in this demo, we'll use absolute positioning relative to a wrapper.
  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isOpen && (
        <div 
          className="card animate-fade-in"
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            width: '320px', 
            zIndex: 100,
            padding: '1rem',
            marginTop: '0.5rem',
            cursor: 'default',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Header Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link to={`/profile/${user.username}`}>
              <img 
                src={user.avatar} 
                alt={user.name} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
              />
            </Link>
            <div style={{ flex: 1 }}>
              <Link to={`/profile/${user.username}`} style={{ fontWeight: 700, display: 'block', color: 'var(--text-main)', fontSize: '1rem' }}>
                {user.username}
              </Link>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.name}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{userPosts.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>posts</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.friends.length * 123 + 42}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>followers</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.friends.length + 15}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>following</div>
            </div>
          </div>

          {/* Recent Photos Preview */}
          {userPosts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '1rem' }}>
              {userPosts.slice(0, 3).map((post, i) => (
                <div key={i} style={{ aspectRatio: '1/1', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
                    {post.photoUrl ? (
                      <img src={post.photoUrl} alt="recent post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', fontSize: '0.5rem', textAlign: 'center', color: 'var(--primary)' }}>
                        {post.content.slice(0, 20)}...
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {!isSelf && currentUser && (
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem', fontWeight: 600, display: 'flex', justifyContent: 'center' }}>
                  Message
                </button>
                {isFriend ? (
                  <button onClick={() => removeFriend(user.username)} className="btn" style={{ flex: 1, backgroundColor: 'var(--border-color)', color: 'var(--text-main)', padding: '0.4rem', fontWeight: 600, display: 'flex', justifyContent: 'center' }}>
                     <UserMinus size={16} style={{ marginRight: '0.25rem'}} /> Following
                  </button>
                ) : (
                  <button onClick={() => addFriend(user.username)} className="btn" style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem', fontWeight: 600, display: 'flex', justifyContent: 'center' }}>
                     <UserPlus size={16} style={{ marginRight: '0.25rem'}} /> Follow
                  </button>
                )}
             </div>
          )}

        </div>
      )}
    </div>
  );
}
