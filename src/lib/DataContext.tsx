import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  friends: string[]; // array of usernames
  savedPosts: string[]; // array of post IDs
  isAdmin?: boolean;
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
  videoUrl?: string;
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

export interface Message {
  id: string;
  senderUsername: string;
  receiverUsername: string;
  content: string;
  timestamp: string;
}

interface DataContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  stories: Story[];
  login: (username: string) => Promise<boolean>;
  register: (username: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createPost: (content: string, photoUrl?: string, videoUrl?: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addFriend: (username: string) => Promise<void>;
  removeFriend: (username: string) => Promise<void>;
  getUserByUsername: (username: string) => User | undefined;
  updateProfile: (data: Partial<User>) => Promise<void>;
  createStory: (type: 'text' | 'photo', content?: string, photoUrl?: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  toggleSavePost: (postId: string) => Promise<void>;
  getMessages: (username: string) => Promise<Message[]>;
  sendMessage: (username: string, content: string) => Promise<void>;
  fetchAdminStats: () => Promise<any>;
  fetchAllUsersAdmin: () => Promise<User[]>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminDeletePost: (postId: string) => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

  async function apiRequest(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('nexus_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexus_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nexus_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [postsData, storiesData, usersData] = await Promise.all([
        apiRequest('/posts'),
        apiRequest('/stories'),
        apiRequest('/users'),
      ]);

      setPosts(postsData);
      setStories(storiesData);
      
      const mappedUsers = usersData.map((user: any) => ({ ...user, isAdmin: user.isAdmin || user.is_admin || false, friends: user.friends ?? [], savedPosts: user.savedPosts ?? [] }));
      setUsers(mappedUsers);

      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        const updatedSelf = mappedUsers.find((u: any) => u.username === prevUser.username);
        return updatedSelf ? { ...prevUser, ...updatedSelf } : prevUser;
      });

    } catch (error) {
      console.warn('Unable to load backend data:', error);
    }
  }

  const login = async (username: string) => {
    try {
      const result = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });

      localStorage.setItem('nexus_token', result.token);
      setCurrentUser({ ...result.user, isAdmin: result.user.isAdmin || result.user.is_admin || false, friends: result.user.friends ?? [], savedPosts: result.user.savedPosts ?? [] });
      await fetchData();
      return true;
    } catch {
      return false;
    }
  };

  const register = async (username: string, name: string) => {
    try {
      const result = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify({ username, name }),
      });

      localStorage.setItem('nexus_token', result.token);
      setCurrentUser({ ...result.user, isAdmin: result.user.isAdmin || result.user.is_admin || false, friends: result.user.friends ?? [], savedPosts: result.user.savedPosts ?? [] });
      await fetchData();
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch {
      // ignore logout failures
    }

    localStorage.removeItem('nexus_token');
    setCurrentUser(null);
    setUsers([]);
    setPosts([]);
    setStories([]);
  };

  const createPost = async (content: string, photoUrl?: string, videoUrl?: string) => {
    if (!currentUser) return;
    await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, photo_url: photoUrl, video_url: videoUrl }),
    });
    await fetchData();
  };

  const toggleLike = async (postId: string) => {
    if (!currentUser) return;
    await apiRequest(`/posts/${postId}/toggle-like`, { method: 'POST' });
    await fetchData();
  };

  const addFriend = async (username: string) => {
    if (!currentUser || currentUser.username === username) return;
    await apiRequest(`/profiles/${username}/follow`, { method: 'POST' });
    await fetchData();
  };

  const removeFriend = async (username: string) => {
    if (!currentUser) return;
    await apiRequest(`/profiles/${username}/follow`, { method: 'POST' });
    await fetchData();
  };

  const getUserByUsername = (username: string) => {
    return users.find(u => u.username === username);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = await apiRequest(`/profiles/${currentUser.username}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : null);
    setUsers(prev => prev.map(u => u.username === updatedUser.username ? { ...u, ...updatedUser } : u));
  };

  const createStory = async (type: 'text' | 'photo', content?: string, photoUrl?: string) => {
    if (!currentUser) return;
    await apiRequest('/stories', {
      method: 'POST',
      body: JSON.stringify({ type, content, photo_url: photoUrl }),
    });
    await fetchData();
  };

  const addComment = async (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    await apiRequest(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    await fetchData();
  };

  const toggleSavePost = async (postId: string) => {
    if (!currentUser) return;
    const savedResponse = await apiRequest(`/posts/${postId}/toggle-save`, { method: 'POST' });

    setCurrentUser(prev => {
      if (!prev) return null;
      const hasSaved = savedResponse.saved;
      return {
        ...prev,
        savedPosts: hasSaved
          ? [...(prev.savedPosts || []), postId]
          : (prev.savedPosts || []).filter(id => id !== postId),
      };
    });
  };

  const getMessages = async (username: string) => {
    if (!currentUser) return [];
    return await apiRequest(`/messages/${username}`);
  };

  const sendMessage = async (username: string, content: string) => {
    if (!currentUser) return;
    await apiRequest(`/messages/${username}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  };

  const fetchAdminStats = async () => {
    return await apiRequest('/admin/stats');
  };

  const fetchAllUsersAdmin = async () => {
    return await apiRequest('/admin/users');
  };

  const adminDeleteUser = async (userId: string) => {
    await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
  };

  const adminDeletePost = async (postId: string) => {
    await apiRequest(`/admin/posts/${postId}`, { method: 'DELETE' });
    await fetchData();
  };

  return (
    <DataContext.Provider value={{
      currentUser, users, posts, stories,
      login, register, logout,
      createPost, toggleLike,
      addFriend, removeFriend,
      getUserByUsername, updateProfile, createStory,
      addComment, toggleSavePost, getMessages, sendMessage,
      fetchAdminStats, fetchAllUsersAdmin, adminDeleteUser, adminDeletePost
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
