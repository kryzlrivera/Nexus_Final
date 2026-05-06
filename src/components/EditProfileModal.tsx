import React, { useState, useRef } from 'react';
import { useData } from '../lib/DataContext';
import { X, Image as ImageIcon } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { currentUser, updateProfile } = useData();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, bio, avatar: avatarUrl });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Profile</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Avatar Edit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={avatarUrl} 
              alt="Avatar Preview" 
              style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-ghost" 
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              Change Profile Photo
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="input" 
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Write a little bit about yourself..."
              className="input" 
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}
