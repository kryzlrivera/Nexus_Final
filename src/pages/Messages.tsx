import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData, Message } from '../lib/DataContext';
import { Send, ArrowLeft } from 'lucide-react';

export default function Messages() {
  const { username } = useParams<{ username?: string }>();
  const { currentUser, users, getMessages, sendMessage } = useData();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeFriend = username ? users.find(u => u.username === username) : null;
  const friends = users.filter(u => currentUser?.friends.includes(u.username));

  useEffect(() => {
    if (activeFriend) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeFriend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (activeFriend) {
      const msgs = await getMessages(activeFriend.username);
      setMessages(msgs);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeFriend) return;
    
    await sendMessage(activeFriend.username, newMessage);
    setNewMessage('');
    loadMessages();
  };

  if (!currentUser) return null;

  return (
    <div className="messages-layout">
      {/* Sidebar - Friends List */}
      <div className={`hide-on-mobile ${username ? 'hidden-mobile' : ''}`} style={{ maxWidth: '350px', width: '100%', borderRight: '1px solid var(--border-color)', overflowY: 'auto' }}>
        <div style={{ padding: '1rem', fontWeight: 700, fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, backgroundColor: 'var(--surface)' }}>
          Messages
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {friends.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Follow someone to start messaging!
            </div>
          ) : (
            friends.map(friend => (
              <Link 
                key={friend.id} 
                to={`/messages/${friend.username}`}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', 
                  textDecoration: 'none', color: 'inherit',
                  backgroundColor: activeFriend?.username === friend.username ? 'var(--bg-color)' : 'transparent',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <img src={friend.avatar} alt={friend.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{friend.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@{friend.username}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`chat-area ${!username ? 'hide-on-mobile' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', height: '100%' }}>
        {activeFriend ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
              <Link to="/messages" className="show-on-mobile" style={{ color: 'inherit' }}>
                <ArrowLeft size={24} />
              </Link>
              <Link to={`/profile/${activeFriend.username}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
                <img src={activeFriend.avatar} alt={activeFriend.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{activeFriend.name}</div>
              </Link>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {messages.map(msg => {
                const isMine = msg.senderUsername === currentUser.username;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{ 
                      maxWidth: '70%', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '1rem',
                      borderBottomRightRadius: isMine ? '0.25rem' : '1rem',
                      borderBottomLeftRadius: !isMine ? '0.25rem' : '1rem',
                      backgroundColor: isMine ? 'var(--primary)' : 'var(--surface)',
                      color: isMine ? 'white' : 'var(--text-main)',
                      border: isMine ? 'none' : '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-color)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Message..."
                  className="input"
                  style={{ flex: 1, borderRadius: '2rem' }}
                />
                <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hide-on-mobile" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <Send size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Your Messages</h2>
              <p>Send private photos and messages to a friend.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
