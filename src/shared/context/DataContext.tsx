import React, { useEffect, useState, createContext, useContext } from 'react';
import { Project, BlogPost, Message, SiteSettings, Comment } from '../types';
import {
  initialProjects,
  initialBlogs,
  initialMessages,
  initialSettings } from
'../data/mockData';
interface DataContextType {
  projects: Project[];
  blogs: BlogPost[];
  messages: Message[];
  settings: SiteSettings;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  // Projects
  addProject: (
  project: Omit<
    Project,
    'id' | 'createdAt' | 'ratings' | 'averageRating' | 'comments'>)

  => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  rateProject: (id: string, rating: number) => void;
  addProjectComment: (
  projectId: string,
  comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>)
  => void;
  // Blogs
  addBlog: (blog: Omit<BlogPost, 'id' | 'createdAt' | 'comments'>) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  addBlogComment: (
  blogId: string,
  comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>)
  => void;
  // Messages
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  // Settings
  updateSettings: (settings: Partial<SiteSettings>) => void;
}
const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('blogs');
    return saved ? JSON.parse(saved) : initialBlogs;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }, [blogs]);
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);
  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);
  const generateId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  // Projects CRUD
  const addProject = (projectData: any) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      ratings: [],
      averageRating: 0,
      comments: []
    };
    setProjects([newProject, ...projects]);
  };
  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(
      projects.map((p) =>
      p.id === id ?
      {
        ...p,
        ...data
      } :
      p
      )
    );
  };
  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };
  const rateProject = (id: string, rating: number) => {
    setProjects(
      projects.map((p) => {
        if (p.id === id) {
          const newRatings = [...p.ratings, rating];
          const avg = newRatings.reduce((a, b) => a + b, 0) / newRatings.length;
          return {
            ...p,
            ratings: newRatings,
            averageRating: avg
          };
        }
        return p;
      })
    );
  };
  const addProjectComment = (projectId: string, commentData: any) => {
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      replies: []
    };
    setProjects(
      projects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );
  };
  // Blogs CRUD
  const addBlog = (blogData: any) => {
    const newBlog: BlogPost = {
      ...blogData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      comments: []
    };
    setBlogs([newBlog, ...blogs]);
  };
  const updateBlog = (id: string, data: Partial<BlogPost>) => {
    setBlogs(
      blogs.map((b) =>
      b.id === id ?
      {
        ...b,
        ...data
      } :
      b
      )
    );
  };
  const deleteBlog = (id: string) => {
    setBlogs(blogs.filter((b) => b.id !== id));
  };
  const addBlogComment = (blogId: string, commentData: any) => {
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      replies: []
    };
    setBlogs(
      blogs.map((b) => {
        if (b.id === blogId) {
          return {
            ...b,
            comments: [...b.comments, newComment]
          };
        }
        return b;
      })
    );
  };
  // Messages CRUD
  const addMessage = (messageData: any) => {
    const newMessage: Message = {
      ...messageData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages([newMessage, ...messages]);
  };
  const markMessageRead = (id: string) => {
    setMessages(
      messages.map((m) =>
      m.id === id ?
      {
        ...m,
        read: true
      } :
      m
      )
    );
  };
  const deleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };
  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings({
      ...settings,
      ...newSettings
    });
  };
  return (
    <DataContext.Provider
      value={{
        projects,
        blogs,
        messages,
        settings,
        isAdmin,
        login,
        logout,
        addProject,
        updateProject,
        deleteProject,
        rateProject,
        addProjectComment,
        addBlog,
        updateBlog,
        deleteBlog,
        addBlogComment,
        addMessage,
        markMessageRead,
        deleteMessage,
        updateSettings
      }}>
      
      {children}
    </DataContext.Provider>);

};
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};