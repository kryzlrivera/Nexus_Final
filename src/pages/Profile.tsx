import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../lib/DataContext';
import { Settings, PlusCircle, Grid, PlaySquare, UserSquare2 } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { currentUser, getUserByUsername, posts, addFriend, removeFriend } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'video'>('grid');

  if (!username) return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found</div>;

  const profileUser = getUserByUsername(username);
  
  if (!profileUser) {
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>User not found</h2>
      </div>
    );
  }

  const allUserPosts = posts.filter(p => p.authorUsername === username);
  const userPosts = activeTab === 'video' 
    ? allUserPosts.filter(p => !!p.videoUrl) 
    : allUserPosts;
    
  const isSelf = currentUser?.username === username;
  const isFriend = currentUser?.friends.includes(username);

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', backgroundColor: 'var(--surface)' }}>
      
      {/* Mobile Top Header (Username + Menu) */}
      <div className="show-on-mobile" style={{ alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, backgroundColor: 'var(--surface)', zIndex: 10 }}>
        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{profileUser.username}</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <PlusCircle size={24} />
          <Settings size={24} />
        </div>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* Profile Stats Header */}
        <div className="profile-header-content">
          <div style={{ flexShrink: 0 }}>
            <div className="story-circle profile-avatar" style={{ width: '80px', height: '80px' }}>
              <img 
                src={profileUser.avatar} 
                alt={profileUser.name} 
                className="story-circle-inner"
              />
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{userPosts.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>posts</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profileUser.friends.length * 123 + 42}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>followers</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profileUser.friends.length + 15}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>following</div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <div style={{ fontWeight: 600 }}>{profileUser.name}</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{profileUser.bio || "Welcome to my Nexus profile!"}</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {isSelf ? (
            <>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="btn" 
                style={{ flex: 1, backgroundColor: 'var(--border-color)', color: 'var(--text-main)', padding: '0.4rem', fontWeight: 600 }}
              >
                Edit profile
              </button>
              <button className="btn" style={{ flex: 1, backgroundColor: 'var(--border-color)', color: 'var(--text-main)', padding: '0.4rem', fontWeight: 600 }}>Share profile</button>
            </>
          ) : (
            <>
              {isFriend ? (
               <button onClick={() => removeFriend(username)} className="btn" style={{ flex: 1, backgroundColor: 'var(--border-color)', color: 'var(--text-main)', padding: '0.4rem', fontWeight: 600 }}>Following</button>
              ) : (
               <button onClick={() => addFriend(username)} className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontWeight: 600 }}>Follow</button>
              )}
              <Link to={`/messages/${username}`} className="btn" style={{ flex: 1, backgroundColor: 'var(--border-color)', color: 'var(--text-main)', padding: '0.4rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>Message</Link>
            </>
          )}
        </div>

        {/* Story Highlights Placeholder */}
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }} className="hide-scrollbar">
          {[1,2,3,4].map(i => (
             <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--border-color)', padding: '2px' }}>
                 <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--bg-color)' }}></div>
               </div>
               <span style={{ fontSize: '0.75rem' }}>Highlight {i}</span>
             </div>
          ))}
        </div>
      </div>

      {/* Grid View Tabs */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginBottom: '1px' }}>
        <div 
          onClick={() => setActiveTab('grid')}
          style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0.5rem', borderTop: activeTab === 'grid' ? '1px solid var(--text-main)' : 'none', color: activeTab === 'grid' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <Grid size={24} />
        </div>
        <div 
          onClick={() => setActiveTab('video')}
          style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0.5rem', borderTop: activeTab === 'video' ? '1px solid var(--text-main)' : 'none', color: activeTab === 'video' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <PlaySquare size={24} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0.5rem', color: 'var(--text-muted)' }}>
          <UserSquare2 size={24} />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="post-grid">
        {userPosts.map(post => (
          post.videoUrl ? (
            <video key={post.id} src={post.videoUrl} className="post-grid-item" style={{ backgroundColor: 'black' }} />
          ) : post.photoUrl ? (
            <img key={post.id} src={post.photoUrl} alt="Post" className="post-grid-item" />
          ) : (
            <div key={post.id} className="post-grid-item" style={{ backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                {post.content}
              </span>
            </div>
          )
        ))}
      </div>
      
      {userPosts.length === 0 && (
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No posts yet
        </div>
      )}

      {isSelf && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}

    </div>
  );
}
