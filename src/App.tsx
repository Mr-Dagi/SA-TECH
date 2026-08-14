import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './shared/context/DataContext';
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

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, authReady } = useData();
  if (!authReady) return null;
  if (!isAdmin) return <Navigate to="/tlku/login" replace />;
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/tlku');

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

        <Route path="/tlku/login" element={<AdminLogin />} />
        <Route path="/tlku" element={<RequireAdmin><AdminLayout><Dashboard /></AdminLayout></RequireAdmin>} />
        <Route path="/tlku/projects" element={<RequireAdmin><AdminLayout><AdminProjects /></AdminLayout></RequireAdmin>} />
        <Route path="/tlku/blog" element={<RequireAdmin><AdminLayout><AdminBlog /></AdminLayout></RequireAdmin>} />
        <Route path="/tlku/messages" element={<RequireAdmin><AdminLayout><AdminMessages /></AdminLayout></RequireAdmin>} />
        <Route path="/tlku/settings" element={<RequireAdmin><AdminLayout><AdminSettings /></AdminLayout></RequireAdmin>} />

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
