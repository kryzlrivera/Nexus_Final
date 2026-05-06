import { useEffect, useState } from 'react';
import { useData } from '../../lib/DataContext';
import { Trash2, Image as ImageIcon, Video } from 'lucide-react';

export default function AdminPosts() {
  const { adminDeletePost } = useData();
  const [postsList, setPostsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We fetch directly to avoid pulling the massive content into global state
  // if not needed, but we can reuse the global apiRequest helper
  const loadPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem('nexus_token');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPostsList(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to permanently delete this post?`)) {
      await adminDeletePost(id);
      loadPosts(); // Refresh
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-main)' }}>Content Moderation</h1>
      
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Author</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Content Snippet</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Media</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {postsList.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>@{post.authorUsername}</td>
                <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.content || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No text</span>}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                  {post.videoUrl ? <Video size={20} /> : post.photoUrl ? <ImageIcon size={20} /> : '-'}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="btn btn-ghost" 
                    style={{ color: 'var(--error)', padding: '0.5rem' }}
                    title="Delete Post"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {postsList.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No posts found.</div>
        )}
      </div>
    </div>
  );
}
