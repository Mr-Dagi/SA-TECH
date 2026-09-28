import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { initialSettings, initialProjects, initialBlogs } from '../data/mockData';
import { BlogPost, Comment, Message, Project, ProjectRating, SiteSettings } from '../types';
import { useToast } from '../components/ui/Toast';
import emailjs from 'emailjs-com';

type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'ratings' | 'averageRating' | 'comments'>;
type BlogInput = Omit<BlogPost, 'id' | 'createdAt' | 'comments'> & { category?: string };
type CommentInput = Omit<Comment, 'id' | 'createdAt' | 'replies'>;
type MessageInput = Omit<Message, 'id' | 'createdAt' | 'read'>;

interface DataContextType {
  projects: Project[];
  blogs: BlogPost[];
  messages: Message[];
  settings: SiteSettings;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addProject: (project: ProjectInput) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  rateProject: (id: string, rating: number) => Promise<boolean>;
  addProjectComment: (projectId: string, comment: CommentInput) => Promise<void>;
  addBlog: (blog: BlogInput) => Promise<void>;
  updateBlog: (id: string, blog: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  addBlogComment: (blogId: string, comment: CommentInput) => Promise<void>;
  addMessage: (message: MessageInput) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  markAllMessagesRead: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  dispatch: (action: { type: string; payload: any }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const getVisitorId = (showToast?: (type: 'success' | 'error' | 'info', message: string) => void) => {
  const storedVisitorId = window.localStorage.getItem('visitorId');
  if (storedVisitorId) return storedVisitorId;
  const visitorId = generateId();
  try {
    window.localStorage.setItem('visitorId', visitorId);
  } catch (err) {
    if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      if (showToast) {
        showToast('error', 'Storage quota exceeded. Some data may not be saved.');
      }
    }
  }
  return visitorId;
};

const toArray = <T,>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : []);

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

const isAdminSession = (session: Session | null | undefined) => {
  const email = session?.user?.email?.toLowerCase().trim();
  const role = session?.user?.app_metadata?.role;
  return role === 'admin' || Boolean(email && ADMIN_EMAILS.includes(email));
};

/**
  * Sanitises a URL string - trims whitespace and rejects hash-only values.
  */
const sanitizeUrl = (url: string | undefined): string => {
  if (!url) return '';
  return url.trim() === '#' ? '' : url.trim();
};

const normalizeProject = (project: Project): Project => {
  const ratings = toArray<ProjectRating>(project.ratings).map((rating) =>
    typeof rating === 'number' ? { userId: generateId(), value: rating } : rating
  );

  return {
    ...project,
    ratings,
    averageRating:
      ratings.length > 0
        ? Number((ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length).toFixed(1))
        : project.averageRating || 0,
    comments: toArray(project.comments),
    images: toArray(project.images),
    techStack: toArray(project.techStack)
  };
};

const normalizeBlog = (blog: BlogPost & { visible?: boolean }): BlogPost => ({
  ...blog,
  slug: blog.slug || blog.id,
  tags: toArray(blog.tags),
  comments: toArray(blog.comments),
  published: typeof blog.published === 'boolean' ? blog.published : Boolean(blog.visible)
});

const fromProjectRow = (row: Record<string, any>): Project => normalizeProject({
  ...row,
  techStack: row.techStack ?? row.techstack ?? [],
  videoUrl: row.videoUrl ?? row.videourl,
  githubUrl: row.githubUrl ?? row.githuburl,
  liveUrl: row.liveUrl ?? row.liveurl,
  averageRating: row.averageRating ?? row.averagerating ?? 0,
  createdAt: row.createdAt ?? row.createdat
} as Project);

const fromBlogRow = (row: Record<string, any>): BlogPost => normalizeBlog({
  ...row,
  coverImage: row.coverImage ?? row.coverimage,
  createdAt: row.createdAt ?? row.createdat,
  published: row.published ?? row.visible
} as BlogPost & { visible?: boolean });

const fromMessageRow = (row: Record<string, any>): Message => ({
  ...row,
  createdAt: row.createdAt ?? row.createdat
} as Message);

const toProjectRow = (project: Partial<Project>) => ({
  id: project.id,
  title: project.title,
  description: project.description,
  techstack: project.techStack,
  images: project.images,
  videourl: project.videoUrl,
  githuburl: project.githubUrl,
  liveurl: project.liveUrl,
  ratings: project.ratings,
  averagerating: project.averageRating,
  comments: project.comments,
  createdat: project.createdAt,
  featured: project.featured,
  visible: project.visible
});

const toBlogRow = (blog: Partial<BlogPost>) => ({
  id: blog.id,
  title: blog.title,
  slug: blog.slug,
  content: blog.content,
  excerpt: blog.excerpt,
  coverimage: blog.coverImage,
  category: blog.category,
  tags: blog.tags,
  comments: blog.comments,
  createdat: blog.createdAt,
  published: blog.published
});

const toMessageRow = (message: Message) => ({
  id: message.id,
  name: message.name,
  email: message.email,
  message: message.message,
  createdat: message.createdAt,
  read: message.read,
  response: message.response
});

const fromSettingsRow = (row: Record<string, any>): SiteSettings => ({
  ...row,
  heroTitle: row.heroTitle ?? row.herotitle,
  heroSubtitle: row.heroSubtitle ?? row.herosubtitle,
  aboutText: row.aboutText ?? row.abouttext,
  socialLinks: row.socialLinks ?? row.sociallinks,
  profileImage: row.profileImage ?? row.profileimage,
  cvUrl: row.cvUrl ?? row.cvurl,
  avatarUrl: row.avatarUrl ?? row.avatarurl,
  siteTitle: row.siteTitle ?? row.sitetitle,
  tagline: row.tagline
} as SiteSettings);

const toSettingsRow = (settings: SiteSettings) => ({
  id: 'site-settings',
  herotitle: settings.heroTitle,
  herosubtitle: settings.heroSubtitle,
  abouttext: settings.aboutText,
  skills: settings.skills,
  sociallinks: settings.socialLinks,
  profileimage: settings.profileImage || '/sa-1.png',
  cvurl: settings.cvUrl,
  email: settings.email,
  phone: settings.phone,
  location: settings.location,
  name: settings.name,
  bio: settings.bio,
  avatarurl: '/sa-1.png',
  sitetitle: settings.siteTitle,
  tagline: settings.tagline
});

const getErrorMessage = (fallback: string, error: unknown) =>
  error instanceof Error ? error.message : fallback;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();
  const isManualLogout = useRef(false);

  // no local admin fallback: rely on Supabase auth state only

  const loadData = useCallback(async (session?: Session | null) => {
    setIsLoading(true);
    setError(null);

    try {
      const activeSession = session ?? (await supabase.auth.getSession()).data.session;
      const adminStatus = isAdminSession(activeSession);
      setIsAdmin(adminStatus);

      const [projectsRes, blogsRes, settingsRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('blogs').select('*'),
        supabase.from('site_settings').select('*').limit(1).maybeSingle()
      ]);

      const projectSource = projectsRes.error || !projectsRes.data?.length ? initialProjects : projectsRes.data;
      setProjects(projectSource.map((project) => fromProjectRow(project as Record<string, any>)));

      const blogSource = blogsRes.error || !blogsRes.data?.length ? initialBlogs : blogsRes.data;
      setBlogs(blogSource.map((blog) => fromBlogRow(blog as Record<string, any>)));

      const rawSettings = settingsRes.error || !settingsRes.data ? initialSettings : fromSettingsRow(settingsRes.data as Record<string, any>);
      setSettings({
        ...rawSettings,
        profileImage: rawSettings.profileImage || '/sa-1.png',
        cvUrl: sanitizeUrl(rawSettings.cvUrl) || ''
      });

      if (activeSession && adminStatus) {
        const messagesRes = await supabase.from('messages').select('*').order('createdat', { ascending: false });
        if (messagesRes.data) {
          setMessages(messagesRes.data.map((message) => fromMessageRow(message as Record<string, any>)));
        }
      } else {
        setMessages([]);
      }
    } catch (loadError) {
      setError(getErrorMessage('Unable to load data from Supabase right now.', loadError));
      setProjects(initialProjects.map(normalizeProject));
      setBlogs(initialBlogs.map(normalizeBlog));
    setSettings({
      ...initialSettings,
      profileImage: initialSettings.profileImage || '/sa-1.png',
      cvUrl: sanitizeUrl(initialSettings.cvUrl) || ''
    });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        if (!isManualLogout.current) {
          showToast('error', 'Session expired, please log in again');
        }
        isManualLogout.current = false;
      }
      const adminStatus = isAdminSession(session);
      setIsAdmin(adminStatus);
      if (session && !adminStatus) {
        void supabase.auth.signOut();
      }
      void loadData(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadData, showToast]);

  const normalizeAdminLoginEmail = (value: string) => {
    const normalized = value.trim().toLowerCase().replace(/^@/, '');
    if (normalized === 'mrx' || normalized === 'mrx@yourdomain.com') {
      return ADMIN_EMAILS[0] || value.trim().toLowerCase();
    }
    return value.trim().toLowerCase();
  };

  const login = async (email: string, password: string) => {
    setError(null);
    const emailToUse = normalizeAdminLoginEmail(email);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
    if (authError) {
      setError(authError.message);
      setIsAdmin(false);
      showToast('error', authError.message || 'Login failed');
      return false;
    }

    const adminStatus = isAdminSession(data.session);
    if (!adminStatus) {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setError('Access denied for this account.');
      showToast('error', 'Access denied. Please use the admin account.');
      return false;
    }

    setIsAdmin(true);
    await loadData(data.session);
    showToast('success', 'Logged in successfully!');
    return true;
  };

  const logout = async () => {
    isManualLogout.current = true;
    const { error: authError } = await supabase.auth.signOut();
    if (authError) {
      setError(authError.message);
      isManualLogout.current = false;
      showToast('error', authError.message || 'Logout failed');
      return;
    }
    setIsAdmin(false);
    // no local admin flags to clear
    setMessages([]);
    showToast('success', 'Logged out successfully');
  };

  const addProject = async (projectData: ProjectInput) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date(Date.now()).toISOString(),
      ratings: [],
      averageRating: 0,
      comments: []
    };

    const { error: insertError } = await supabase.from('projects').insert(toProjectRow(newProject));
    if (insertError) {
      setError(insertError.message);
      showToast('error', insertError.message || 'Failed to add project');
      return;
    }
    setProjects((current) => [newProject, ...current]);
    showToast('success', 'Project added successfully!');
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const { error: updateError } = await supabase.from('projects').update(toProjectRow(data)).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      showToast('error', updateError.message || 'Failed to update project');
      return;
    }
    setProjects((current) => current.map((project) => (project.id === id ? normalizeProject({ ...project, ...data }) : project)));
    showToast('success', 'Project updated successfully!');
  };

  const deleteProject = async (id: string) => {
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      showToast('error', deleteError.message || 'Failed to delete project');
      return;
    }
    setProjects((current) => current.filter((project) => project.id !== id));
    showToast('success', 'Project deleted successfully!');
  };

  const rateProject = async (id: string, rating: number) => {
    const visitorId = getVisitorId(showToast);
    const project = projects.find((entry) => entry.id === id);
    if (!project) return false;

    const nextRatings = project.ratings.some((entry) => entry.userId === visitorId)
      ? project.ratings.map((entry) => (entry.userId === visitorId ? { ...entry, value: rating } : entry))
      : [...project.ratings, { userId: visitorId, value: rating }];
    const averageRating = Number((nextRatings.reduce((sum, entry) => sum + entry.value, 0) / nextRatings.length).toFixed(1));

    const { error: ratingError } = await supabase
      .from('projects')
      .update({ ratings: nextRatings, averagerating: averageRating })
      .eq('id', id);
    if (ratingError) {
      setError(ratingError.message);
      showToast('error', ratingError.message || 'Failed to submit rating');
      return false;
    }

    setProjects((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, ratings: nextRatings, averageRating } : entry))
    );
    showToast('success', 'Thank you for rating!');
    return true;
  };

  const addProjectComment = async (projectId: string, commentData: CommentInput) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return;

    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date(Date.now()).toISOString(),
      replies: []
    };
    const comments = [...project.comments, newComment];

    const { error: commentError } = await supabase.from('projects').update({ comments }).eq('id', projectId);
    if (commentError) {
      setError(commentError.message);
      showToast('error', commentError.message || 'Failed to add comment');
      return;
    }
    setProjects((current) => current.map((entry) => (entry.id === projectId ? { ...entry, comments } : entry)));
    showToast('success', 'Comment added!');
  };

  const addBlog = async (blogData: BlogInput) => {
    const newBlog: BlogPost = {
      ...blogData,
      id: generateId(),
      createdAt: new Date(Date.now()).toISOString(),
      comments: []
    };

    const { error: insertError } = await supabase.from('blogs').insert(toBlogRow(newBlog));
    if (insertError) {
      setError(insertError.message);
      showToast('error', insertError.message || 'Failed to add blog post');
      return;
    }
    setBlogs((current) => [newBlog, ...current]);
    showToast('success', 'Blog post created successfully!');
  };

  const updateBlog = async (id: string, data: Partial<BlogPost>) => {
    const { error: updateError } = await supabase.from('blogs').update(toBlogRow(data)).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      showToast('error', updateError.message || 'Failed to update blog post');
      return;
    }
    setBlogs((current) => current.map((blog) => (blog.id === id ? normalizeBlog({ ...blog, ...data }) : blog)));
    showToast('success', 'Blog post updated successfully!');
  };

  const deleteBlog = async (id: string) => {
    const { error: deleteError } = await supabase.from('blogs').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      showToast('error', deleteError.message || 'Failed to delete blog post');
      return;
    }
    setBlogs((current) => current.filter((blog) => blog.id !== id));
    showToast('success', 'Blog post deleted successfully!');
  };

  const addBlogComment = async (blogId: string, commentData: CommentInput) => {
    const blog = blogs.find((entry) => entry.id === blogId);
    if (!blog) return;

    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date(Date.now()).toISOString(),
      replies: []
    };
    const comments = [...blog.comments, newComment];

    const { error: commentError } = await supabase.from('blogs').update({ comments }).eq('id', blogId);
    if (commentError) {
      setError(commentError.message);
      showToast('error', commentError.message || 'Failed to add comment');
      return;
    }
    setBlogs((current) => current.map((entry) => (entry.id === blogId ? { ...entry, comments } : entry)));
    showToast('success', 'Comment added!');
  };

  const addMessage = async (messageData: MessageInput) => {
    const newMessage: Message = {
      ...messageData,
      id: generateId(),
      createdAt: new Date(Date.now()).toISOString(),
      read: false
    };

    const { error: insertError } = await supabase.from('messages').insert(toMessageRow(newMessage));
    if (insertError) {
      setError(insertError.message);
      showToast('error', insertError.message || 'Failed to send message');
      return;
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: messageData.name || 'Visitor',
          from_email: messageData.email,
          message: messageData.text || messageData.content || '',
          to_email: 'dagia2061@gmail.com'
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
    } catch (emailError) {
      console.error('EmailJS send error:', emailError);
    }

    showToast('success', 'Message sent! I\'ll get back to you soon.');
  };

  const markMessageRead = async (id: string) => {
    const { error: updateError } = await supabase.from('messages').update({ read: true }).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      showToast('error', updateError.message || 'Failed to mark message as read');
      return;
    }
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, read: true } : message)));
  };

  const markAllMessagesRead = async () => {
    const unreadIds = messages.filter((message) => !message.read).map((message) => message.id);
    if (!unreadIds.length) return;

    const { error: updateError } = await supabase.from('messages').update({ read: true }).in('id', unreadIds);
    if (updateError) {
      setError(updateError.message);
      showToast('error', updateError.message || 'Failed to mark all messages as read');
      return;
    }
    setMessages((current) => current.map((message) => (message.read ? message : { ...message, read: true })));
    showToast('success', 'All messages marked as read');
  };

  const deleteMessage = async (id: string) => {
    const { error: deleteError } = await supabase.from('messages').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      showToast('error', deleteError.message || 'Failed to delete message');
      return;
    }
    setMessages((current) => current.filter((message) => message.id !== id));
    showToast('success', 'Message deleted');
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const rawNext = { ...settings, ...newSettings };
    // Sanitise URL fields before persisting so injected URLs can never reach the DB
    const nextSettings = {
      ...rawNext,
      profileImage: rawNext.profileImage || '/sa-1.png',
      cvUrl: sanitizeUrl(rawNext.cvUrl) || settings.cvUrl
    };

    const { error: updateError } = await supabase.from('site_settings').upsert(toSettingsRow(nextSettings));
    if (updateError) {
      setError(updateError.message);
      showToast('error', updateError.message || 'Failed to update settings in Supabase');
      return;
    }
    setSettings(nextSettings);
    showToast('success', 'Settings saved successfully!');
  };

  const dispatch = useCallback((action: { type: string; payload: any }) => {
    if (action.type === 'UPDATE_SETTINGS') {
      void updateSettings(action.payload);
    }
  }, [updateSettings]);

  return (
    <DataContext.Provider
      value={{
        projects,
        blogs,
        messages,
        settings,
        isAdmin,
        isLoading,
        error,
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
        markAllMessagesRead,
        deleteMessage,
        updateSettings,
        dispatch
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
