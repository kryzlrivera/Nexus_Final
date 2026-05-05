import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Type, Send } from 'lucide-react';
import { useData } from '../lib/DataContext';

interface StoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryUploadModal({ isOpen, onClose }: StoryUploadModalProps) {
  const { currentUser, createStory } = useData();
  const [type, setType] = useState<'text' | 'photo'>('text');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setType('photo');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'text' && !content.trim()) return;
    if (type === 'photo' && !photoUrl) return;

    createStory(type, content, photoUrl);
    setContent('');
    setPhotoUrl('');
    setType('text');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create Story</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setType('text')}
            className={`btn ${type === 'text' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
          >
            <Type size={18} /> Text
          </button>
          <button
            type="button"
            onClick={() => { setType('photo'); fileInputRef.current?.click(); }}
            className={`btn ${type === 'photo' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
          >
            <ImageIcon size={18} /> Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {type === 'text' && (
            <div style={{ aspectRatio: '9/16', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type something..."
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', textAlign: 'center', resize: 'none', width: '100%', height: '50%' }}
                autoFocus
              />
            </div>
          )}

          {type === 'photo' && (
            <div style={{ aspectRatio: '9/16', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              {photoUrl ? (
                <>
                  <img src={photoUrl} alt="Story preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a caption..."
                    style={{ position: 'absolute', bottom: '20%', left: '10%', right: '10%', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', fontSize: '1rem', textAlign: 'center', resize: 'none', width: '80%', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
                  />
                </>
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                  <ImageIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>Select a photo</p>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            disabled={(type === 'text' && !content.trim()) || (type === 'photo' && !photoUrl)}
          >
            <Send size={18} /> Share to Story
          </button>
        </form>
      </div>
    </div>
  );
}
