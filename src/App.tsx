import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './shared/context/DataContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import './shared/index.css';
import './shared/i18n';
import { Navbar } from './shared/components/layout/Navbar';
import { Footer } from './shared/components/layout/Footer';
import Home from './web/pages/Home';
import About from './web/pages/About';
import Projects from './web/pages/Projects';
import ProjectDetail from './web/pages/ProjectDetail';
import Blog from './web/pages/Blog';
import BlogPost from './web/pages/BlogPost';
import Contact from './web/pages/Contact';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import AdminProjects from './admin/pages/AdminProjects';
import AdminBlog from './admin/pages/AdminBlog';
import AdminMessages from './admin/pages/AdminMessages';
import AdminSettings from './admin/pages/AdminSettings';
import { AdminLayout } from './admin/components/layout/AdminLayout';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
        <Route path="/admin/blog" element={<AdminLayout><AdminBlog /></AdminLayout>} />
        <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
