import { Project, BlogPost, SiteSettings, Message } from '../types';

export const initialSettings: SiteSettings = {
  heroTitle: 'SA-Tech Startup',
  heroSubtitle:
    'We build clear, reliable digital products for ambitious businesses and growing teams.',
  aboutText:
    'SA-Tech Startup combines thoughtful design, modern engineering, and practical strategy to help businesses launch and grow online.',
  skills: [
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'TypeScript', level: 85, category: 'Frontend' },
    { name: 'Tailwind CSS', level: 95, category: 'Frontend' },
    { name: 'Node.js', level: 80, category: 'Backend' },
    { name: 'Figma', level: 85, category: 'Design' }
  ],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' }
  ],
  profileImage: '/sa-1.png',
  cvUrl: '',
  email: 'dagia2061@gmail.com',
  phone: '+251-996-881-232',
  location: 'Addis Ababa, Ethiopia',
  name: 'SA-Tech Startup',
  bio: 'Digital products, software, and technology services',
  avatarUrl: '/sa-1.png',
  siteTitle: 'SA-Tech Startup',
  tagline: 'Digital products and technology services'
};

export const initialProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with real-time inventory management, secure payments, and an intuitive admin dashboard.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    images: ['https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    ratings: [
      { userId: 'demo-1', value: 5 },
      { userId: 'demo-2', value: 4 },
      { userId: 'demo-3', value: 5 }
    ],
    averageRating: 4.6,
    comments: [],
    createdAt: new Date().toISOString(),
    featured: true,
    visible: true
  },
  {
    id: '2',
    title: 'Task Management App',
    description:
      'A collaborative task management tool with real-time updates, drag-and-drop boards, and team analytics.',
    techStack: ['React', 'Firebase', 'Tailwind CSS'],
    images: ['https://images.unsplash.com/photo-1507925922837-326f862811fc?w=800&q=80'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    ratings: [
      { userId: 'demo-4', value: 4 },
      { userId: 'demo-5', value: 4 },
      { userId: 'demo-6', value: 5 }
    ],
    averageRating: 4.3,
    comments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    featured: true,
    visible: true
  },
  {
    id: '3',
    title: 'Portfolio Website',
    description:
      'A dynamic portfolio website with a custom CMS, dark mode support, and smooth animations.',
    techStack: ['React', 'TypeScript', 'Framer Motion'],
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    ratings: [
      { userId: 'demo-7', value: 5 },
      { userId: 'demo-8', value: 5 },
      { userId: 'demo-9', value: 5 }
    ],
    averageRating: 5.0,
    comments: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    featured: true,
    visible: true
  }
];

export const initialBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    slug: 'future-of-web-development',
    excerpt:
      'Exploring upcoming trends in web development, from AI-assisted coding to new rendering paradigms.',
    content:
      'Full content here... Exploring upcoming trends in web development, from AI-assisted coding to new rendering paradigms. The landscape is changing rapidly, and staying ahead means embracing new tools and methodologies.',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    tags: ['Web Dev', 'Future', 'AI'],
    comments: [],
    createdAt: new Date().toISOString(),
    published: true
  },
  {
    id: '2',
    title: 'Mastering React Hooks',
    slug: 'mastering-react-hooks',
    excerpt:
      'A deep dive into advanced React hooks and how they can simplify your state management.',
    content:
      "Full content here... A deep dive into advanced React hooks and how they can simplify your state management. We'll look at custom hooks, useReducer, and performance optimization techniques.",
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: ['React', 'JavaScript', 'Tutorial'],
    comments: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    published: true
  }
];

export const initialMessages: Message[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hi, I love your portfolio! Are you available for freelance work?',
    createdAt: new Date().toISOString(),
    read: false
  }
];
