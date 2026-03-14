import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  friends: string[]; // array of usernames
  savedPosts: string[]; // array of post IDs
}

export interface Comment {
  id: string;
  authorUsername: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorUsername: string;
  content: string;
  photoUrl?: string;
  timestamp: string;
  likes: string[]; // array of usernames who liked it
  comments: Comment[];
}

export interface Story {
  id: string;
  authorUsername: string;
  type: 'text' | 'photo';
  content?: string;
  photoUrl?: string;
  timestamp: string;
}

interface DataContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  stories: Story[];
  login: (username: string) => boolean;
  register: (username: string, name: string) => boolean;
  logout: () => void;
  createPost: (content: string, photoUrl?: string) => void;
  toggleLike: (postId: string) => void;
  addFriend: (username: string) => void;
  removeFriend: (username: string) => void;
  getUserByUsername: (username: string) => User | undefined;
  updateProfile: (name: string, bio: string, avatar: string) => void;
  createStory: (type: 'text' | 'photo', content?: string, photoUrl?: string) => void;
  addComment: (postId: string, content: string) => void;
  toggleSavePost: (postId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexus_users');
    return saved ? JSON.parse(saved) : [
      // default mock users
      { id: '1', username: 'demo', name: 'Demo User', avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=2563eb&color=fff', bio: 'Hello, Im using Nexus!', friends: ['john_doe'], savedPosts: [] },
      { id: '2', username: 'john_doe', name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random', bio: 'Just another day.', friends: ['demo'], savedPosts: [] }
    ];
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('nexus_posts');
    return saved ? JSON.parse(saved) : [
      // default mock posts
      { id: 'p1', authorUsername: 'john_doe', content: 'Loving the new Nexus social media app!', timestamp: new Date(Date.now() - 3600000).toISOString(), likes: [], comments: [{ id: 'c1', authorUsername: 'demo', content: 'Same here!', timestamp: new Date(Date.now() - 1800000).toISOString() }] },
      { id: 'p2', authorUsername: 'demo', content: 'Beautiful sunset today.', photoUrl: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', timestamp: new Date(Date.now() - 7200000).toISOString(), likes: ['john_doe'], comments: [] }
    ];
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('nexus_stories');
    return saved ? JSON.parse(saved) : [
      { id: 's1', authorUsername: 'john_doe', type: 'text', content: 'What a great day!', timestamp: new Date(Date.now() - 1800000).toISOString() }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nexus_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nexus_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('nexus_stories', JSON.stringify(stories));
  }, [stories]);

  const login = (username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (username: string, name: string) => {
    if (users.find(u => u.username === username)) return false;
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
      bio: '',
      friends: [],
      savedPosts: []
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createPost = (content: string, photoUrl?: string) => {
    if (!currentUser) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      authorUsername: currentUser.username,
      content,
      photoUrl,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: []
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = (postId: string) => {
    if (!currentUser) return;
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(currentUser.username);
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(u => u !== currentUser.username)
            : [...post.likes, currentUser.username]
        };
      }
      return post;
    }));
  };

  const addFriend = (username: string) => {
    if (!currentUser || currentUser.username === username) return;
    
    setUsers(prev => prev.map(user => {
      if (user.username === currentUser.username && !user.friends.includes(username)) {
        return { ...user, friends: [...user.friends, username] };
      }
      if (user.username === username && !user.friends.includes(currentUser.username)) {
        return { ...user, friends: [...user.friends, currentUser.username] };
      }
      return user;
    }));

    // Update current user state as well
    setCurrentUser(prev => prev ? { ...prev, friends: [...prev.friends, username] } : null);
  };

  const removeFriend = (username: string) => {
    if (!currentUser) return;
    
    setUsers(prev => prev.map(user => {
      if (user.username === currentUser.username) {
        return { ...user, friends: user.friends.filter(f => f !== username) };
      }
      if (user.username === username) {
        return { ...user, friends: user.friends.filter(f => f !== currentUser.username) };
      }
      return user;
    }));

    // Update current user state as well
    setCurrentUser(prev => prev ? { ...prev, friends: prev.friends.filter(f => f !== username) } : null);
  };

  const getUserByUsername = (username: string) => {
    return users.find(u => u.username === username);
  };

  const updateProfile = (name: string, bio: string, avatar: string) => {
    if (!currentUser) return;
    
    // Update users array
    setUsers(prev => prev.map(u => {
      if (u.username === currentUser.username) {
        return { ...u, name, bio, avatar };
      }
      return u;
    }));
    
    // Update currentUser state
    setCurrentUser(prev => prev ? { ...prev, name, bio, avatar } : null);
  };

  const createStory = (type: 'text' | 'photo', content?: string, photoUrl?: string) => {
    if (!currentUser) return;
    const newStory: Story = {
      id: Date.now().toString(),
      authorUsername: currentUser.username,
      type,
      content,
      photoUrl,
      timestamp: new Date().toISOString()
    };
    setStories(prev => [newStory, ...prev]);
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      authorUsername: currentUser.username,
      content,
      timestamp: new Date().toISOString()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    }));
  };

  const toggleSavePost = (postId: string) => {
    if (!currentUser) return;
    
    // Update users array
    setUsers(prev => prev.map(u => {
      if (u.username === currentUser.username) {
        const hasSaved = u.savedPosts?.includes(postId);
        return { 
          ...u, 
          savedPosts: hasSaved 
            ? (u.savedPosts || []).filter(id => id !== postId)
            : [...(u.savedPosts || []), postId]
        };
      }
      return u;
    }));
    
    // Update currentUser state
    setCurrentUser(prev => {
      if (!prev) return null;
      const hasSaved = prev.savedPosts?.includes(postId);
      return {
        ...prev,
        savedPosts: hasSaved 
            ? (prev.savedPosts || []).filter(id => id !== postId)
            : [...(prev.savedPosts || []), postId]
      };
    });
  };

  return (
    <DataContext.Provider value={{
      currentUser, users, posts, stories,
      login, register, logout,
      createPost, toggleLike,
      addFriend, removeFriend,
      getUserByUsername, updateProfile, createStory,
      addComment, toggleSavePost
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
