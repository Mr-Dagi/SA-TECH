import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './shared/context/DataContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import { ToastProvider } from './shared/components/ui/Toast';
import { ScrollManager } from './shared/components/ui/ScrollManager';
import { BackToTopButton } from './shared/components/ui/BackToTopButton';
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
import NotFound from './web/pages/NotFound';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import AdminProjects from './admin/pages/AdminProjects';
import AdminBlog from './admin/pages/AdminBlog';
import AdminMessages from './admin/pages/AdminMessages';
import AdminSettings from './admin/pages/AdminSettings';
import { AdminLayout } from './admin/components/layout/AdminLayout';
import { ProtectedRoute } from './admin/components/ProtectedRoute';

const ChatAssistant = lazy(() => import('./shared/components/ui/ChatAssistant'));

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
        <Route path="/tlku" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/tlku/projects" element={<ProtectedRoute><AdminLayout><AdminProjects /></AdminLayout></ProtectedRoute>} />
        <Route path="/tlku/blog" element={<ProtectedRoute><AdminLayout><AdminBlog /></AdminLayout></ProtectedRoute>} />
        <Route path="/tlku/messages" element={<ProtectedRoute><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />
        <Route path="/tlku/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminPath && <Footer />}
      {!isAdminPath && (
        <Suspense fallback={null}>
          <ChatAssistant />
          <BackToTopButton />
        </Suspense>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <DataProvider>
            <ScrollManager />
            <AppContent />
          </DataProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
