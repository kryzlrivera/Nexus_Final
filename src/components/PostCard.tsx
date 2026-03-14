import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Post, useData } from '../lib/DataContext';
import ProfilePopup from './ProfilePopup';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { currentUser, getUserByUsername, toggleLike, addComment, toggleSavePost } = useData();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const author = getUserByUsername(post.authorUsername);
  
  const isLiked = currentUser ? post.likes.includes(currentUser.username) : false;
  const isSaved = currentUser ? (currentUser.savedPosts || []).includes(post.id) : false;
  
  if (!author) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`).catch(() => {});
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
      {/* Post Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
        <ProfilePopup user={author}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to={`/profile/${author.username}`}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), #60a5fa)', padding: '2px' }}>
                <img 
                  src={author.avatar} 
                  alt={author.name} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--surface)' }}
                />
              </div>
            </Link>
            <Link to={`/profile/${author.username}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {author.username}
            </Link>
          </div>
        </ProfilePopup>
        <button className="btn btn-ghost" style={{ padding: '0.25rem' }}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image (Full Width) */}
      {post.photoUrl ? (
        <img 
          src={post.photoUrl} 
          alt="Post content" 
          style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-light)', padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--primary)' }}>{post.content}</p>
        </div>
      )}

      {/* Action Bar */}
      <div style={{ padding: '0.75rem 1rem 0.25rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => toggleLike(post.id)}
            style={{ color: isLiked ? 'var(--error)' : 'var(--text-main)', padding: 0 }}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={isLiked ? 0 : 2} />
          </button>
          <button onClick={() => setShowComments(!showComments)} style={{ color: 'var(--text-main)', padding: 0 }}>
            <MessageCircle size={24} />
          </button>
          <button onClick={handleShare} style={{ color: 'var(--text-main)', padding: 0, position: 'relative' }}>
            <Send size={24} />
            {showToast && (
              <div className="animate-fade-in" style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--text-main)', color: 'var(--surface)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap', marginBottom: '0.5rem', pointerEvents: 'none' }}>
                Link copied!
              </div>
            )}
          </button>
        </div>
        <button onClick={() => toggleSavePost(post.id)} style={{ color: 'var(--text-main)', padding: 0 }}>
          <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={isSaved ? 0 : 2} />
        </button>
      </div>

      {/* Post Info & Caption */}
      <div style={{ padding: '0 1rem 1rem 1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          {post.likes.length} likes
        </div>
        
        {post.photoUrl && post.content && (
          <div style={{ fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>{author.username}</span>
            <span>{post.content}</span>
          </div>
        )}

        {(post.comments?.length > 0 || showComments) && (
          <div style={{ marginTop: '0.5rem' }}>
            {(!showComments && post.comments?.length > 0) ? (
               <button onClick={() => setShowComments(true)} className="btn btn-ghost" style={{ padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                 View all {post.comments.length} comments
               </button>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                 {post.comments?.map(comment => (
                   <div key={comment.id} style={{ fontSize: '0.85rem' }}>
                     <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>{comment.authorUsername}</span>
                     <span>{comment.content}</span>
                   </div>
                 ))}
               </div>
            )}
            
            {showComments && currentUser && (
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input 
                  type="text" 
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  style={{ flex: 1, border: 'none', borderBottom: '1px solid var(--border-color)', outline: 'none', background: 'transparent', fontSize: '0.85rem', padding: '0.25rem 0' }}
                />
                <button type="submit" disabled={!commentText.trim()} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', opacity: commentText.trim() ? 1 : 0.5, cursor: commentText.trim() ? 'pointer' : 'default' }}>
                  Post
                </button>
              </form>
            )}
          </div>
        )}
        
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase' }}>
          2 hours ago
        </div>
      </div>
    </div>
  );
}
