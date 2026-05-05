import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData, Story } from '../lib/DataContext';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryViewerModal({ stories, initialIndex = 0, isOpen, onClose }: StoryViewerModalProps) {
  const { getUserByUsername } = useData();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onClose();
      }
    }, 5000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        clearTimeout(timer);
        if (currentIndex < stories.length - 1) setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        clearTimeout(timer);
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, stories.length, onClose]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const author = getUserByUsername(currentStory.authorUsername);

  if (!author) return null;

  const nextStory = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(prev => prev + 1);
    else onClose();
  };

  const prevStory = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', display: 'flex', gap: '0.25rem', zIndex: 2010 }}>
        {stories.map((s, idx) => (
          <div key={s.id} style={{ flex: 1, height: '3px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              backgroundColor: '#fff',
              width: idx < currentIndex ? '100%' : idx === currentIndex ? '100%' : '0%',
              transition: idx === currentIndex ? 'width 5s linear' : 'none',
              animation: idx === currentIndex ? 'progress 5s linear' : 'none'
            }} />
          </div>
        ))}
      </div>

      <style>{`@keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>

      <div style={{ position: 'absolute', top: '2rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2010 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
          <Link to={`/profile/${author.username}`} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
            <img src={author.avatar} alt={author.username} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{author.username}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{new Date(currentStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </Link>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem' }}>
          <X size={24} style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} />
        </button>
      </div>

      {currentIndex > 0 && (
        <button onClick={prevStory} className="hide-on-mobile" style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '0.5rem', zIndex: 2010 }}>
          <ChevronLeft size={32} />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button onClick={nextStory} className="hide-on-mobile" style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '0.5rem', zIndex: 2010 }}>
          <ChevronRight size={32} />
        </button>
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          height: '100dvh',
          maxHeight: '900px',
          backgroundColor: currentStory.type === 'text' ? 'var(--primary)' : '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x < rect.width / 3) prevStory();
          else nextStory();
        }}
      >
        {currentStory.type === 'text' ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'white', fontSize: '2rem', fontWeight: 600, wordBreak: 'break-word' }}>
            {currentStory.content}
          </div>
        ) : (
          <>
            {currentStory.photoUrl && <img src={currentStory.photoUrl} alt="Story" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
            {currentStory.content && (
              <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', backgroundColor: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'white', textAlign: 'center', fontSize: '1.2rem' }}>
                {currentStory.content}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
