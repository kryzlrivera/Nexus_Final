import React, { useState, useMemo, useRef } from 'react';
import { Image as ImageIcon, Send, Heart, MessageCircle } from 'lucide-react';
import { useData } from '../lib/DataContext';
import PostCard from '../components/PostCard';
import StoryUploadModal from '../components/StoryUploadModal';
import StoryViewerModal from '../components/StoryViewerModal';

export default function Home() {
  const { posts, stories, currentUser, users, createPost } = useData();
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [viewerStories, setViewerStories] = useState<typeof stories>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setShowPhotoInput(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !photoUrl.trim()) return;
    createPost(content, photoUrl || undefined);
    setContent('');
    setPhotoUrl('');
    setShowPhotoInput(false);
  };

  const groupedStories = useMemo(() => {
    const map = new Map<string, typeof stories>();
    stories.forEach(s => {
      if (!map.has(s.authorUsername)) map.set(s.authorUsername, []);
      map.get(s.authorUsername)!.push(s);
    });
    return Array.from(map.entries()).map(([authorUsername, userStories]) => ({
      authorUsername,
      userStories: userStories.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    }));
  }, [stories]);

  const currentUserStories = groupedStories.find(g => g.authorUsername === currentUser?.username)?.userStories || [];

  return (
    <div className="home-layout">
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div className="show-on-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, backgroundColor: 'var(--surface)', zIndex: 10 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'cursive', letterSpacing: '-0.025em' }}>Nexus</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Heart size={24} />
            <MessageCircle size={24} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }} className="hide-scrollbar">
          {currentUser && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', position: 'relative' }}>
              <div
                className="story-circle"
                style={{ width: '64px', height: '64px', borderColor: currentUserStories.length > 0 ? '' : 'var(--border-color)', cursor: 'pointer' }}
                onClick={() => {
                  if (currentUserStories.length > 0) {
                    setViewerStories(currentUserStories);
                    setIsViewerModalOpen(true);
                  } else {
                    setIsUploadModalOpen(true);
                  }
                }}
              >
                <img src={currentUser.avatar} alt="Your story" className="story-circle-inner" />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUploadModalOpen(true);
                }}
                style={{ position: 'absolute', bottom: '20px', right: '0', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)', cursor: 'pointer', zIndex: 2 }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: '1' }}>+</span>
              </div>
              <span style={{ fontSize: '0.75rem' }}>Your story</span>
            </div>
          )}

          {groupedStories.filter(group => group.authorUsername !== currentUser?.username).map(group => {
            const user = users.find(u => u.username === group.authorUsername);
            if (!user) return null;
            return (
              <div
                key={group.authorUsername}
                className="story-button"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                onClick={() => {
                  setViewerStories(group.userStories);
                  setIsViewerModalOpen(true);
                }}
              >
                <div className="story-circle" style={{ width: '64px', height: '64px' }}>
                  <img src={user.avatar} alt={user.name} className="story-circle-inner" />
                </div>
                <span style={{ fontSize: '0.75rem', maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</span>
              </div>
            );
          })}
        </div>

        {currentUser && (
          <div className="card hide-on-mobile" style={{ padding: '1rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
              />
              <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What's on your mind?`}
                  rows={2}
                  style={{ resize: 'none', marginBottom: '0.5rem', backgroundColor: 'var(--bg-color)', border: 'none', fontSize: '0.9rem', width: '100%' }}
                />

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />

                {showPhotoInput && photoUrl && (
                  <div style={{ position: 'relative', marginBottom: '1rem', display: 'inline-block' }}>
                    <img src={photoUrl} alt="Preview" style={{ maxHeight: '200px', borderRadius: 'var(--radius-md)' }} className="animate-fade-in" />
                    <button
                      type="button"
                      onClick={() => { setPhotoUrl(''); setShowPhotoInput(false); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ×
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-ghost"
                    style={{ color: showPhotoInput ? 'var(--primary)' : 'var(--text-muted)', padding: '0.25rem 0.5rem' }}
                  >
                    <ImageIcon size={20} />
                    <span style={{ fontSize: '0.85rem' }}>Photo</span>
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!content.trim() && !photoUrl.trim()}
                    style={{ opacity: (!content.trim() && !photoUrl.trim()) ? 0.5 : 1, padding: '0.25rem 1rem' }}
                  >
                    <Send size={16} />
                    <span style={{ fontSize: '0.85rem' }}>Post</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No posts yet. Be the first to post something!
            </div>
          )}
        </div>
      </div>

      <StoryUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <StoryViewerModal stories={viewerStories} isOpen={isViewerModalOpen} onClose={() => setIsViewerModalOpen(false)} />
    </div>
  );
}
