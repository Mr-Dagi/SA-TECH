export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  images: string[];
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  ratings: number[];
  averageRating: number;
  comments: Comment[];
  createdAt: string;
  featured: boolean;
  visible: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  comments: Comment[];
  createdAt: string;
  visible: boolean;
}

export interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  replies: Comment[];
  parentId?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  response?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  skills: Skill[];
  socialLinks: SocialLink[];
  profileImage: string;
  cvUrl: string;
  email: string;
  phone: string;
  location: string;
}